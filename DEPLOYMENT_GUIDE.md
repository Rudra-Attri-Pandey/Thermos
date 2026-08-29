# Thermos AI — Deployment Guide

## Quick Start (Local Development)

```bash
# 1. Install dependencies
npm install

# 2. Start proxy server (Terminal 1)
npm run dev:server
# → http://localhost:8787 (proxy + API)
#    /api/health, /api/fortyguard/*, /api/nemotron

# 3. Start frontend (Terminal 2)
npm run dev
# → http://localhost:5173 (Vite dev server)
```

**Environment:** Create `.env` from `.env.example`:
```bash
cp .env.example .env
# Edit with your keys:
# FORTYGUARD_API_KEY=your_key
# NVIDIA_API_KEY=your_nvapi_key
# PORT=8787
```

---

## Production Deployment

### Option 1: Render (Recommended — Free Tier)

1. **Push to GitHub** (see below)
2. **Create Web Service on Render:**
   - Connect GitHub repo
   - Build Command: `npm install && npm run build`
   - Start Command: `node server/index.js`
   - Environment Variables:
     ```
     FORTYGUARD_API_KEY=your_key
     NVIDIA_API_KEY=your_nvapi_key
     PORT=8787
     NODE_ENV=production
     ```
3. **Deploy** → Get URL like `https://thermos-ai.onrender.com`

**Health Check:** `https://your-app.onrender.com/api/health`

---

### Option 2: Railway

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login & deploy
railway login
railway init
railway add --env FORTYGUARD_API_KEY=your_key
railway add --env NVIDIA_API_KEY=your_nvapi_key
railway up
```

---

### Option 3: Docker (Any VPS)

```dockerfile
# Dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 8787
CMD ["node", "server/index.js"]
```

```bash
docker build -t thermos-ai .
docker run -d -p 8787:8787 \
  -e FORTYGUARD_API_KEY=your_key \
  -e NVIDIA_API_KEY=your_nvapi_key \
  -e PORT=8787 \
  thermos-ai
```

---

## Required Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `FORTYGUARD_API_KEY` | ✅ Yes | From FortyGuard dashboard |
| `NVIDIA_API_KEY` | ✅ Yes | From build.nvidia.com (starts with `nvapi-`) |
| `PORT` | Optional | Default: 8787 |
| `NODE_ENV` | Optional | `production` |

---

## GitHub Push & Judge Invite

```bash
# 1. Create repo on GitHub (web or CLI)
gh repo create Thermos --public --source=. --remote=origin --push

# 2. Or manual:
git remote add origin https://github.com/<USERNAME>/Thermos.git
git push -u origin main

# 3. Invite judge
gh api repos/<USERNAME>/Thermos/collaborators/hackathon@fortyguard.com \
  -X PUT -f permission=write
```

---

## Verification Checklist

### Local
```bash
npm run build           # ✓ 1601 modules, 501kB
npm run dev:server      # → http://localhost:8787/api/health
npm run dev             # → http://localhost:5173
node scripts/routing-test.mjs sanjose   # 10378 live cells
node scripts/agent-smoke-test.mjs       # live-agentic mode
```

### Production
```bash
curl https://your-app.onrender.com/api/health
# {"status":"ok","fortyguard":true,"nemotron":true}
```

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| `ECONNREFUSED` on `/api/*` | Proxy not running → `npm run dev:server` |
| `401 Unauthorized` from FortyGuard | Invalid/expired `FORTYGUARD_API_KEY` |
| `401 Unauthorized` from NVIDIA | Invalid/expired `NVIDIA_API_KEY` |
| `ECONNREFUSED` on `/api/nemotron` | Proxy not running or NVIDIA key invalid |
| Build fails on `HeatEquity.jsx` | Run `npm run build` locally first |
| `Pulse` not exported | Use `Activity` from `lucide-react` |

---

## Key Files Reference

| File | Purpose |
|------|---------|
| `server/index.js` | Express proxy (keys never in browser) |
| `src/services/fortyGuardApi.js` | FortyGuard API client + normalizers |
| `src/services/multiAgentSwarm.js` | Agentic loop + tool definitions |
| `src/services/routingEngine.js` | Exposure-optimal routing |
| `src/services/physicsSimulator.js` | UrbanSim physics |
| `src/components/MapView.jsx` | Leaflet map + layers |
| `src/components/AgentTerminal.jsx` | Glassmorphism terminal |
| `src/components/TrackTabs.jsx` | 7-track navigation |
| `vite.config.js` | `/api` proxy for dev |

---

## Environment Variables for CI/CD

```yaml
# GitHub Actions example
env:
  FORTYGUARD_API_KEY: ${{ secrets.FORTYGUARD_API_KEY }}
  NVIDIA_API_KEY: ${{ secrets.NVIDIA_API_KEY }}
```

---

## Support

- **FortyGuard API:** https://fortyguard.com/docs
- **NVIDIA NIM:** https://build.nvidia.com
- **Issues:** GitHub Issues on repo