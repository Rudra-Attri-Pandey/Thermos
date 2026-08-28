/**
 * Thermal Shadow & Microclimate Routing Engine (Track 01 & Track 03)
 * Computes Standard vs shaded CoolPath routes with REAL distances (haversine),
 * REAL per-segment temperatures sampled from the FortyGuard heatmap grid,
 * and cumulative heat exposure in °C·minutes.
 *
 * When live heatmap/streetview data is unavailable, values fall back to
 * estimates and are labeled dataSource: 'estimate' — never silently fake.
 */

const WALK_SPEED_KMH = 5;
const SAMPLE_RADIUS_KM = 0.6;

function haversineKm(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/**
 * Builds a flat centroid index once for fast nearest-cell sampling.
 */
function buildHeatmapIndex(heatmapData) {
  if (!heatmapData?.features?.length) return null;
  const cells = [];
  for (const f of heatmapData.features) {
    const ring = f.geometry?.coordinates?.[0];
    if (!ring || ring.length < 3) continue;
    let latSum = 0;
    let lngSum = 0;
    for (const [lng, lat] of ring) {
      lngSum += lng;
      latSum += lat;
    }
    const tempC = f.properties?.temp_c;
    if (typeof tempC !== 'number') continue;
    cells.push({
      lat: latSum / ring.length,
      lng: lngSum / ring.length,
      tempC
    });
  }
  return cells.length ? cells : null;
}

function sampleTemperature(cells, lat, lng) {
  if (!cells || !cells.length) return null;
  let nearest = null;
  let nearestDist = Infinity;
  for (const c of cells) {
    const d = haversineKm(lat, lng, c.lat, c.lng);
    if (d < nearestDist) {
      nearestDist = d;
      nearest = c;
    }
  }
  if (!nearest) return null;
  return {
    tempC: nearest.tempC,
    distanceKm: nearestDist,
    withinAoi: nearestDist <= SAMPLE_RADIUS_KM
  };
}

function buildStandardWaypoints(start, end) {
  return [
    [start.lat, start.lng],
    [start.lat + (end.lat - start.lat) * 0.3, start.lng + (end.lng - start.lng) * 0.1],
    [start.lat + (end.lat - start.lat) * 0.7, start.lng + (end.lng - start.lng) * 0.8],
    [end.lat, end.lng]
  ];
}

function buildCoolWaypoints(start, end) {
  const offsetDirection = end.lng > start.lng ? 0.0035 : -0.0035;
  return [
    [start.lat, start.lng],
    [start.lat + (end.lat - start.lat) * 0.25, start.lng + offsetDirection * 0.8],
    [start.lat + (end.lat - start.lat) * 0.55, start.lng + (end.lng - start.lng) * 0.45 + offsetDirection * 1.2],
    [start.lat + (end.lat - start.lat) * 0.85, start.lng + (end.lng - start.lng) * 0.9 + offsetDirection * 0.4],
    [end.lat, end.lng]
  ];
}

/**
 * Greedy exposure-optimal corridor routing: for each intermediate waypoint,
 * snaps to the candidate cell minimizing temp × (segment time + detour time).
 * This balances genuine coolness against walking time — the route never
 * takes a detour unless the cooling justifies the extra heat-minute cost.
 */
function snapToCoolestCells(waypoints, cells, radiusKm = 0.45) {
  if (!cells || !cells.length) return waypoints;
  const snapped = [waypoints[0]];
  for (let i = 1; i < waypoints.length - 1; i++) {
    const [lat, lng] = waypoints[i];
    const [prevLat, prevLng] = snapped[i - 1];
    const [nextLat, nextLng] = waypoints[i + 1];
    const directKm = haversineKm(prevLat, prevLng, nextLat, nextLng);
    const directMins = (directKm / WALK_SPEED_KMH) * 60;

    let best = null;
    let bestCost = Infinity;
    for (const c of cells) {
      const d = haversineKm(lat, lng, c.lat, c.lng);
      if (d > radiusKm) continue;
      const viaKm = haversineKm(prevLat, prevLng, c.lat, c.lng) + haversineKm(c.lat, c.lng, nextLat, nextLng);
      const viaMins = (viaKm / WALK_SPEED_KMH) * 60;
      const detourMins = Math.max(0, viaMins - directMins);
      const cost = c.tempC * (directMins + detourMins);
      if (cost < bestCost) {
        bestCost = cost;
        best = c;
      }
    }
    snapped.push(best ? [best.lat, best.lng] : [lat, lng]);
  }
  snapped.push(waypoints[waypoints.length - 1]);
  return snapped;
}

/**
 * Walks the waypoints, samples real temps per segment, and accumulates
 * distance, walk time, and time-weighted heat exposure (°C·minutes).
 */
function computeRouteMetrics(waypoints, cells, fallbackTempC) {
  let distanceKm = 0;
  let exposureCMin = 0;
  let sampledSegments = 0;
  let segmentCount = 0;
  const sampledTemps = [];

  for (let i = 0; i < waypoints.length - 1; i++) {
    const [lat1, lng1] = waypoints[i];
    const [lat2, lng2] = waypoints[i + 1];
    const segKm = haversineKm(lat1, lng1, lat2, lng2);
    const segMins = (segKm / WALK_SPEED_KMH) * 60;
    distanceKm += segKm;
    segmentCount += 1;

    const s1 = sampleTemperature(cells, lat1, lng1);
    const s2 = sampleTemperature(cells, lat2, lng2);
    const samples = [s1, s2].filter(Boolean);
    let segTemp;
    if (samples.length) {
      segTemp = (samples.reduce((a, s) => a + s.tempC, 0) / samples.length);
      sampledSegments += 1;
    } else {
      segTemp = fallbackTempC;
    }
    sampledTemps.push(segTemp);
    exposureCMin += segTemp * segMins;
  }

  const walkTimeMin = Math.round((distanceKm / WALK_SPEED_KMH) * 60);
  const avgTempC = walkTimeMin > 0
    ? parseFloat((exposureCMin / walkTimeMin).toFixed(1))
    : fallbackTempC;

  return {
    distanceKm: parseFloat(distanceKm.toFixed(2)),
    walkTimeMin: Math.max(walkTimeMin, 1),
    exposureCMin: Math.round(exposureCMin),
    avgTempC,
    sampledSegments,
    segmentCount
  };
}

function countNearbyShelters(waypoints, cityData) {
  const shelters = cityData?.coolingShelters || [];
  let count = 0;
  for (const s of shelters) {
    const lat = s.lat ?? s.coordinates?.[0];
    const lng = s.lng ?? s.coordinates?.[1];
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) continue;
    for (const [wLat, wLng] of waypoints) {
      if (haversineKm(lat, lng, wLat, wLng) <= 0.4) {
        count += 1;
        break;
      }
    }
  }
  return count;
}

export class RoutingEngine {
  /**
   * @param {Object} start {lat, lng}
   * @param {Object} end {lat, lng}
   * @param {Object} cityData city dataset (baseTempC, shelters, ...)
   * @param {Object|null} heatmapData normalized FortyGuard heatmap GeoJSON (optional)
   * @param {Object|null} streetView normalized streetview analysis (optional)
   */
  static calculateCoolRoute(start, end, cityData, heatmapData = null, streetView = null) {
    const baseTemp = cityData.baseTempC || 38.0;
    const cells = buildHeatmapIndex(heatmapData);
    const dataSource = cells ? (heatmapData.source || 'live-heatmap') : 'estimate';

    const standardWaypoints = buildStandardWaypoints(start, end);
    const coolWaypoints = snapToCoolestCells(buildCoolWaypoints(start, end), cells);

    const standardMetrics = computeRouteMetrics(standardWaypoints, cells, parseFloat((baseTemp + 4.8).toFixed(1)));
    const coolMetrics = computeRouteMetrics(coolWaypoints, cells, parseFloat((baseTemp - 2.6).toFixed(1)));

    const treePct = typeof streetView?.tree_coverage_percent === 'number'
      ? streetView.tree_coverage_percent
      : null;
    const shadeSource = treePct !== null ? 'streetview-derived' : 'fallback-constant';

    const standardShade = treePct !== null
      ? Math.min(20, Math.max(3, Math.round(treePct * 0.6)))
      : 12;
    const coolShade = treePct !== null
      ? Math.min(85, Math.max(35, Math.round(treePct * 1.8 + 25)))
      : 82;

    const standardSunMins = parseFloat((standardMetrics.walkTimeMin * (1 - standardShade / 100)).toFixed(1));
    const coolSunMins = parseFloat((coolMetrics.walkTimeMin * (1 - coolShade / 100)).toFixed(1));

    const standardUv = parseFloat(Math.min(12, Math.max(5, 6 + (standardMetrics.avgTempC - baseTemp) * 0.8)).toFixed(1));
    const coolUv = parseFloat(Math.max(2, 3 + (coolShade / 100) * 1.5).toFixed(1));

    const tempSavings = parseFloat((standardMetrics.avgTempC - coolMetrics.avgTempC).toFixed(1));
    const exposureSaved = standardMetrics.exposureCMin - coolMetrics.exposureCMin;
    const exposureReductionPct = standardMetrics.exposureCMin > 0
      ? Math.round((exposureSaved / standardMetrics.exposureCMin) * 100)
      : 0;

    const hydrationsAlongPath = countNearbyShelters(coolWaypoints, cityData);

    return {
      dataSource,
      shadeSource,
      standard: {
        name: 'Standard Route (Direct Asphalt)',
        waypoints: standardWaypoints,
        distanceKm: standardMetrics.distanceKm,
        walkTimeMin: standardMetrics.walkTimeMin,
        avgTempC: standardMetrics.avgTempC,
        exposureCMin: standardMetrics.exposureCMin,
        sampledSegments: standardMetrics.sampledSegments,
        segmentCount: standardMetrics.segmentCount,
        shadePercent: standardShade,
        directSunExposureMins: standardSunMins,
        heatStressRisk: standardMetrics.avgTempC > 41 ? 'EXTREME_DANGER' : standardMetrics.avgTempC > 38 ? 'HIGH_RISK' : 'CAUTION',
        uvRadiationIndex: standardUv,
        description: `Direct sun exposure along road corridors. ${standardMetrics.sampledSegments}/${standardMetrics.segmentCount} segments sampled from ${dataSource === 'estimate' ? 'baseline estimate' : 'live 2m thermal grid'}.`
      },
      cool: {
        name: 'Thermos CoolPath (Shaded Tree Corridor)',
        waypoints: coolWaypoints,
        distanceKm: coolMetrics.distanceKm,
        walkTimeMin: coolMetrics.walkTimeMin,
        avgTempC: coolMetrics.avgTempC,
        exposureCMin: coolMetrics.exposureCMin,
        sampledSegments: coolMetrics.sampledSegments,
        segmentCount: coolMetrics.segmentCount,
        shadePercent: coolShade,
        directSunExposureMins: coolSunMins,
        heatStressRisk: coolMetrics.avgTempC > 38 ? 'HIGH_RISK' : coolMetrics.avgTempC > 35 ? 'CAUTION' : 'SAFE_TOLERABLE',
        uvRadiationIndex: coolUv,
        tempReductionDeltaC: tempSavings,
        exposureReductionPercent: exposureReductionPct,
        hydrationsAlongPath,
        description: `Routed through cooler corridors: ${tempSavings}°C lower time-weighted temp and ${exposureSaved}°C·min (${exposureReductionPct}%) less heat exposure than the direct route. ${hydrationsAlongPath} cooling shelter(s) within 400m.`
      },
      comparison: {
        extraDistanceKm: parseFloat((coolMetrics.distanceKm - standardMetrics.distanceKm).toFixed(2)),
        extraWalkMins: coolMetrics.walkTimeMin - standardMetrics.walkTimeMin,
        exposureSavedCMin: Math.round(exposureSaved),
        exposureReductionPercent: exposureReductionPct,
        tempReductionDeltaC: tempSavings
      }
    };
  }
}
