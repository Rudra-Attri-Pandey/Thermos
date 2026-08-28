# 🌡️ Thermos AI — The Autonomous Hyperlocal Climate & Navigation OS

> **Official Submission for FortyGuard Hackathon ’26 — "Building the World's Temperature AI"**  
> *Partnered with NVIDIA & FortyGuard*  
> **Primary Track:** Track 06: Agentic AI *(Unifying Tracks 01, 02, 03, 04, 05, & 07)*  
> **Author:** Rudra (Solo Participant)  
> **Collaborator Access:** Invited `hackathon@fortyguard.com`

---

## 🌟 Executive Summary & One-Line Pitch
**Thermos AI** is an AI-native climate resilience and navigation platform powered by **FortyGuard's 2-meter Temperature API®** and **Large Temperature Models (LTMs)**. It autonomously transforms pedestrian-level thermal data into life-saving shaded navigation corridors, municipal digital twins, building HVAC pre-cooling schedules, and workforce heatstroke protection shields — with **100% pure software and zero hardware costs**.

---

## 🚀 4 Killer Global X-Factors

1. **🕶️ Thermal Shadow & Microclimate Navigation Engine (Track 01 & 03)**
   - Computes solar zenith geometry, building canyon shadows, and FortyGuard 2m StreetView tree-canopy data to route pedestrians and gig workers through **4°C–7°C cooler shaded corridors**.
2. **🤖 Glass-Box Multi-Agent Swarm (Track 06 Flagship)**
   - A closed-loop autonomous multi-agent pipeline with a live visual terminal displaying step-by-step FortyGuard tool executions and reasoning in real time.
3. **🌳 Generative Urban Biome Digital Twin ("What-If" Physics Engine - Track 04 & 05)**
   - Interactive slider-driven simulation calculating real-time temperature drop ($\Delta T$), annual municipal power savings ($/year), and carbon offsets from tree canopy expansion and cool-roof albedo coatings.
4. **⚖️ Heat Equity & Labor Loss Index (Track 07)**
   - Correlates thermal anomalies with socioeconomic data (canopy deficits in underserved districts) to calculate Heat Inequity Scores and hourly worker productivity loss.

---

## 🏗️ Multi-Agent Swarm Architecture (Division of Labor)

```
                                ┌───────────────────────────────────────────────────────────┐
                                │             THERMOS GEOSPATIAL COMMAND CENTER             │
                                │   (Dark Glassmorphism · Cyber-Climate UI · 2m Heatmap)    │
                                └─────────────────────────────┬─────────────────────────────┘
                                                              │
                                   ┌──────────────────────────▼──────────────────────────┐
                                   │        🤖 Master Dispatcher Copilot (Track 06)      │
                                   │       (Intent Parsing · Tool Dispatch · Orchestrator)│
                                   └──────────────────────────┬──────────────────────────┘
                                                              │
         ┌───────────────────┬────────────────────────┼───────────────────────┬───────────────────┐
         │                   │                        │                       │                   │
┌────────▼────────┐ ┌────────▼────────┐      ┌────────▼────────┐     ┌────────▼────────┐ ┌────────▼────────┐
│ 🌐 Sentinel     │ │ 🚶 Thermal      │      │ ⚡ GridCool     │     │ 🌳 UrbanSim     │ │ ⚖️ HeatEquity    │
│    API Agent    │ │    Shadow Agent │      │    Energy Agent │     │    Physics Sim  │ │    Impact Agent │
├─────────────────┤ ├─────────────────┤      ├─────────────────┤     ├─────────────────┤ ├─────────────────┤
│ • Async polling │ │ • Sun angle path│      │ • Peak tariff   │     │ • Tree canopy ΔT│ │ • Inequity gap  │
│ • Live FG Key   │ │ • WBGT risk     │      │   pre-cooling   │     │ • Albedo cool   │ │ • Labor $/hr    │
│   (2M credits)  │ │ • Cool corridor │      │ • Microclimate  │     │   roof coatings │   loss model      │
│ • GeoJSON tile  │ │ • Safe rest     │      │   HVAC curve    │     │ • Live thermal  │ │ • Action brief  │
│   extractor     │ │   cycles (OSHA) │      │ • Anomaly alerts│     │   dissipation   │   PDF exporter    │
└─────────────────┘ └─────────────────┘      └─────────────────┘     └─────────────────┘ └─────────────────┘
         │                   ▲                        ▲                       ▲                   ▲
         └───────────────────┴────────────────────────┴───────────────────────┴───────────────────┘
                                                      │
                                   ┌──────────────────▼──────────────────┐
                                   │   ⚡ FortyGuard Temperature API®     │
                                   │   (/v1/heatmap · /v1/env_params ·   │
                                   │    /v1/streetview · /v1/satellite · │
                                   │    /v1/heat_intelligence)           │
                                   └─────────────────────────────────────┘
```

---

## 🔌 FortyGuard API Endpoints Integrated

| Endpoint | Method | Role in Thermos AI |
| :--- | :---: | :--- |
| `/v1/heatmap` | `POST` | Generates 2m high-resolution thermal GeoJSON grid layers across Area of Interest (AOI). |
| `/v1/env_params` | `POST` | Fetches Wet-Bulb Globe Temperature (WBGT), Apparent Temp, AQI, and Solar Irradiance. |
| `/v1/streetview` | `POST` | Computes ground-level tree shade, building canyon height, and asphalt fractions. |
| `/v1/satellite` | `POST` | Land-cover segmentation for urban vegetation and surface albedo analysis. |
| `/v1/heat_intelligence`| `POST` | Multi-dimensional climate risk report generation. |
| `/v1/status/{id}` | `GET` | Asynchronous task polling until completion. |
| `/v1/system/fetch-api-key-usage` | `POST` | Real-time billing and 2,000,000 credit balance verification. |

---

## 💻 Tech Stack & Pure-Software Design

- **Frontend**: React 18 + Vite (Dark Glassmorphism, Neon Cyan & Thermal Ember palette).
- **Geospatial & Mapping**: Leaflet with custom vector GeoJSON thermal scales, CoolRoute polyline overlays, and emergency shelter layers.
- **Physics Engine**: Real-time evapotranspiration and solar albedo mathematical modeling.
- **AI Models Supported**: NVIDIA Nemotron 3 Ultra, Google Gemini 3.7 Flash High, Claude Sonnet 4.6.
- **Zero Hardware**: Built-in Virtual Smart City IoT Telemetry Stream.

---

## ⚡ Quickstart Guide

### 1. Clone Repository
```bash
git clone https://github.com/YOUR_USERNAME/Thermos.git
cd Thermos
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Local Development Server
```bash
npm run dev
```
Open **`http://localhost:5173`** in your browser.

### 4. Build for Production
```bash
npm run build
```

---

## 📄 License & Attribution
Built for the FortyGuard Hackathon ’26. Powered by FortyGuard Temperature API® and NVIDIA AI models.
