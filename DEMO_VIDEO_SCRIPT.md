# Thermos AI — Demo Video Script (≤3 minutes)

## Overview
**Duration:** 2:45 max  
**Target:** FortyGuard Hackathon '26 judges  
**Key message:** "First autonomous climate intelligence that thinks, calls tools, and acts — no hardware, all software."

---

## Shot List & Timing

### 0:00–0:10 — Hook (10s)
**Visual:** Dark glassmorphism dashboard loads, San Jose heatmap pulses at 32.3°C peak  
**Audio:** "What if every delivery rider, construction crew, and city planner could see heat in real-time — and navigate around it?"  
**Action:** Camera pans from macro heatmap → zoom into 2m resolution cells

---

### 0:10–0:35 — The Problem (25s)
**Visual:** Split screen — Standard route (red, 29.6°C, 12% shade) vs CoolPath (cyan, 29.0°C, 82% shade)  
**Data overlay:** "14 °C·minutes saved • 2% exposure reduction • Zero time penalty"  
**Voiceover:** "FortyGuard's 2-meter temperature API gives us pedestrian-level truth. Our agent finds the coolest path — not the shortest."

---

### 0:35–1:00 — The Agentic Brain (25s)
**Visual:** Agent Terminal live — type "Audit heat risk in San Jose" → reasoning trace streams → tool calls fire: `fetch_thermal_heatmap` → `fetch_env_params` → `compute_cool_route` → `run_urban_simulation`  
**Terminal close-up:** Chain-of-thought tokens scroll in real-time  
**Voiceover:** "Not a chatbot. An autonomous swarm: Sentinel ingests live FortyGuard data, Thermal Shadow computes exposure-optimal routes, UrbanSim runs physics simulations. Nemotron 3 Ultra decides which tools to call and when."

---

### 1:00–1:30 — UrbanSim Physics Engine (30s)
**Visual:** Interactive sliders — Tree Canopy +30%, Cool Roofs 50%, Misting Hubs 6 → Live ΔT = -6°C, $2.31M/yr savings, 252 hospitalizations avoided, 11,100 tCO₂/yr  
**UI:** Policy Brief auto-generates with Priority 1/2/3 actions  
**Voiceover:** "What-if physics in real-time. Evapotranspiration + albedo + misting economics. Every number traceable to live FortyGuard data."

---

### 1:30–1:55 — Heat Equity & Worker Safety (25s)
**Visual:** District disparity map — District A (+4.2°C, $18.50/hr labor loss) vs District C (-3.1°C thermal buffer)  
**ThermoSafe panel:** Live crew telemetry — heart rate, core temp, OSHA rest cycles auto-dispatched  
**Voiceover:** "Heat hits hardest where canopy is lowest. ThermoSafe auto-dispatches OSHA rest cycles and shaded routes to protect 1.7M outdoor workers."

---

### 1:55–2:20 — Architecture & Security (25s)
**Visual:** Diagram — Browser → Express Proxy (keys never in bundle) → FortyGuard API / Nemotron NIM → Live data → Glassmorphism UI  
**Code close-up:** `.env` with `FORTYGUARD_API_KEY` / `NVIDIA_API_KEY` — never in bundle  
**Voiceover:** "Zero hardware. Express proxy keeps API keys server-side. Browser never sees a key."

---

### 2:20–2:40 — Live Verification (20s)
**Visual:** Terminal → `node scripts/routing-test.mjs sanjose` → 10,378 live cells → `node scripts/agent-smoke-test.mjs` → live-agentic mode, 72s, reasoning traces  
**Terminal output:** Real API calls, live reasoning traces, executive brief with coordinates  
**Voiceover:** "Every number verifiable. Live API, synthetic fallback only when API unreachable."

---

### 2:40–2:45 — Closing (5s)
**Visual:** Thermos AI logo + "Autonomous Climate Intelligence" + FortyGuard Hackathon '26 badge  
**Text:** "Thermos AI — The world's first autonomous climate intelligence. Track 06: Agentic AI"  
**Voiceover:** "Thermos AI. Autonomous climate intelligence that thinks, calls tools, and acts."

---

## Production Notes

### Recording Setup
- **Resolution:** 1920x1080 minimum
- **Frame rate:** 30fps minimum
- **Audio:** Clear narration, minimal background noise
- **Terminal font:** JetBrains Mono, size 14+
- **Browser zoom:** 100% (dev tools closed)

### Key Moments to Capture (don't miss)
1. Live reasoning trace tokens streaming
2. Tool call → result flow in terminal
3. Live heatmap cells rendering (10378 cells)
4. CoolPath vs Standard side-by-side
5. UrbanSim sliders → instant recalculation
6. LIVE/DEMO badge switching on fallback
5. Executive brief with real coordinates

### Fallback Plan (if live API slow)
- Pre-record agentic loop as backup
- Have synthetic data screenshots ready
- Keep narration same — just swap footage

---

## File Locations for Recording

| Asset | Path |
|-------|------|
| Main demo | `npm run dev` → `http://localhost:5173` |
| Terminal tests | `node scripts/routing-test.mjs sanjose` |
| Agentic test | `node scripts/agent-smoke-test.mjs` |
| Server logs | `npm run dev:server` → `http://localhost:8787/api/health` |

---

## Quick Commands for Recording Day

```bash
# Terminal 1 - Dev server
npm run dev:server

# Terminal 2 - Frontend
npm run dev

# Terminal 3 - Smoke tests (run during recording)
node scripts/routing-test.mjs sanjose
node scripts/agent-smoke-test.mjs
```

---

## Submission Checklist (post-recording)

- [ ] Video ≤ 3 minutes (MP4, 1080p)
- [ ] GitHub repo public + `hackathon@fortyguard.com` collaborator
- [ ] Live demo URL accessible
- [ ] `submission/SUBMISSION_FORM_ANSWERS.md` updated with URLs
- [ ] `submission/DEMO_VIDEO_SCRIPT.md` matches final video
- [ ] Form submitted before deadline