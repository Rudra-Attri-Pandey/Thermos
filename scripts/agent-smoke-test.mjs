/**
 * Agentic swarm smoke test — runs the REAL Nemotron tool-calling loop
 * against the local proxy server. Requires: npm run dev:server (port 8787).
 *
 * Usage: node scripts/agent-smoke-test.mjs
 */
import { MultiAgentSwarm } from '../src/services/multiAgentSwarm.js';
import { CITIES } from '../src/services/cityDatasets.js';

const city = CITIES.sanjose;
const swarm = new MultiAgentSwarm((log) => {
  console.log(`[${log.timestamp}] ${log.agent} | ${log.tool} | ${log.durationMs ?? '-'}ms`);
  console.log(`   ${log.action}: ${String(log.details).slice(0, 220)}`);
});

console.log(`\n=== Thermos Agentic Smoke Test — ${city.name} ===\n`);

const result = await swarm.executeAutonomousWorkflow(
  'Assess current heat risk in the city, compute a cooler shaded route for a delivery rider, and simulate +30% tree canopy with 50% cool roofs. Finish with an executive brief.',
  city,
  { treeCanopyDelta: 30, coolRoofCoverage: 50 }
);

console.log('\n=== RESULT ===');
console.log('mode:', result.mode);
console.log('execution time:', result.totalExecutionTimeMs, 'ms');
console.log('heatmap:', result.heatmap ? `yes (${result.heatmap.features?.length} cells)` : 'no');
console.log('envParams:', result.envParams ? `yes (WBGT ${result.envParams.wet_bulb_temperature_celsius}C)` : 'no');
console.log('streetView:', result.streetView ? 'yes' : 'no');
console.log('routing:', result.routing ? `yes (saves ${result.routing.cool?.tempReductionDeltaC}C)` : 'no');
console.log('simulation:', result.simulation ? `yes (dT -${result.simulation.totalTemperatureDropC}C)` : 'no');
console.log('credits:', result.credits ?? 'n/a');
console.log('\nEXECUTIVE BRIEF:\n', result.nemotronInsight || '(none — check logs)');
