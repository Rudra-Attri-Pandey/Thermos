/**
 * Thermos AI — Secure API Proxy Server
 * Holds FortyGuard + NVIDIA keys server-side. The browser never sees a key.
 *
 * Routes:
 *   ALL  /api/fortyguard/*   -> https://api.fortyguard.com/v1/*
 *   POST /api/nemotron       -> https://integrate.api.nvidia.com/v1/chat/completions
 *   GET  /api/health         -> liveness check
 *   Static: serves ./dist in production
 */

import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import express from 'express';

try {
  const dotenv = await import('dotenv');
  dotenv.config();
} catch (_) {
  // dotenv optional; env vars may come from the host platform instead
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
app.use(express.json({ limit: '2mb' }));

const FORTYGUARD_BASE = 'https://api.fortyguard.com';
const NIM_CHAT_URL = 'https://integrate.api.nvidia.com/v1/chat/completions';

const FORTYGUARD_KEY = process.env.FORTYGUARD_API_KEY;
const NVIDIA_KEY = process.env.NVIDIA_API_KEY;
const PORT = process.env.PORT || 8787;

// OmniRoute gateway — one endpoint, 350 providers, auto-fallback, RTK+Caveman compression
const OMNIROUTE_BASE_URL = (process.env.OMNIROUTE_BASE_URL || 'http://localhost:20128/v1').replace(/\/$/, '');
const OMNIROUTE_ENABLED = process.env.OMNIROUTE_ENABLED !== 'false'; // default ON, set false to force direct NIM
const OMNIROUTE_API_KEY = process.env.OMNIROUTE_API_KEY || ''; // optional — OmniRoute works keyless via auto/oc/*

async function isOmniRouteAlive() {
  if (!OMNIROUTE_ENABLED) return false;
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 1500);
    const r = await fetch(`${OMNIROUTE_BASE_URL.replace(/\/v1$/, '')}/api/health`, { signal: ctrl.signal }).catch(() => null);
    clearTimeout(t);
    if (r && r.ok) return true;
    // fallback probe: /v1/models (OpenAI-compatible)
    const ctrl2 = new AbortController();
    const t2 = setTimeout(() => ctrl2.abort(), 1500);
    const r2 = await fetch(`${OMNIROUTE_BASE_URL}/models`, { headers: OMNIROUTE_API_KEY ? { Authorization: `Bearer ${OMNIROUTE_API_KEY}` } : {}, signal: ctrl2.signal }).catch(() => null);
    clearTimeout(t2);
    return Boolean(r2 && r2.ok);
  } catch { return false; }
}

if (!FORTYGUARD_KEY) {
  console.warn('[thermos] FORTYGUARD_API_KEY missing — FortyGuard proxy will return 500 until set in .env');
}
if (!NVIDIA_KEY) {
  console.warn('[thermos] NVIDIA_API_KEY missing — Nemotron proxy will return 500 until set in .env');
}

/**
 * Generic FortyGuard passthrough.
 * Frontend calls e.g. POST /api/fortyguard/heatmap or GET /api/fortyguard/status/<id>
 * The api-key header and api_key body field are injected here, never in the browser.
 */
app.use('/api/fortyguard', async (req, res) => {
  if (!FORTYGUARD_KEY) {
    return res.status(500).json({ error: 'Server misconfigured: FORTYGUARD_API_KEY not set' });
  }
  const upstreamUrl = `${FORTYGUARD_BASE}/v1${req.path}`;
  const headers = {
    'api-key': FORTYGUARD_KEY,
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  };

  const fetchOptions = { method: req.method, headers };

  if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
    const body = { ...(req.body || {}) };
    // Upstream usage endpoint expects the api_key in the payload
    if (req.path.includes('fetch-api-key-usage')) {
      body.api_key = FORTYGUARD_KEY;
    }
    fetchOptions.body = JSON.stringify(body);
  }

  try {
    const upstream = await fetch(upstreamUrl, fetchOptions);
    const contentType = upstream.headers.get('content-type') || 'application/json';
    res.status(upstream.status).setHeader('Content-Type', contentType);
    if (contentType.includes('application/json')) {
      const data = await upstream.json().catch(() => ({}));
      return res.send(data);
    }
    const text = await upstream.text();
    return res.send(text);
  } catch (err) {
    console.error('[thermos] FortyGuard proxy error:', err.message);
    return res.status(502).json({ error: 'Upstream FortyGuard request failed', detail: err.message });
  }
});

/**
 * NVIDIA Nemotron chat completions — OmniRoute-aware.
 * Strategy: if OmniRoute is alive, route via http://localhost:20128/v1/chat/completions
 * with auto-fallback across 350 providers (auto model) + RTK compression.
 * Otherwise fall back to direct NVIDIA NIM. No behavior change for frontend.
 */
app.post('/api/nemotron', async (req, res) => {
  const payload = req.body || {};
  const requestedModel = payload.model || 'nvidia/nemotron-3-ultra-550b-a55b';

  // Try OmniRoute first (one endpoint, quota-aware fallback, 15-95% token savings)
  if (OMNIROUTE_ENABLED && await isOmniRouteAlive()) {
    try {
      // Map Nemotron model -> OmniRoute model. Keep original if user sent custom,
      // otherwise use `auto` for best free-tier fallback (90+ free providers).
      const omniModel = requestedModel.includes('nemotron') ? 'auto' : requestedModel;
      const body = { ...payload, model: omniModel };
      const headers = { 'Content-Type': 'application/json', 'Accept': 'application/json' };
      if (OMNIROUTE_API_KEY) headers['Authorization'] = `Bearer ${OMNIROUTE_API_KEY}`;
      const upstream = await fetch(`${OMNIROUTE_BASE_URL}/chat/completions`, {
        method: 'POST',
        headers,
        body: JSON.stringify(body)
      });
      const data = await upstream.json().catch(() => ({}));
      // If OmniRoute returns 402/429/5xx, transparently fall through to direct NIM
      if (upstream.ok) {
        res.setHeader('X-Thermos-Gateway', 'omniroute');
        res.setHeader('X-Thermos-OmniModel', omniModel);
        return res.status(upstream.status).json(data);
      }
      console.warn(`[thermos] OmniRoute ${upstream.status} — falling back to direct NIM`);
    } catch (err) {
      console.warn('[thermos] OmniRoute unreachable, falling back to NIM:', err.message);
    }
  }

  // Direct NIM fallback (original behavior)
  if (!NVIDIA_KEY) {
    return res.status(500).json({ error: 'Server misconfigured: NVIDIA_API_KEY not set and OmniRoute unavailable' });
  }
  try {
    const upstream = await fetch(NIM_CHAT_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${NVIDIA_KEY}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    const data = await upstream.json().catch(() => ({}));
    res.setHeader('X-Thermos-Gateway', 'direct-nim');
    return res.status(upstream.status).json(data);
  } catch (err) {
    console.error('[thermos] Nemotron proxy error:', err.message);
    return res.status(502).json({ error: 'Upstream NVIDIA request failed', detail: err.message });
  }
});

/**
 * Generic AI gateway via OmniRoute — any model, any provider.
 * POST /api/ai/chat  -> POST {OMNIROUTE_BASE_URL}/chat/completions  (OpenAI-compatible)
 * POST /api/ai/responses -> POST {OMNIROUTE_BASE_URL}/responses
 * Frontend can call { model: "auto" } for zero-config or specific e.g. "openai/gpt-4o-mini", "anthropic/claude-sonnet-4", "google/gemini-2.0-flash"
 */
app.post('/api/ai/chat', async (req, res) => {
  if (!OMNIROUTE_ENABLED) return res.status(503).json({ error: 'OmniRoute disabled via OMNIROUTE_ENABLED=false' });
  try {
    const headers = { 'Content-Type': 'application/json', 'Accept': 'application/json' };
    if (OMNIROUTE_API_KEY) headers['Authorization'] = `Bearer ${OMNIROUTE_API_KEY}`;
    // Pass through to OmniRoute verbatim — it handles translation (OpenAI<->Claude<->Gemini)
    const upstream = await fetch(`${OMNIROUTE_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers,
      body: JSON.stringify(req.body || {})
    });
    const data = await upstream.json().catch(async () => ({ raw: await upstream.text().catch(() => '') }));
    res.setHeader('X-Thermos-Gateway', 'omniroute');
    return res.status(upstream.status).json(data);
  } catch (err) {
    return res.status(502).json({ error: 'OmniRoute gateway failed', detail: err.message, hint: 'Is OmniRoute running on ' + OMNIROUTE_BASE_URL + '? Run: npm run dev in ./OmniRoute or: npx omniroute' });
  }
});

app.get('/api/ai/models', async (req, res) => {
  try {
    const headers = { 'Accept': 'application/json' };
    if (OMNIROUTE_API_KEY) headers['Authorization'] = `Bearer ${OMNIROUTE_API_KEY}`;
    const upstream = await fetch(`${OMNIROUTE_BASE_URL}/models`, { headers });
    const data = await upstream.json().catch(() => ({ models: [] }));
    return res.status(upstream.status).json(data);
  } catch (err) {
    return res.status(502).json({ error: 'OmniRoute unreachable', detail: err.message });
  }
});

app.get('/api/ai/health', async (req, res) => {
  const alive = await isOmniRouteAlive();
  return res.json({ omniroute: alive ? 'alive' : 'unreachable', baseUrl: OMNIROUTE_BASE_URL, enabled: OMNIROUTE_ENABLED });
});

app.get('/api/health', async (req, res) => {
  const omniAlive = OMNIROUTE_ENABLED ? await isOmniRouteAlive() : false;
  res.json({
    status: 'ok',
    fortyguard: Boolean(FORTYGUARD_KEY),
    nemotron: Boolean(NVIDIA_KEY),
    omniroute: { enabled: OMNIROUTE_ENABLED, baseUrl: OMNIROUTE_BASE_URL, alive: omniAlive }
  });
});

// Serve the production build when present
const distDir = path.join(__dirname, '..', 'dist');
if (fs.existsSync(distDir)) {
  app.use(express.static(distDir));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api/')) return next();
    return res.sendFile(path.join(distDir, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`[thermos] Secure proxy listening on http://localhost:${PORT}`);
  console.log(`[thermos] FortyGuard key: ${FORTYGUARD_KEY ? 'loaded' : 'MISSING'} | NVIDIA key: ${NVIDIA_KEY ? 'loaded' : 'MISSING'}`);
  console.log(`[thermos] OmniRoute: ${OMNIROUTE_ENABLED ? OMNIROUTE_BASE_URL + (OMNIROUTE_API_KEY ? ' (auth)' : ' (keyless auto)') : 'DISABLED'}`);
});
