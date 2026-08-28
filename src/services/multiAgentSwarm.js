/**
 * Multi-Agent Swarm Orchestrator (Track 06: Agentic AI Core)
 * Powered by NVIDIA Nemotron 3 Ultra (`nvidia/nemotron-3-ultra-550b-a55b`)
 *
 * REAL agentic loop: the LLM decides which tools to call, with what arguments,
 * interprets live FortyGuard results, and iterates until it produces an
 * executive synthesis. Every log line in the glass-box terminal reflects an
 * actual LLM reasoning step or an actual tool invocation.
 *
 * Calls are proxied through the backend (/api/nemotron) — keys never reach the browser.
 */

import { fortyGuardApi } from './fortyGuardApi.js';
import { RoutingEngine } from './routingEngine.js';
import { PhysicsSimulator } from './physicsSimulator.js';

const NEMOTRON_MODEL = 'nvidia/nemotron-3-ultra-550b-a55b';
// OmniRoute: set VITE_OMNIROUTE_MODEL=auto for free-tier auto-fallback, or any OmniRoute model id
const OMNIROUTE_MODEL = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_OMNIROUTE_MODEL) || NEMOTRON_MODEL;

function apiBase() {
  if (typeof window === 'undefined') return 'http://localhost:8787';
  return import.meta.env?.VITE_API_BASE || '';
}
const NEMOTRON_PROXY_URL = `${apiBase()}/api/nemotron`;
const OMNIROUTE_CHAT_URL = `${apiBase()}/api/ai/chat`;
const MAX_AGENT_STEPS = 8;

/**
 * OpenAI-style tool schema. The Master Dispatcher (Nemotron) chooses these autonomously.
 */
const AGENT_TOOLS = [
  {
    type: 'function',
    function: {
      name: 'fetch_thermal_heatmap',
      description: 'Sentinel Agent: Query the FortyGuard 2m thermal heatmap over the city AOI. Returns min/max/mean ground temperatures and the hottest cells. Call this first for any heat analysis.',
      parameters: { type: 'object', properties: {}, required: [] }
    }
  },
  {
    type: 'function',
    function: {
      name: 'fetch_env_params',
      description: 'Sentinel Agent: Fetch live environmental parameters (wet-bulb temperature, humidity, heat index, AQI, solar irradiance, OSHA risk level) for a coordinate.',
      parameters: {
        type: 'object',
        properties: {
          lat: { type: 'number', description: 'Latitude (defaults to city center)' },
          lng: { type: 'number', description: 'Longitude (defaults to city center)' }
        },
        required: []
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'fetch_streetview_analysis',
      description: 'Sentinel Agent: Ground-level street-view segmentation — tree canopy %, building canyon height, asphalt fraction, sky view factor.',
      parameters: {
        type: 'object',
        properties: {
          lat: { type: 'number', description: 'Latitude (defaults to city center)' },
          lng: { type: 'number', description: 'Longitude (defaults to city center)' }
        },
        required: []
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'compute_cool_route',
      description: 'Thermal Shadow Agent: Compute Standard vs shaded CoolPath pedestrian routes with REAL per-segment temperatures (sampled from the live 2m heatmap when available), cumulative heat exposure in °C·minutes, distance and shade. Call fetch_thermal_heatmap first so route temps come from live data.',
      parameters: {
        type: 'object',
        properties: {
          startLat: { type: 'number', description: 'Route start latitude (defaults to city demo route)' },
          startLng: { type: 'number', description: 'Route start longitude' },
          endLat: { type: 'number', description: 'Route end latitude' },
          endLng: { type: 'number', description: 'Route end longitude' }
        },
        required: []
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'run_urban_simulation',
      description: 'UrbanSim + GridCool Agent: Simulate urban cooling interventions (tree canopy %, cool-roof coverage %, misting hubs) and return delta-T, HVAC energy savings, avoided hospitalizations, CO2 offset.',
      parameters: {
        type: 'object',
        properties: {
          treeCanopyDelta: { type: 'number', description: 'Tree canopy increase in percentage points (0-50)' },
          coolRoofCoverage: { type: 'number', description: 'Cool roof coverage percent (0-100)' },
          mistingHubs: { type: 'number', description: 'Number of misting hubs (0-20)' }
        },
        required: ['treeCanopyDelta', 'coolRoofCoverage']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'fetch_api_usage',
      description: 'Impact Agent: Fetch live FortyGuard API credit usage and billing status.',
      parameters: { type: 'object', properties: {}, required: [] }
    }
  }
];

const TOOL_AGENT_MAP = {
  fetch_thermal_heatmap: '🌐 Sentinel Data Agent',
  fetch_env_params: '🌐 Sentinel Data Agent',
  fetch_streetview_analysis: '🌐 Sentinel Data Agent',
  compute_cool_route: '🚶 Thermal Shadow Agent',
  run_urban_simulation: '🌳 UrbanSim Physics Agent',
  fetch_api_usage: '⚖️ HeatEquity & Impact Agent'
};

function buildSystemPrompt(cityData) {
  return `You are Thermos AI — an autonomous climate intelligence orchestrator for the city of ${cityData.name} (center: ${cityData.lat}, ${cityData.lng}, baseline ambient ground temp: ${cityData.baseTempC}°C). You command a swarm of specialist agents backed by the FortyGuard Temperature API (2m Large Temperature Model) and local physics/routing engines.

Available specialist agents (exposed as tools):
- Sentinel Data Agent: fetch_thermal_heatmap, fetch_env_params, fetch_streetview_analysis
- Thermal Shadow Agent: compute_cool_route
- UrbanSim/GridCool Agent: run_urban_simulation
- HeatEquity & Impact Agent: fetch_api_usage

Operating rules:
1. Decide autonomously which tools to call to fulfill the user's request. Call multiple tools when the analysis needs them.
2. Use REAL returned values in your reasoning — never invent numbers.
3. When you have enough data, stop calling tools and write the final executive brief: 2-3 crisp sentences with concrete numbers, an actionable recommendation, and the affected population. Prefix it with "EXECUTIVE BRIEF:".
4. Keep tool arguments minimal; omit optional args to use city defaults.`;
}

export class MultiAgentSwarm {
  constructor(onLogCallback = () => {}) {
    this.onLog = onLogCallback;
    this.activeModel = 'NVIDIA Nemotron 3 Ultra (550B)';
    this.collected = {};
  }

  setModel(modelName) {
    this.activeModel = modelName || this.activeModel;
  }

  log(agent, action, tool, details, durationMs = null) {
    this.onLog({
      timestamp: new Date().toLocaleTimeString(),
      agent,
      action,
      tool,
      details,
      durationMs,
      model: this.activeModel
    });
  }

  /**
   * Low-level Nemotron call — OmniRoute-aware.
   * Tries /api/nemotron (which itself tries OmniRoute -> NIM fallback), then /api/ai/chat directly.
   * Payload is OpenAI-compatible; OmniRoute handles translation to Claude/Gemini/etc.
   */
  async callNemotron(messages, tools = null, maxTokens = 800, retries = 2) {
    const body = {
      model: OMNIROUTE_MODEL,
      messages,
      temperature: 0.4,
      max_tokens: maxTokens
    };
    if (tools) {
      body.tools = tools;
      body.tool_choice = 'auto';
    }

    // Try primary proxy (/api/nemotron handles OmniRoute->NIM fallback server-side)
    // then direct OmniRoute chat. Retries on 429/5xx with backoff.
    const endpoints = [NEMOTRON_PROXY_URL, OMNIROUTE_CHAT_URL];
    let lastErr = null;
    for (let attempt = 0; attempt <= retries; attempt++) {
      for (const url of endpoints) {
        try {
          const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
          });
          if (!response.ok) {
            const errText = await response.text().catch(() => '');
            const err = new Error(`Nemotron proxy ${response.status}: ${errText.slice(0, 200)}`);
            err.status = response.status;
            // 4xx config errors: try next endpoint immediately (don't retry same)
            if (response.status >= 400 && response.status < 500 && response.status !== 429) {
              lastErr = err;
              continue; // try next endpoint
            }
            // 429/5xx: remember and continue to next endpoint; outer retry will backoff
            lastErr = err;
            continue;
          }
          const data = await response.json();
          return data.choices?.[0]?.message || null;
        } catch (e) {
          // network error: try next endpoint
          lastErr = e;
          continue;
        }
      }
      // Exhausted endpoints for this attempt — backoff before retry
      if (attempt < retries) {
        await new Promise(r => setTimeout(r, attempt === 0 ? 2000 : 5000));
      }
    }
    // If last error was terminal 4xx, surface it; otherwise generic
    if (lastErr && lastErr.status) throw lastErr;
    throw lastErr || new Error('Nemotron call failed');
  }

  /**
   * Executes a real tool invocation and returns a compact summary for the LLM.
   * Full payloads are stored in this.collected for UI state updates.
   */
  async executeTool(name, args, cityData) {
    const t0 = performance.now();
    let result;

    switch (name) {
      case 'fetch_thermal_heatmap': {
        const hm = this.collected.heatmap || await fortyGuardApi.createHeatmap(cityData.polygon);
        this.collected.heatmap = hm;
        const topCells = [...(hm.features || [])]
          .sort((a, b) => b.properties.temp_c - a.properties.temp_c)
          .slice(0, 3)
          .map(f => `${f.properties.temp_c}°C @(${f.geometry.coordinates[0][0][0].toFixed(4)}, ${f.geometry.coordinates[0][0][1].toFixed(4)})`);
        result = {
          source: hm.source || 'live',
          stats: hm.stats,
          hottest_cells: topCells
        };
        break;
      }
      case 'fetch_env_params': {
        const lat = Number.isFinite(args.lat) ? args.lat : cityData.lat;
        const lng = Number.isFinite(args.lng) ? args.lng : cityData.lng;
        const env = await fortyGuardApi.getEnvParams(lat, lng, cityData.baseTempC);
        this.collected.envParams = env;
        result = {
          wet_bulb_c: env.wet_bulb_temperature_celsius,
          apparent_temp_c: env.apparent_temperature_celsius,
          humidity_pct: env.relative_humidity_percent,
          solar_w_m2: env.solar_irradiance,
          aqi: env.air_quality_idx,
          osha_risk: env.risk_level
        };
        break;
      }
      case 'fetch_streetview_analysis': {
        const lat = Number.isFinite(args.lat) ? args.lat : cityData.lat;
        const lng = Number.isFinite(args.lng) ? args.lng : cityData.lng;
        const sv = await fortyGuardApi.getStreetView(lat, lng);
        this.collected.streetView = sv;
        result = sv;
        break;
      }
      case 'compute_cool_route': {
        const start = {
          lat: Number.isFinite(args.startLat) ? args.startLat : cityData.lat - 0.005,
          lng: Number.isFinite(args.startLng) ? args.startLng : cityData.lng - 0.006
        };
        const end = {
          lat: Number.isFinite(args.endLat) ? args.endLat : cityData.lat + 0.006,
          lng: Number.isFinite(args.endLng) ? args.endLng : cityData.lng + 0.007
        };
        const route = RoutingEngine.calculateCoolRoute(
          start,
          end,
          cityData,
          this.collected.heatmap || null,
          this.collected.streetView || null
        );
        this.collected.routing = route;
        result = {
          data_source: route.dataSource,
          standard: {
            distance_km: route.standard.distanceKm,
            walk_mins: route.standard.walkTimeMin,
            avg_temp_c: route.standard.avgTempC,
            exposure_c_min: route.standard.exposureCMin,
            shade_pct: route.standard.shadePercent,
            heat_risk: route.standard.heatStressRisk
          },
          coolpath: {
            distance_km: route.cool.distanceKm,
            walk_mins: route.cool.walkTimeMin,
            avg_temp_c: route.cool.avgTempC,
            exposure_c_min: route.cool.exposureCMin,
            shade_pct: route.cool.shadePercent,
            heat_risk: route.cool.heatStressRisk,
            delta_t_saved_c: route.cool.tempReductionDeltaC,
            hydration_hubs_nearby: route.cool.hydrationsAlongPath
          },
          comparison: route.comparison
        };
        break;
      }
      case 'run_urban_simulation': {
        const treeDelta = Number.isFinite(args.treeCanopyDelta) ? args.treeCanopyDelta : 25;
        const coolRoof = Number.isFinite(args.coolRoofCoverage) ? args.coolRoofCoverage : 45;
        const misting = Number.isFinite(args.mistingHubs) ? args.mistingHubs : 5;
        const sim = PhysicsSimulator.simulateIntervention(cityData, treeDelta, coolRoof, misting);
        this.collected.simulation = sim;
        result = {
          interventions: { tree_canopy_plus_pct: treeDelta, cool_roof_pct: coolRoof, misting_hubs: misting },
          total_delta_t_c: sim.totalTemperatureDropC,
          mitigated_temp_c: sim.mitigatedTemperatureC,
          annual_power_savings_usd: sim.economicAndHealthROI.annualPowerSavingsUSD,
          avoided_hospitalizations: sim.economicAndHealthROI.avoidedHospitalizations,
          co2_offset_tons_yr: sim.economicAndHealthROI.co2OffsetTons
        };
        break;
      }
      case 'fetch_api_usage': {
        const usage = await fortyGuardApi.fetchUsage();
        this.collected.usage = usage;
        result = {
          plan: usage.plan_type || usage.plan_details?.plan_type || 'Hackathon Tier',
          remaining_credits: usage.credit_summary?.cycle_remaining_credits ?? usage.remaining_credits ?? this.collected.credits ?? 2000000
        };
        if (usage.credit_summary) {
          this.collected.credits = usage.credit_summary.cycle_remaining_credits;
        }
        break;
      }
      default:
        result = { error: `Unknown tool: ${name}` };
    }

    return { result, durationMs: Math.round(performance.now() - t0) };
  }

  formatToolResult(toolName, result) {
    try {
      const json = JSON.stringify(result);
      return json.length > 3500 ? json.slice(0, 3500) + '…(truncated)' : json;
    } catch (_) {
      return 'Tool result unserializable';
    }
  }

  /**
   * REAL autonomous workflow: Nemotron decides the tool sequence.
   */
  async executeAutonomousWorkflow(userIntent, cityData, customParams = {}) {
    const startTime = performance.now();
    this.collected = {};

    this.log(
      '🤖 Master Dispatcher Agent',
      'Task received — autonomous planning started',
      'NEMOTRON_550B_PLAN',
      `Intent: "${userIntent}". Dispatching to specialist agents via live tool-calling.`
    );

    const messages = [
      { role: 'system', content: buildSystemPrompt(cityData) },
      { role: 'user', content: userIntent }
    ];

    try {
      for (let step = 0; step < MAX_AGENT_STEPS; step++) {
        const msg = await this.callNemotron(messages, AGENT_TOOLS);
        if (!msg) throw new Error('Empty Nemotron response');

        // Real chain-of-thought (Nemotron returns reasoning_content)
        if (msg.reasoning_content) {
          const thought = msg.reasoning_content.trim().replace(/\s+/g, ' ');
          this.log(
            '🧠 Nemotron 3 Ultra — Reasoning',
            'Chain-of-thought (live)',
            'REASONING_TRACE',
            thought.length > 420 ? thought.slice(0, 420) + '…' : thought
          );
        }

        if (msg.tool_calls && msg.tool_calls.length > 0) {
          messages.push({
            role: 'assistant',
            content: msg.content || null,
            tool_calls: msg.tool_calls
          });

          for (const tc of msg.tool_calls) {
            const toolName = tc.function?.name;
            let toolArgs = {};
            try { toolArgs = JSON.parse(tc.function?.arguments || '{}'); } catch (_) {}

            const agentName = TOOL_AGENT_MAP[toolName] || '🔧 Specialist Agent';
            const argsPreview = Object.keys(toolArgs).length
              ? ` args: ${JSON.stringify(toolArgs)}`
              : '';
            this.log(
              agentName,
              'Tool invocation dispatched',
              `TOOL_CALL → ${toolName}`,
              `Executing ${toolName}${argsPreview}`
            );

            const { result, durationMs } = await this.executeTool(toolName, toolArgs, cityData);

            this.log(
              agentName,
              'Live data returned',
              `${toolName}_RESULT`,
              JSON.stringify(result).slice(0, 380),
              durationMs
            );

            messages.push({
              role: 'tool',
              tool_call_id: tc.id,
              content: this.formatToolResult(toolName, result)
            });
          }
          continue;
        }

        // No tool calls → final synthesis
        const finalText = (msg.content || '').trim();
        const totalTime = Math.round(performance.now() - startTime);
        this.log(
          '🤖 Master Dispatcher Agent',
          'Executive synthesis complete',
          'GENERATE_EXECUTIVE_BRIEF',
          finalText || `Audit complete in ${totalTime}ms.`,
          totalTime
        );

        return {
          heatmap: this.collected.heatmap || null,
          envParams: this.collected.envParams || null,
          streetView: this.collected.streetView || null,
          routing: this.collected.routing || null,
          simulation: this.collected.simulation || null,
          usage: this.collected.usage || null,
          credits: this.collected.credits || null,
          nemotronInsight: finalText || null,
          totalExecutionTimeMs: totalTime,
          mode: 'live-agentic'
        };
      }

      // Hit step ceiling — synthesize with what we have
      const totalTime = Math.round(performance.now() - startTime);
      this.log(
        '🤖 Master Dispatcher Agent',
        'Step budget reached — synthesizing partial results',
        'FORCE_SYNTHESIS',
        `Collected ${Object.keys(this.collected).length} datasets in ${totalTime}ms.`
      );
      return {
        heatmap: this.collected.heatmap || null,
        envParams: this.collected.envParams || null,
        streetView: this.collected.streetView || null,
        routing: this.collected.routing || null,
        simulation: this.collected.simulation || null,
        usage: this.collected.usage || null,
        credits: this.collected.credits || null,
        nemotronInsight: null,
        totalExecutionTimeMs: totalTime,
        mode: 'live-agentic-partial'
      };
    } catch (err) {
      console.warn('Agentic loop failed, falling back to deterministic pipeline:', err);
      this.log(
        '⚠️ Resilience Controller',
        'LLM orchestration unavailable — deterministic fallback engaged',
        'FALLBACK_PIPELINE',
        `Nemotron unreachable (${String(err.message).slice(0, 120)}). Running fixed agent pipeline with live FortyGuard calls.`
      );
      return this.runDeterministicFallback(userIntent, cityData, customParams, startTime);
    }
  }

  /**
   * Honest fallback: fixed agent order, REAL API calls, clearly labeled.
   */
  async runDeterministicFallback(userIntent, cityData, customParams, startTime) {
    this.collected = {};

    const [heatmap, env, streetView] = await Promise.all([
      fortyGuardApi.createHeatmap(cityData.polygon),
      fortyGuardApi.getEnvParams(cityData.lat, cityData.lng, cityData.baseTempC),
      fortyGuardApi.getStreetView(cityData.lat, cityData.lng)
    ]);
    this.collected.heatmap = heatmap;
    this.collected.envParams = env;
    this.collected.streetView = streetView;

    this.log(
      '🌐 Sentinel Data Agent',
      'FortyGuard ingestion (fallback mode)',
      'POST /v1/heatmap + /v1/env_params + /v1/streetview',
      `WBGT ${env.wet_bulb_temperature_celsius}°C | mean ground ${heatmap.stats?.mean_temp_c}°C | canopy ${streetView.tree_coverage_percent}%`
    );

    const startPoint = { lat: cityData.lat - 0.005, lng: cityData.lng - 0.006 };
    const endPoint = { lat: cityData.lat + 0.006, lng: cityData.lng + 0.007 };
    const routing = RoutingEngine.calculateCoolRoute(startPoint, endPoint, cityData, heatmap, streetView);
    this.collected.routing = routing;

    const treeDelta = customParams.treeCanopyDelta || 25;
    const coolRoof = customParams.coolRoofCoverage || 45;
    const sim = PhysicsSimulator.simulateIntervention(cityData, treeDelta, coolRoof);
    this.collected.simulation = sim;

    this.log(
      '🌳 UrbanSim Physics Agent',
      'Deterministic simulation (fallback mode)',
      'SIMULATE_ALBEDO_EVAPOTRANSPIRATION',
      `+${treeDelta}% canopy & ${coolRoof}% cool roofs → ΔT -${sim.totalTemperatureDropC}°C`
    );

    const totalTime = Math.round(performance.now() - startTime);
    this.log(
      '⚖️ HeatEquity & Impact Agent',
      'Fallback synthesis complete (no LLM available)',
      'DETERMINISTIC_BRIEF',
      `${cityData.name}: ground up to ${heatmap.stats?.max_temp_c}°C, CoolPath saves ${routing.cool.tempReductionDeltaC}°C exposure. Reconnect Nemotron for full agentic reasoning.`
    );

    return {
      heatmap,
      envParams: env,
      streetView,
      routing,
      simulation: sim,
      usage: null,
      credits: null,
      nemotronInsight: null,
      totalExecutionTimeMs: totalTime,
      mode: 'deterministic-fallback'
    };
  }

  /**
   * Lightweight direct Q&A (used for simple chat when no tools are needed).
   */
  async callNemotronReasoning(systemPrompt, userQuery) {
    try {
      const msg = await this.callNemotron(
        [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userQuery }
        ],
        null,
        400
      );
      return msg?.content || null;
    } catch (e) {
      console.warn('Nemotron API live call fallback:', e);
      return null;
    }
  }
}
