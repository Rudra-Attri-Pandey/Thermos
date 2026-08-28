/**
 * FortyGuard Temperature API Client Service
 * Official integration for FortyGuard Hackathon '26
 * Supports live async polling, credit balance tracking, and realistic microclimate fallback.
 */

// All requests go through the secure backend proxy (/api/fortyguard/*).
// The FortyGuard api-key is injected server-side and never reaches the browser.
function apiBase() {
  if (typeof window === 'undefined') return 'http://localhost:8787';
  return import.meta.env?.VITE_API_BASE || '';
}
const BASE_URL = `${apiBase()}/api/fortyguard`;

class FortyGuardService {
  constructor() {
    this.credits = 2000000;
    this.creditsUsed = 0;
    this.activeMode = 'hybrid'; // 'live', 'hybrid', 'offline'
    this.sourceFlags = { heatmap: null, env: null, streetview: null };
    this.onFallback = null; // set by App to surface demo-mode toasts
  }

  recordSource(kind, source) {
    this.sourceFlags[kind] = source;
    if (source === 'synthetic' && typeof this.onFallback === 'function') {
      try { this.onFallback(kind); } catch (_) {}
    }
  }

  getDataSourceStatus() {
    const flags = Object.values(this.sourceFlags);
    if (flags.includes('synthetic')) return 'demo';
    if (flags.every(f => f === 'live')) return 'live';
    return 'idle';
  }

  getHeaders() {
    return {
      'Content-Type': 'application/json'
    };
  }

  /**
   * Fetch current API Key credit status
   */
  async fetchUsage() {
    try {
      const response = await fetch(`${BASE_URL}/system/fetch-api-key-usage`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({})
      });
      if (response.ok) {
        const data = await response.json();
        if (data.credit_summary) {
          this.credits = data.credit_summary.cycle_remaining_credits;
          this.creditsUsed = data.credit_summary.cycle_credits_used;
        }
        return data;
      }
    } catch (e) {
      console.warn('Live usage fetch fallback:', e);
    }
    return {
      plan_type: 'Hackathon Tier',
      total_credits: 2000000,
      remaining_credits: this.credits,
      status: 'active'
    };
  }

  /**
   * Generates Thermal Heatmap GeoJSON for Area of Interest (AOI)
   */
  async createHeatmap(polygon, date = '2026-08-24', time = '15:00', granularity = 100) {
    const payload = {
      polygon_aoi: {
        type: 'FeatureCollection',
        features: [{
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'Polygon',
            coordinates: [polygon]
          }
        }]
      },
      date_time: {
        start_date: date,
        start_time: time,
        filter_type: 1
      },
      granularity: granularity,
      analytic_type: 'tcm'
    };

    try {
      if (this.activeMode === 'live' || this.activeMode === 'hybrid') {
        const submitResp = await fetch(`${BASE_URL}/heatmap`, {
          method: 'POST',
          headers: this.getHeaders(),
          body: JSON.stringify(payload)
        });

        if (submitResp.ok) {
          const body = await submitResp.json();
          const activityId = body?.data?.activity_id;
          if (activityId) {
            const result = await this.pollTask(activityId);
            const normalized = this.normalizeLiveHeatmap(result);
            if (normalized) {
              this.recordSource('heatmap', 'live');
              return normalized;
            }
          }
        }
      }
    } catch (err) {
      console.warn('Live heatmap error, returning high-resolution synthetic mesh:', err);
    }

    this.recordSource('heatmap', 'synthetic');
    // High-Fidelity Synthetic Grid for instant interactive feedback
    return this.generateSyntheticHeatmap(polygon, granularity);
  }

  /**
   * Environmental parameters (Wet Bulb, Apparent Temp, Heat Index, AQI, Solar)
   */
  async getEnvParams(lat, lng, tempC = 38.5, date = '2026-08-24', time = '15:00') {
    const payload = {
      latitude: lat,
      longitude: lng,
      temperature: tempC,
      date_time: {
        start_date: date,
        start_time: time,
        filter_type: 1
      }
    };

    try {
      if (this.activeMode === 'live' || this.activeMode === 'hybrid') {
        const resp = await fetch(`${BASE_URL}/env_params`, {
          method: 'POST',
          headers: this.getHeaders(),
          body: JSON.stringify(payload)
        });
        if (resp.ok) {
          const body = await resp.json();
          const activityId = body?.data?.activity_id;
          if (activityId) {
            const result = await this.pollTask(activityId);
            const normalized = this.normalizeLiveEnvParams(result);
            if (normalized) {
              this.recordSource('env', 'live');
              return normalized;
            }
          }
        }
      }
    } catch (e) {
      console.warn('Live env_params fallback:', e);
    }

    this.recordSource('env', 'synthetic');
    // Calculate scientifically rigorous synthetic parameters
    return this.computeSyntheticEnvParams(lat, lng, tempC);
  }

  /**
   * StreetView Segmentation (Ground-level 2m vegetation and thermal canyon analysis)
   */
  async getStreetView(lat, lng) {
    const payload = {
      latitude: lat,
      longitude: lng,
      vertical_angle: 0.0,
      horizontal_angle: 0.0,
      back_view: false
    };

    try {
      if (this.activeMode === 'live' || this.activeMode === 'hybrid') {
        const resp = await fetch(`${BASE_URL}/streetview`, {
          method: 'POST',
          headers: this.getHeaders(),
          body: JSON.stringify(payload)
        });
        if (resp.ok) {
          const body = await resp.json();
          const activityId = body?.data?.activity_id;
          if (activityId) {
            const result = await this.pollTask(activityId);
            const normalized = this.normalizeLiveStreetView(result);
            if (normalized) {
              this.recordSource('streetview', 'live');
              return normalized;
            }
          }
        }
      }
    } catch (e) {
      console.warn('Streetview fallback:', e);
    }

    this.recordSource('streetview', 'synthetic');
    return {
      tree_coverage_percent: Math.round(15 + Math.sin(lat * 10) * 12 + 10),
      building_height_meters: Math.round(18 + Math.cos(lng * 10) * 15 + 10),
      asphalt_fraction_percent: 62.4,
      sky_view_factor: 0.42,
      thermal_comfort_score: 'Poor (High Radiation Exposure)',
      source: 'synthetic'
    };
  }

  /**
   * Polls asynchronous activity_id until completed
   */
  async pollTask(activityId, maxAttempts = 15, intervalMs = 2500) {
    for (let i = 0; i < maxAttempts; i++) {
      await new Promise(r => setTimeout(r, intervalMs));
      try {
        const resp = await fetch(`${BASE_URL}/status/${activityId}`, {
          headers: this.getHeaders()
        });
        if (resp.ok) {
          const body = await resp.json();
          const status = (body?.data?.status || '').toLowerCase();
          if (status === 'completed' || status === 'succeeded') {
            return body.data.result || body.data;
          }
          if (status === 'failed' || status === 'error') {
            return null;
          }
        }
      } catch (e) {
        console.warn(`Polling attempt ${i} error:`, e);
      }
    }
    return null;
  }

  /**
   * Normalizes the live /v1/heatmap response into the internal GeoJSON shape
   * expected by MapView, modules, and the agent swarm.
   * Live shape: { map_data: FeatureCollection(props: average_temperature...), stats_data: { temperature_stats } }
   */
  normalizeLiveHeatmap(raw) {
    const fc = raw?.map_data;
    if (!fc?.features?.length) return null;

    const features = [];
    for (let i = 0; i < fc.features.length; i++) {
      const f = fc.features[i];
      const p = f.properties || {};
      const tempC = typeof p.average_temperature === 'number' ? p.average_temperature : null;
      if (tempC === null || !f.geometry) continue;
      features.push({
        type: 'Feature',
        geometry: f.geometry,
        properties: {
          tile_id: p.tile_id ?? i,
          temp_c: parseFloat(tempC.toFixed(1)),
          temp_f: parseFloat((tempC * 9 / 5 + 32).toFixed(1)),
          heat_risk: tempC > 41 ? 'Extreme' : tempC > 38 ? 'Severe' : tempC > 35 ? 'Moderate' : 'Normal',
          albedo: p.albedo ?? null,
          tree_canopy: p.tree_canopy ?? null
        }
      });
    }
    if (!features.length) return null;

    const ts = raw?.stats_data?.temperature_stats;
    const temps = features.map(f => f.properties.temp_c);
    const stats = ts
      ? {
          min_temp_c: parseFloat(ts.minimum.toFixed(1)),
          max_temp_c: parseFloat(ts.maximum.toFixed(1)),
          mean_temp_c: parseFloat(ts.mean.toFixed(1)),
          total_cells: features.length
        }
      : {
          min_temp_c: Math.min(...temps),
          max_temp_c: Math.max(...temps),
          mean_temp_c: parseFloat((temps.reduce((a, b) => a + b, 0) / temps.length).toFixed(1)),
          total_cells: features.length
        };

    return { type: 'FeatureCollection', features, stats, source: 'live' };
  }

  /**
   * Normalizes the live /v1/env_params response into the flat internal shape.
   * Live shape: { metadata: {timestamps[]}, locations: [{ temperature, solar_irradiance: {clear_sky:{ghi}}, parameters: { hourly arrays } }] }
   */
  normalizeLiveEnvParams(raw) {
    const loc = raw?.locations?.[0];
    const params = loc?.parameters;
    if (!params) return null;

    // Pick the peak heat-stress hour (max heat index) across the 24h series
    const hiArr = params.heat_index_celsius;
    let peakIdx = 15;
    if (Array.isArray(hiArr) && hiArr.length) {
      peakIdx = hiArr.indexOf(Math.max(...hiArr));
      if (peakIdx < 0) peakIdx = 15;
    }
    const val = (name) => (Array.isArray(params[name]) ? params[name][peakIdx] : params[name]);

    const wetBulb = val('wet_bulb_temperature_celsius');
    const heatIndexC = val('heat_index_celsius');
    const apparent = val('apparent_temperature_celsius');
    if (wetBulb === undefined && heatIndexC === undefined) return null;

    return {
      temperature_celsius: typeof loc.temperature === 'number' ? parseFloat(loc.temperature.toFixed(1)) : null,
      wet_bulb_temperature_celsius: typeof wetBulb === 'number' ? parseFloat(wetBulb.toFixed(1)) : null,
      apparent_temperature_celsius: typeof apparent === 'number' ? parseFloat(apparent.toFixed(1)) : null,
      heat_index_celsius: typeof heatIndexC === 'number' ? parseFloat(heatIndexC.toFixed(1)) : null,
      relative_humidity_percent: val('relative_humidity_percent') ?? null,
      solar_irradiance: loc.solar_irradiance?.clear_sky?.ghi ?? null,
      air_quality_idx: val('air_quality:idx') ?? null,
      air_quality_pm2p5: val('air_quality_pm2p5:idx') ?? null,
      cloud_cover_octas: val('cloud_cover_octas') ?? null,
      elevation: loc.elevation ?? null,
      peak_hour_index: peakIdx,
      risk_level: wetBulb > 31 ? 'CRITICAL_HEAT_STROKE' : wetBulb > 28 ? 'HIGH_RISK_OSHA_REST_REQ' : 'MODERATE_MONITOR',
      source: 'live'
    };
  }

  /**
   * Normalizes the live /v1/streetview response into the internal shape.
   * Live shape: { coordinates, front: { segments: {building, sky, tree, road, sidewalk, others}, image_date } }
   */
  normalizeLiveStreetView(raw) {
    const seg = raw?.front?.segments;
    if (!seg) return null;
    const treePct = seg.tree ?? 0;
    const asphalt = (seg.road ?? 0) + (seg.sidewalk ?? 0);
    return {
      tree_coverage_percent: parseFloat(treePct.toFixed(1)),
      building_segment_percent: parseFloat((seg.building ?? 0).toFixed(1)),
      asphalt_fraction_percent: parseFloat(asphalt.toFixed(1)),
      sky_view_factor: parseFloat(((seg.sky ?? 0) / 100).toFixed(2)),
      thermal_comfort_score: treePct > 25 ? 'Good (Shaded)' : treePct > 12 ? 'Fair (Partial Cover)' : 'Poor (High Radiation Exposure)',
      segments: seg,
      image_date: raw.front.image_date ?? null,
      source: 'live'
    };
  }

  /**
   * Generates Dense 2m Hyperlocal Thermal GeoJSON Grid
   */
  generateSyntheticHeatmap(polygon, granularity = 100) {
    const lons = polygon.map(p => p[0]);
    const lats = polygon.map(p => p[1]);
    const minLon = Math.min(...lons);
    const maxLon = Math.max(...lons);
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);

    const steps = 14;
    const lonStep = (maxLon - minLon) / steps;
    const latStep = (maxLat - minLat) / steps;

    const features = [];
    let minT = 100, maxT = 0, sumT = 0;

    for (let i = 0; i < steps; i++) {
      for (let j = 0; j < steps; j++) {
        const cellMinLon = minLon + i * lonStep;
        const cellMaxLon = cellMinLon + lonStep;
        const cellMinLat = minLat + j * latStep;
        const cellMaxLat = cellMinLat + latStep;

        const centerLon = (cellMinLon + cellMaxLon) / 2;
        const centerLat = (cellMinLat + cellMaxLat) / 2;

        // Realistic spatial temperature gradient with urban hot core
        const distFromCenter = Math.sqrt(
          Math.pow((centerLon - (minLon + maxLon) / 2) / (maxLon - minLon), 2) +
          Math.pow((centerLat - (minLat + maxLat) / 2) / (maxLat - minLat), 2)
        );

        // Microclimate heat variations (34C to 45C)
        const tempC = parseFloat((43.5 - distFromCenter * 7.5 + Math.sin(i * 3) * 1.8 + Math.cos(j * 2) * 1.5).toFixed(1));
        const tempF = parseFloat((tempC * 9/5 + 32).toFixed(1));

        if (tempC < minT) minT = tempC;
        if (tempC > maxT) maxT = tempC;
        sumT += tempC;

        features.push({
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [[
              [cellMinLon, cellMinLat],
              [cellMaxLon, cellMinLat],
              [cellMaxLon, cellMaxLat],
              [cellMinLon, cellMaxLat],
              [cellMinLon, cellMinLat]
            ]]
          },
          properties: {
            temp_c: tempC,
            temp_f: tempF,
            heat_risk: tempC > 41 ? 'Extreme' : tempC > 38 ? 'Severe' : tempC > 35 ? 'Moderate' : 'Normal',
            albedo: parseFloat((0.12 + distFromCenter * 0.15).toFixed(2)),
            tree_canopy: Math.round(5 + distFromCenter * 35),
            uv_index: 9.4
          }
        });
      }
    }

    return {
      type: 'FeatureCollection',
      features,
      stats: {
        min_temp_c: minT,
        max_temp_c: maxT,
        mean_temp_c: parseFloat((sumT / features.length).toFixed(1)),
        total_cells: features.length,
        resolution: `${granularity}m x ${granularity}m`
      },
      source: 'synthetic'
    };
  }

  computeSyntheticEnvParams(lat, lng, tempC) {
    const humidity = 36;
    // Approximated Wet-Bulb Temperature (Stull's formula approximation)
    const wetBulb = parseFloat((tempC * Math.atan(0.151977 * Math.pow(humidity + 8.313659, 0.5)) + 
      Math.atan(tempC + humidity) - Math.atan(humidity - 1.676331) + 
      0.00391838 * Math.pow(humidity, 1.5) * Math.atan(0.023101 * humidity) - 4.686035).toFixed(1));

    const heatIndexC = parseFloat((tempC + 0.33 * (humidity / 100 * 6.105 * Math.exp(17.27 * tempC / (237.7 + tempC))) - 4.0).toFixed(1));

    return {
      temperature_celsius: tempC,
      wet_bulb_temperature_celsius: wetBulb,
      apparent_temperature_celsius: heatIndexC,
      heat_index_celsius: heatIndexC,
      relative_humidity_percent: humidity,
      solar_irradiance: 940, // W/m^2
      air_quality_idx: 68, // Moderate
      air_quality_pm2p5: 22.4,
      cloud_cover_octas: 1,
      elevation: 48,
      risk_level: wetBulb > 31 ? 'CRITICAL_HEAT_STROKE' : wetBulb > 28 ? 'HIGH_RISK_OSHA_REST_REQ' : 'MODERATE_MONITOR'
    };
  }
}

export const fortyGuardApi = new FortyGuardService();
