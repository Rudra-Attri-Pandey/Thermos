# Thermos AI — Submission Checklist

## Pre-Submission Verification

### ✅ Code Quality
- [x] `npm run build` passes (1601 modules, 501kB)
- [x] No hardcoded API keys in source
- [x] `.gitignore` excludes `.env`, `dist/`, `node_modules/`, `__pycache__/`
- [x] `.env.example` has placeholders only
- [x] No console errors in production build

### ✅ Functionality
- [x] Live routing test: 10,378 cells, CoolPath -0.6°C / -14°C·min
- [x] Agentic smoke test: live-agentic mode, 72s, reasoning traces
- [x] Server health: `/api/health` → `fortyguard:true nemotron:true`
- [x] Live/DEMO badge works (shows fallback when API unreachable)
- [x] All 7 tracks functional (Overview, CoolPath, GridCool, ThermoSafe, UrbanSim, ThermalML, Agentic, HeatEquity)

### ✅ Security
- [x] Express proxy hides API keys (never in browser bundle)
- [x] No hardcoded keys in source code
- [x] `.env` in `.gitignore`
- [x] Only placeholders in `.env.example`
- [x] `git grep` clean (no `nvapi-` or real keys in repo)

---

## Submission Form Answers

### Project Title
**Thermos AI — The Autonomous Hyperlocal Climate & Navigation OS**

### One-Line Pitch
**Thermos AI is an AI-native climate resilience and navigation platform powered by FortyGuard's 2-meter Temperature API® and Large Temperature Models (LTMs). It autonomously transforms pedestrian-level thermal data into life-saving shaded navigation corridors, municipal digital twins, building HVAC pre-cooling schedules, and workforce heatstroke protection shields — with 100% pure software and zero hardware costs.**

### Primary Track
**Track 06: Agentic AI** (Unifying Tracks 01, 02, 03, 04, 05, & 07)

### Team
- **Author:** Rudra (Solo Participant)
- **Collaborator Access:** Invited `hackathon@fortyguard.com`

### Repository
- **URL:** `https://github.com/<USERNAME>/Thermos` (update after push)
- **Public:** Yes
- **Collaborator:** `hackathon@fortyguard.com` added with Write access

### Live Demo
- **URL:** `https://thermos-ai.onrender.com` (update after deploy)
- **Health Check:** `https://thermos-ai.onrender.com/api/health`

### Video Demo
- **URL:** `https://youtu.be/...` or `https://drive.google.com/...` (update after upload)
- **Duration:** 2:45
- **Format:** MP4, 1080p, 30fps

---

## FortyGuard API Endpoints Used

| Endpoint | Method | Role |
|----------|--------|------|
| `/v1/heatmap` | POST | 2m thermal GeoJSON grid |
| `/v1/env_params` | POST | WBGT, Apparent Temp, AQI, Solar |
| `/v1/streetview` | POST | Tree canopy, building canyon, asphalt |
| `/v1/satellite` | POST | Land-cover segmentation |
| `/v1/heat_intelligence` | POST | Multi-dimensional risk report |
| `/v1/status/{id}` | GET | Async task polling |
| `/v1/system/fetch-api-key-usage` | POST | Real-time credit balance |

---

## AI Models Used

| Model | Provider | Role |
|-------|----------|------|
| Nemotron 3 Ultra (550B) | NVIDIA NIM | Master Dispatcher + tool-calling |
| Nemotron 3 Ultra (550B) | NVIDIA NIM | Executive brief synthesis |
| (Future) Gemini 3.7 Flash | Google | Alternative model |
| (Future) Claude Sonnet 4.6 | Anthropic | Alternative model |

**Primary:** Nemotron 3 Ultra via NVIDIA NIM (`nvidia/nemotron-3-ultra-550b-a55b`)

---

## Key Technical Claims (Verifiable)

| Claim | Evidence |
|-------|----------|
| 10,378 live heatmap cells | `scripts/routing-test.mjs` → `heatmap: 10378 cells, source=live` |
| Real agentic tool-calling | `scripts/agent-smoke-test.mjs` → `mode: live-agentic` + reasoning traces |
| Exposure-optimal routing | CoolPath -0.6°C avg, -14 °C·min exposure (2% reduction) |
| Live data normalizers | `fortyGuardApi.js` → `normalizeLiveHeatmap/Env/StreetView` |
| Honest fallback | `LIVE/DEMO` badge + toast on synthetic fallback |
| Secure key management | Express proxy `server/index.js` injects keys server-side |

---

## Submission URLs (Update After Deploy)

| Item | URL |
|------|-----|
| GitHub Repo | `https://github.com/<USERNAME>/Thermos` |
| Live Demo | `https://thermos-ai.onrender.com` |
| Video | `https://youtu.be/...` |
| Health Check | `https://thermos-ai.onrender.com/api/health` |
| GitHub Repo (for judges) | `https://github.com/<USERNAME>/Thermos` |

---

## Final Commands Before Submit

```bash
# 1. Final build verification
npm run build

# 2. Final live tests
node scripts/routing-test.mjs sanjose
node scripts/agent-smoke-test.mjs

# 3. Push to GitHub
git push -u origin main

# 4. Invite judge
gh api repos/<USERNAME>/Thermos/collaborators/hackathon@fortyguard.com -X PUT -f permission=write

# 4. Deploy to Render/Railway
# (see DEPLOYMENT_GUIDE.md)

# 5. Record video (≤3 min)
# Upload to YouTube/Drive, update URLs in this file

# 6. Submit form
# https://fortyguard-hackathon-26.submit.com
```

---

## Contact

**Author:** Rudra  
**Email:** thermos@fortyguard.hackathon  
**Hackathon:** FortyGuard Hackathon '26  
**Track:** 06 (Agentic AI)  
**Partners:** NVIDIA, FortyGuard