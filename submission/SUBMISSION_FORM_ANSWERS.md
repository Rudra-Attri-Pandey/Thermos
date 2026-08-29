# 📋 FortyGuard Hackathon ’26: Submission Form Answers

**Official Submission Link:** [https://forms.gle/jLgBzVTG1NhJ3gNe6](https://forms.gle/jLgBzVTG1NhJ3gNe6)  
**Submission Deadline:** 30 August 2026, 11:59 PM GST  

---

### 1. Project Title
```text
Thermos AI — The Autonomous Hyperlocal Climate & Navigation OS
```

---

### 2. One-Line Pitch
```text
An autonomous AI-native climate resilience and navigation platform powered by FortyGuard’s 2-meter Temperature API, featuring multi-agent heat response, cool-route pedestrian navigation, and digital twin urban cooling simulations.
```

---

### 3. Primary Track
```text
Track 06: Agentic AI (with unified integrations across Tracks 01, 02, 03, 04, 05, and 07)
```

---

### 4. Live Demo Link
```text
https://thermos-ai.onrender.com
```

---

### 5. GitHub Repository Link
```text
https://github.com/Rudra-Attri-Pandey/Thermos
```
*(Note: Hackathon-FG / hackathon@fortyguard.com has been officially invited as a collaborator)*

---

### 6. Detailed Description of the Project & Solution
```text
Thermos AI is a 100% software-based, full-stack climate intelligence and navigation operating system built on FortyGuard's Temperature API® and Large Temperature Models (LTMs).

Key Features & Challenge Tracks:
1. Track 06 (Agentic AI Core): A closed-loop Multi-Agent Swarm dividing responsibilities across 6 specialized sub-agents (Master Dispatcher, Sentinel Data Ingestion, Thermal Shadow Pathfinding, GridCool Energy, UrbanSim Physics, and HeatEquity). Includes a live Glass-Box Agent Terminal demonstrating real-time FortyGuard tool-calling and reasoning.
2. Track 01 (Resilient Cities & Infrastructure): Thermal Shadow Navigation Engine that calculates solar angles, building canyon shadows, and FortyGuard 2m vegetation layers to route pedestrians and delivery riders through shaded corridors 4°C–7°C cooler than standard asphalt streets.
3. Track 02 (Future Buildings & Energy): GridCool HVAC pre-cooling scheduler that predicts 12-hour microclimate peaks to chill buildings during off-peak power tariffs, saving up to 28% in peak electricity costs.
4. Track 03 (Industrial & Enterprise): ThermoSafe workforce protection engine that continuously evaluates Wet-Bulb Globe Temperatures (WBGT), automates OSHA-compliant rest breaks, and streams pure-software Virtual IoT crew telemetry.
5. Track 04 & 05 (Government, Digital Twin & ML Modeling): UrbanSim physics simulator allowing city planners to test "What-If" scenarios (Tree Canopy expansion, high-albedo cool roofs, misting stations) with live temperature drop (ΔT) recalculations, avoided hospitalization counts, and carbon offsets.
6. Track 07 (Data Analysis & Correlation): Evaluates neighborhood thermal disparity against median income and canopy cover to calculate Heat Inequity Gaps and worker hourly productivity losses.
```

---

### 7. How did you use the FortyGuard Temperature API and AI Tools?
```text
1. FortyGuard Temperature API Integration:
- We integrated FortyGuard's asynchronous task-based architecture using our active API key (2,000,000 credits).
- POST /v1/heatmap: Ingested high-resolution 2-meter pedestrian thermal GeoJSON meshes over citywide Areas of Interest (AOIs) like San Jose, CA (104 km²) and Manhattan, NY.
- POST /v1/env_params: Extracted Wet-Bulb Temperature (WBGT), Apparent Temperature, AQI, and Solar Irradiance to power worker safety thresholds.
- POST /v1/streetview: Analyzed ground-level 2m vegetation canopy and building canyon heights for shadow routing.
- GET /v1/status/{activity_id}: Handled asynchronous task polling with sub-second fallback handling.
- POST /v1/system/fetch-api-key-usage: Integrated real-time credit tracking directly into our command center header.

2. AI Models & Agentic Architecture:
- Powered by NVIDIA Nemotron 3 Ultra 550B and Google Gemini for multi-agent tool calling, graph planning, and climate policy synthesis.
- Implemented physics-informed mathematical models for evapotranspiration and solar albedo thermal dissipation.
```

---

### 8. Demo Video Link (Max 3 Minutes)
```text
[Paste your YouTube Unlisted or Google Drive Video Link Here]
```
