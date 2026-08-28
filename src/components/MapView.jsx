import React, { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';

export default function MapView({ 
  selectedCity, 
  heatmapData, 
  routingData, 
  simulationData 
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const layersGroupRef = useRef({
    heatmap: null,
    routes: null,
    shelters: null,
    hotspots: null
  });

  const [showHeatmap, setShowHeatmap] = useState(true);
  const [showRoutes, setShowRoutes] = useState(true);
  const [showShelters, setShowShelters] = useState(true);
  const [showHotspots, setShowHotspots] = useState(true);
  const [mapReady, setMapReady] = useState(false);

  // Helper: Temperature to Color gradient (28C cool blue -> 48C extreme crimson)
  const getThermalColor = useCallback((tempC) => {
    if (tempC >= 44) return '#dc2626'; // Deep Red
    if (tempC >= 41) return '#ef4444'; // Red
    if (tempC >= 38) return '#f97316'; // Orange
    if (tempC >= 35) return '#f59e0b'; // Amber
    if (tempC >= 32) return '#10b981'; // Green (Canopy Cool)
    return '#38bdf8'; // Blue (Water/Deep Shade)
  }, []);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [selectedCity.lat, selectedCity.lng],
        zoom: selectedCity.zoom || 13,
        zoomControl: false,
        attributionControl: false,
        fadeAnimation: true,
        zoomAnimation: true,
        markerZoomAnimation: true
      });

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      // Dark Matter Map Tiles
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        subdomains: 'abcd'
      }).addTo(map);

      // Setup layer groups
      layersGroupRef.current.heatmap = L.layerGroup().addTo(map);
      layersGroupRef.current.routes = L.layerGroup().addTo(map);
      layersGroupRef.current.shelters = L.layerGroup().addTo(map);
      layersGroupRef.current.hotspots = L.layerGroup().addTo(map);

      mapInstanceRef.current = map;
      setMapReady(true);
    }

    // Cleanup on unmount
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Center when City Changes
  useEffect(() => {
    if (mapInstanceRef.current && selectedCity) {
      mapInstanceRef.current.flyTo([selectedCity.lat, selectedCity.lng], selectedCity.zoom || 13, {
        duration: 1.2,
        easeLinearity: 0.25
      });
    }
  }, [selectedCity]);

  // Render Thermal Heatmap Grid
  useEffect(() => {
    if (!mapInstanceRef.current || !layersGroupRef.current.heatmap || !mapReady) return;
    const group = layersGroupRef.current.heatmap;
    group.clearLayers();

    if (!showHeatmap || !heatmapData?.features) return;

    heatmapData.features.forEach((feature) => {
      const coords = feature.geometry.coordinates[0];
      const latLngs = coords.map(c => [c[1], c[0]]);
      const tempC = feature.properties.temp_c;
      const color = getThermalColor(tempC);

      const polygon = L.polygon(latLngs, {
        color: color,
        weight: 0.5,
        opacity: 0.5,
        fillColor: color,
        fillOpacity: 0.4,
        className: 'thermal-cell'
      });

      polygon.bindPopup(`
        <div style="font-family: var(--font-sans); font-size: 12px; min-width: 180px;">
          <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 8px; padding-bottom: 6px; border-bottom: 1px solid rgba(255,255,255,0.1);">
            <span style="width: 10px; height: 10px; border-radius: 2px; background: ${color};"></span>
            <strong style="color: #00f2fe; font-size: 13px;">2m Thermal Cell</strong>
          </div>
          <div style="display: grid; gap: 4px;">
            <div style="display: flex; justify-content: space-between;">
              <span style="color: #94a3b8;">Temperature</span>
              <strong style="color: ${color}; font-family: var(--font-mono);">${tempC}°C</strong>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span style="color: #94a3b8;">Thermal Risk</span>
              <strong style="color: ${color};">${feature.properties.heat_risk}</strong>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span style="color: #94a3b8;">Tree Canopy</span>
              <strong>${feature.properties.tree_canopy ?? '—'}%</strong>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span style="color: #94a3b8;">Solar Albedo</span>
              <strong>${feature.properties.albedo ?? '—'}</strong>
            </div>
          </div>
        </div>
      `, {
        className: 'thermal-popup',
        maxWidth: 220
      });

      group.addLayer(polygon);
    });
  }, [heatmapData, showHeatmap, getThermalColor, mapReady]);

  // Render Routes (Standard vs CoolPath)
  useEffect(() => {
    if (!mapInstanceRef.current || !layersGroupRef.current.routes || !mapReady) return;
    const group = layersGroupRef.current.routes;
    group.clearLayers();

    if (!showRoutes || !routingData) return;

    // 1. Standard Asphalt Route (Red Dashed Line)
    if (routingData.standard?.waypoints) {
      const stdPoly = L.polyline(routingData.standard.waypoints, {
        color: '#ef4444',
        weight: 4,
        dashArray: '8, 6',
        opacity: 0.8,
        lineCap: 'round',
        lineJoin: 'round',
        className: 'route-standard'
      });
      
      // Add animated dash effect via CSS
      stdPoly.bindPopup(`
        <div style="font-family: var(--font-sans); font-size: 12px; min-width: 200px;">
          <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 8px; padding-bottom: 6px; border-bottom: 1px solid rgba(239,68,68,0.3);">
            <span style="width: 12px; height: 12px; border-radius: 50%; background: #ef4444; box-shadow: 0 0 8px #ef4444;"></span>
            <strong style="color: #ef4444; font-size: 13px;">Standard Asphalt Corridor</strong>
          </div>
          <div style="display: grid; gap: 4px;">
            <div style="display: flex; justify-content: space-between;">
              <span style="color: #94a3b8;">Avg Temperature</span>
              <strong style="color: #ef4444; font-family: var(--font-mono);">${routingData.standard.avgTempC}°C</strong>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span style="color: #94a3b8;">Shade Coverage</span>
              <strong>${routingData.standard.shadePercent}%</strong>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span style="color: #94a3b8;">Distance / Time</span>
              <strong style="font-family: var(--font-mono);">${routingData.standard.distanceKm} km · ${routingData.standard.walkTimeMin} min</strong>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span style="color: #94a3b8;">Heat Exposure</span>
              <strong style="color: #ef4444; font-family: var(--font-mono);">${routingData.standard.exposureCMin ?? '—'} °C·min</strong>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span style="color: #94a3b8;">UV Index</span>
              <strong>${routingData.standard.uvRadiationIndex}</strong>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span style="color: #94a3b8;">Risk Level</span>
              <strong style="color: #ef4444;">${routingData.standard.heatStressRisk}</strong>
            </div>
          </div>
        </div>
      `, { className: 'route-popup', maxWidth: 240 });
      group.addLayer(stdPoly);
    }

    // 2. Thermos CoolPath Corridor (Glowing Cyan/Emerald Line)
    if (routingData.cool?.waypoints) {
      const coolPoly = L.polyline(routingData.cool.waypoints, {
        color: '#00f2fe',
        weight: 5,
        opacity: 0.95,
        lineCap: 'round',
        lineJoin: 'round',
        className: 'route-coolpath'
      });
      
      // Add glow effect
      const glowPoly = L.polyline(routingData.cool.waypoints, {
        color: '#00f2fe',
        weight: 10,
        opacity: 0.15,
        lineCap: 'round',
        lineJoin: 'round',
        interactive: false
      });
      
      coolPoly.bindPopup(`
        <div style="font-family: var(--font-sans); font-size: 12px; min-width: 200px;">
          <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 8px; padding-bottom: 6px; border-bottom: 1px solid rgba(0,242,254,0.3);">
            <span style="width: 12px; height: 12px; border-radius: 50%; background: linear-gradient(135deg, #00f2fe, #10b981); box-shadow: 0 0 10px #00f2fe;"></span>
            <strong style="color: #00f2fe; font-size: 13px;">✨ Thermos CoolPath</strong>
          </div>
          <div style="display: grid; gap: 4px;">
            <div style="display: flex; justify-content: space-between;">
              <span style="color: #94a3b8;">Avg Temperature</span>
              <strong style="color: #10b981; font-family: var(--font-mono);">${routingData.cool.avgTempC}°C</strong>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span style="color: #94a3b8;">Shade Coverage</span>
              <strong style="color: #10b981;">${routingData.cool.shadePercent}%</strong>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span style="color: #94a3b8;">Distance / Time</span>
              <strong style="font-family: var(--font-mono);">${routingData.cool.distanceKm} km · ${routingData.cool.walkTimeMin} min</strong>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span style="color: #94a3b8;">Heat Exposure</span>
              <strong style="color: #10b981; font-family: var(--font-mono);">${routingData.cool.exposureCMin ?? '—'} °C·min</strong>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span style="color: #94a3b8;">Temp Reduction</span>
              <strong style="color: #10b981; font-family: var(--font-mono);">-${routingData.cool.tempReductionDeltaC}°C</strong>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span style="color: #94a3b8;">Exposure Saved</span>
              <strong style="color: #10b981; font-family: var(--font-mono);">${routingData.cool.exposureReductionPercent ?? 0}%</strong>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span style="color: #94a3b8;">Cooling Shelters</span>
              <strong style="color: #00f2fe;">${routingData.cool.hydrationsAlongPath ?? 0} nearby</strong>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span style="color: #94a3b8;">Risk Level</span>
              <strong style="color: #10b981;">${routingData.cool.heatStressRisk}</strong>
            </div>
          </div>
        </div>
      `, { className: 'route-popup coolpath-popup', maxWidth: 240 });
      
      group.addLayer(glowPoly);
      group.addLayer(coolPoly);
    }
  }, [routingData, showRoutes, mapReady]);

  // Render Shelters & Hotspots Markers
  useEffect(() => {
    if (!mapInstanceRef.current || !mapReady) return;
    
    // Shelters
    const shelterGroup = layersGroupRef.current.shelters;
    shelterGroup.clearLayers();
    if (showShelters && selectedCity.coolingShelters) {
      selectedCity.coolingShelters.forEach(s => {
        const marker = L.circleMarker([s.lat, s.lng], {
          radius: 10,
          color: '#38bdf8',
          fillColor: '#00f2fe',
          fillOpacity: 1,
          weight: 2,
          className: 'shelter-marker'
        });
        marker.bindPopup(`
          <div style="font-family: var(--font-sans); font-size: 12px; min-width: 180px; text-align: center;">
            <div style="display: flex; align-items: center; justify-content: center; gap: 6px; margin-bottom: 8px;">
              <span style="font-size: 16px;">❄️</span>
              <strong style="color: #00f2fe;">${s.name}</strong>
            </div>
            <div style="display: grid; gap: 4px; text-align: left;">
              <div style="display: flex; justify-content: space-between; padding: 4px 0; border-bottom: 1px solid rgba(255,255,255,0.08);">
                <span style="color: #94a3b8; font-size: 11px;">Capacity</span>
                <strong style="font-family: var(--font-mono);">${s.capacity} people</strong>
              </div>
              <div style="display: flex; justify-content: space-between; padding: 4px 0;">
                <span style="color: #94a3b8; font-size: 11px;">Free Water</span>
                <strong style="color: #38bdf8;">✓ Available</strong>
              </div>
              <div style="display: flex; justify-content: space-between; padding: 4px 0;">
                <span style="color: #94a3b8; font-size: 11px;">Misting</span>
                <strong style="color: #10b981;">Active</strong>
              </div>
            </div>
          </div>
        `, { className: 'shelter-popup', maxWidth: 220 });
        shelterGroup.addLayer(marker);
      });
    }

    // Hotspots
    const hotspotGroup = layersGroupRef.current.hotspots;
    hotspotGroup.clearLayers();
    if (showHotspots && selectedCity.hotspots) {
      selectedCity.hotspots.forEach(h => {
        const isCool = h.type === 'cool';
        const marker = L.circleMarker([h.lat, h.lng], {
          radius: 8,
          color: isCool ? '#10b981' : '#dc2626',
          fillColor: isCool ? '#34d399' : '#ef4444',
          fillOpacity: 0.95,
          weight: 2,
          className: 'hotspot-marker'
        });
        marker.bindPopup(`
          <div style="font-family: var(--font-sans); font-size: 12px; min-width: 180px;">
            <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 8px; padding-bottom: 6px; border-bottom: 1px solid rgba(255,255,255,0.1);">
              <span style="font-size: 14px;">${isCool ? '🌳' : '🔥'}</span>
              <strong style="color: ${isCool ? '#10b981' : '#ef4444'};">${isCool ? 'Shaded Zone' : 'Asphalt Heat Trap'}</strong>
            </div>
            <div style="display: grid; gap: 4px;">
              <div style="display: flex; justify-content: space-between;">
                <span style="color: #94a3b8;">${h.name}</span>
              </div>
              <div style="display: flex; justify-content: space-between;">
                <span style="color: #94a3b8;">Surface Temp</span>
                <strong style="color: ${isCool ? '#10b981' : '#ef4444'}; font-family: var(--font-mono);">${h.tempC}°C</strong>
              </div>
              <div style="display: flex; justify-content: space-between;">
                <span style="color: #94a3b8;">Shade Coverage</span>
                <strong>${h.shade}%</strong>
              </div>
            </div>
          </div>
        `, { className: 'hotspot-popup', maxWidth: 220 });
        hotspotGroup.addLayer(marker);
      });
    }
  }, [selectedCity, showShelters, showHotspots, mapReady]);

  const LayerControl = ({ label, checked, onChange, icon, color }) => (
    <label style={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: '10px', 
      cursor: 'pointer', 
      color: checked ? '#f8fafc' : '#64748b',
      padding: '6px 8px',
      borderRadius: '8px',
      transition: 'all 0.2s ease',
      background: checked ? 'rgba(0, 242, 254, 0.08)' : 'transparent'
    }}>
      <input 
        type="checkbox" 
        checked={checked} 
        onChange={(e) => onChange(e.target.checked)} 
        style={{ 
          width: '16px', 
          height: '16px', 
          accentColor: color,
          cursor: 'pointer'
        }} 
      />
      <span style={{ fontSize: '0.78rem', fontWeight: 500 }}>{icon}</span>
      <span style={{ fontSize: '0.78rem', fontWeight: 500 }}>{label}</span>
    </label>
  );

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', minHeight: '520px', borderRadius: '16px', overflow: 'hidden' }}>
      {/* Map Element */}
      <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />

      {/* Floating Layer Controls */}
      <div className="glass-panel" style={{
        position: 'absolute',
        top: '16px',
        right: '16px',
        zIndex: 1000,
        padding: '12px',
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
        fontSize: '0.78rem',
        minWidth: '180px',
        boxShadow: '0 8px 32px -8px rgba(0,0,0,0.5)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, color: '#f8fafc', marginBottom: '6px', paddingBottom: '6px', borderBottom: '1px solid var(--border-glass)' }}>
          <span style={{ display: 'flex', alignItems: center, justifyContent: center, width: '28px', height: '28px', borderRadius: '8px', background: 'rgba(0, 242, 254, 0.15)' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00f2fe" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
              <polyline points="2 17 12 22 22 17"></polyline>
              <polyline points="2 12 12 17 22 12"></polyline>
            </svg>
          </span>
          <span>Active Layers</span>
        </div>

        <LayerControl 
          label="2m Thermal Heatmap" 
          checked={showHeatmap} 
          onChange={setShowHeatmap} 
          icon="🌡️" 
          color="#00f2fe" 
        />
        <LayerControl 
          label="CoolPath Navigation" 
          checked={showRoutes} 
          onChange={setShowRoutes} 
          icon="🛤️" 
          color="#10b981" 
        />
        <LayerControl 
          label="Cooling Shelters" 
          checked={showShelters} 
          onChange={setShowShelters} 
          icon="❄️" 
          color="#38bdf8" 
        />
        <LayerControl 
          label="Thermal Hotspots" 
          checked={showHotspots} 
          onChange={setShowHotspots} 
          icon="🔥" 
          color="#ef4444" 
        />
      </div>

      {/* Floating Thermal Scale Legend */}
      <div className="glass-panel" style={{
        position: 'absolute',
        bottom: '16px',
        left: '16px',
        zIndex: 1000,
        padding: '12px 16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        fontSize: '0.75rem',
        boxShadow: '0 8px 32px -8px rgba(0,0,0,0.5)'
      }}>
        <div style={{ fontWeight: 700, color: '#94a3b8', fontSize: '0.7rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Pedestrian 2m Thermal Scale</div>
        <div style={{
          display: 'flex',
          height: '12px',
          width: '240px',
          borderRadius: '6px',
          background: 'linear-gradient(90deg, #38bdf8 0%, #10b981 20%, #f59e0b 40%, #ef4444 65%, #dc2626 100%)',
          boxShadow: '0 0 16px rgba(239, 68, 68, 0.3), inset 0 1px 0 rgba(255,255,255,0.1)'
        }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b', fontSize: '0.65rem', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>
          <span>{'< 30°C'}</span>
          <span>32°C</span>
          <span>35°C</span>
          <span>38°C</span>
          <span>41°C</span>
          <span>{'> 45°C'}</span>
        </div>
        {routingData?.comparison && (
          <div style={{ 
            marginTop: '4px', 
            paddingTop: '8px', 
            borderTop: '1px solid var(--border-glass)',
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '0.7rem',
            color: '#94a3b8'
          }}>
            <span>CoolPath Exposure Savings</span>
            <strong style={{ color: '#10b981', fontFamily: 'var(--font-mono)' }}>
              -{routingData.comparison.exposureSavedCMin} °C·min ({routingData.comparison.exposureReductionPercent}%)
            </strong>
          </div>
        )}
      </div>
    </div>
  );
}
