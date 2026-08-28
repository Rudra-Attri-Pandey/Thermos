/**
 * Fast routing-only test — fetches live heatmap via proxy, computes routes, prints metrics.
 * Usage: node scripts/routing-test.mjs
 */
import { fortyGuardApi } from '../src/services/fortyGuardApi.js';
import { RoutingEngine } from '../src/services/routingEngine.js';
import { CITIES } from '../src/services/cityDatasets.js';

const cityKey = process.argv[2] || 'sanjose';
const city = CITIES[cityKey] || CITIES.sanjose;
console.log(`Fetching live heatmap for ${city.name}...`);
const hm = await fortyGuardApi.createHeatmap(city.polygon);
const st = await fortyGuardApi.getStreetView(city.lat, city.lng);
console.log(`heatmap: ${hm.features?.length} cells, source=${hm.source}, stats=`, hm.stats);
console.log(`streetview: tree=${st.tree_coverage_percent}% source=${st.source}`);

const start = { lat: city.lat - 0.005, lng: city.lng - 0.006 };
const end = { lat: city.lat + 0.006, lng: city.lng + 0.007 };
const route = RoutingEngine.calculateCoolRoute(start, end, city, hm, st);

console.log('\n--- STANDARD ---');
console.log(`${route.standard.distanceKm} km, ${route.standard.walkTimeMin} min, avg ${route.standard.avgTempC}C, exposure ${route.standard.exposureCMin} C-min, sampled ${route.standard.sampledSegments}/${route.standard.segmentCount}`);
console.log('\n--- COOLPATH ---');
console.log(`${route.cool.distanceKm} km, ${route.cool.walkTimeMin} min, avg ${route.cool.avgTempC}C, exposure ${route.cool.exposureCMin} C-min, sampled ${route.cool.sampledSegments}/${route.cool.segmentCount}`);
console.log('\n--- COMPARISON ---');
console.log(JSON.stringify(route.comparison, null, 2));
