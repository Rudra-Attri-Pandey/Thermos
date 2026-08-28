import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import Header from './components/Header';
import TrackTabs from './components/TrackTabs';
import MapView from './components/MapView';
import AgentTerminal from './components/AgentTerminal';
import CoolPath from './components/modules/CoolPath';
import GridCool from './components/modules/GridCool';
import ThermoSafe from './components/modules/ThermoSafe';
import UrbanSim from './components/modules/UrbanSim';
import ThermalML from './components/modules/ThermalML';
import AgenticView from './components/modules/AgenticView';
import HeatEquity from './components/modules/HeatEquity';
import ReportModal from './components/common/ReportModal';

import { CITIES } from './services/cityDatasets';
import { fortyGuardApi } from './services/fortyGuardApi';
import { RoutingEngine } from './services/routingEngine';
import { PhysicsSimulator } from './services/physicsSimulator';
import { MultiAgentSwarm } from './services/multiAgentSwarm';

export default function App() {
  const [selectedCity, setSelectedCity] = useState(CITIES.sanjose);
  const [activeModel, setActiveModel] = useState('NVIDIA Nemotron 3 Ultra');
  const [activeTrack, setActiveTrack] = useState('overview');
  const [credits, setCredits] = useState(2000000);
  const [isRunning, setIsRunning] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [apiStatus, setApiStatus] = useState('idle'); // 'live' | 'demo' | 'idle'
  const [toast, setToast] = useState(null);
  const toastTimerRef = useRef(null);

  // Core Intelligence State
  const [heatmapData, setHeatmapData] = useState(null);
  const [envParams, setEnvParams] = useState(null);
  const [routingData, setRoutingData] = useState(null);
  const [simulationData, setSimulationData] = useState(null);
  const [streetView, setStreetView] = useState(null);
  const [agentLogs, setAgentLogs] = useState([]);

  // Initialize Swarm Engine (stable instance across renders)
  const swarmRef = useRef(null);
  if (!swarmRef.current) {
    swarmRef.current = new MultiAgentSwarm((newLog) => {
      setAgentLogs(prev => [...prev, newLog]);
    });
  }
  const swarm = swarmRef.current;

  const showToast = (msg) => {
    setToast(msg);
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => setToast(null), 4500);
  };

  const updateApiStatus = () => setApiStatus(fortyGuardApi.getDataSourceStatus());

  useEffect(() => {
    fortyGuardApi.onFallback = (kind) => showToast(`Live ${kind} data unreachable — synthetic demo data shown`);
    return () => { fortyGuardApi.onFallback = null; };
  }, []);

  // Run initial data loading on city change
  useEffect(() => {
    loadCityData(selectedCity);
  }, [selectedCity]);

  // Pull real credit balance from the live FortyGuard usage endpoint
  useEffect(() => {
    fortyGuardApi.fetchUsage()
      .then(u => {
        const remaining = u?.credit_summary?.cycle_remaining_credits;
        if (remaining !== undefined && remaining !== null) setCredits(remaining);
      })
      .catch(() => {});
  }, []);

  const loadCityData = async (city) => {
    setIsRunning(true);
    swarm.setModel(activeModel);

    const [hm, env, st] = await Promise.all([
      fortyGuardApi.createHeatmap(city.polygon),
      fortyGuardApi.getEnvParams(city.lat, city.lng, city.baseTempC),
      fortyGuardApi.getStreetView(city.lat, city.lng)
    ]);

    // Routing runs after the thermal grid lands so route temps come from live data
    const startPoint = { lat: city.lat - 0.005, lng: city.lng - 0.006 };
    const endPoint = { lat: city.lat + 0.006, lng: city.lng + 0.007 };
    const routes = RoutingEngine.calculateCoolRoute(startPoint, endPoint, city, hm, st);
    const sim = PhysicsSimulator.simulateIntervention(city, 25, 45, 6);

    setHeatmapData(hm);
    setEnvParams(env);
    setRoutingData(routes);
    setSimulationData(sim);
    setStreetView(st);
    updateApiStatus();
    setIsRunning(false);

    // Initial Welcome log in terminal
    setAgentLogs([
      {
        timestamp: new Date().toLocaleTimeString(),
        agent: '🤖 Master Dispatcher Agent',
        action: 'Workspace Initialized',
        tool: 'SYSTEM_BOOT',
        details: `Loaded ${city.name} AOI (104 km²). FortyGuard 2m LTM model active with ${credits.toLocaleString()} credits.`,
        durationMs: 45,
        model: activeModel
      }
    ]);
  };

  // Master Swarm Execution
  const handleRunAutonomousSwarm = async () => {
    setIsRunning(true);
    swarm.setModel(activeModel);
    setAgentLogs([]); // Fresh run

    try {
      const result = await swarm.executeAutonomousWorkflow(
        'Run a comprehensive multi-track climate resilience audit for the selected city: assess current thermal conditions, compute a safer shaded route, simulate a mitigation scenario (+30% tree canopy, 50% cool roofs), and deliver an executive brief.',
        selectedCity,
        { treeCanopyDelta: 30, coolRoofCoverage: 50 }
      );

      if (result.heatmap) setHeatmapData(result.heatmap);
      if (result.envParams) setEnvParams(result.envParams);
      if (result.routing) setRoutingData(result.routing);
      if (result.simulation) setSimulationData(result.simulation);
      if (result.streetView) setStreetView(result.streetView);
      if (result.credits) setCredits(result.credits);

      // Trigger Confetti Celebration on successful agent run!
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#00f2fe', '#38bdf8', '#10b981', '#f59e0b']
      });
    } catch (err) {
      console.error('Swarm execution error:', err);
    } finally {
      setIsRunning(false);
    }
  };

  const handleCustomPrompt = async (promptText) => {
    setIsRunning(true);
    swarm.setModel(activeModel);

    swarm.log('👤 User Request', 'Query submitted to autonomous swarm', 'USER_PROMPT', promptText);

    try {
      // Custom prompts run through the REAL agentic loop — the LLM decides
      // which FortyGuard tools to call to answer the question.
      const result = await swarm.executeAutonomousWorkflow(promptText, selectedCity);

      if (result.heatmap) setHeatmapData(result.heatmap);
      if (result.envParams) setEnvParams(result.envParams);
      if (result.routing) setRoutingData(result.routing);
      if (result.simulation) setSimulationData(result.simulation);
      if (result.streetView) setStreetView(result.streetView);
      if (result.credits) setCredits(result.credits);
    } catch (err) {
      console.error('Nemotron query error:', err);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Header
        selectedCity={selectedCity}
        setSelectedCity={setSelectedCity}
        activeModel={activeModel}
        credits={credits}
        apiStatus={apiStatus}
        isRunning={isRunning}
        onRunAutonomousSwarm={handleRunAutonomousSwarm}
        onOpenReportModal={() => setIsReportOpen(true)}
      />

      {/* 7-Tracks Switcher Tabs */}
      <TrackTabs activeTrack={activeTrack} setActiveTrack={setActiveTrack} />

      {/* Main Content Layout */}
      <main style={{ flex: 1, padding: '0 16px 20px 16px', display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '16px' }}>
        {/* Left Column: Interactive Map + Active Module View */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Map View */}
          <div className="glass-panel" style={{ height: '480px', padding: '8px', overflow: 'hidden' }}>
            <MapView
              selectedCity={selectedCity}
              heatmapData={heatmapData}
              routingData={routingData}
              simulationData={simulationData}
            />
          </div>

          {/* Module Inspector Based on Active Track */}
          <div>
            {activeTrack === 'overview' && (
              <CoolPath routingData={routingData} selectedCity={selectedCity} />
            )}
            {activeTrack === 'track01' && (
              <CoolPath routingData={routingData} selectedCity={selectedCity} />
            )}
            {activeTrack === 'track02' && (
              <GridCool selectedCity={selectedCity} envParams={envParams} />
            )}
            {activeTrack === 'track03' && (
              <ThermoSafe selectedCity={selectedCity} envParams={envParams} />
            )}
            {activeTrack === 'track04' && (
              <UrbanSim selectedCity={selectedCity} onSimulationChange={setSimulationData} />
            )}
            {activeTrack === 'track05' && (
              <ThermalML selectedCity={selectedCity} heatmapData={heatmapData} envParams={envParams} />
            )}
            {activeTrack === 'track06' && (
              <AgenticView activeModel={activeModel} isRunning={isRunning} onRunSwarm={handleRunAutonomousSwarm} />
            )}
            {activeTrack === 'track07' && (
              <HeatEquity selectedCity={selectedCity} heatmapData={heatmapData} />
            )}
          </div>
        </div>

        {/* Right Column: Live Glass-Box Agent Terminal & Swarm Intelligence */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Autonomous Agent Terminal */}
          <div style={{ flex: 1, minHeight: '500px' }}>
            <AgentTerminal
              logs={agentLogs}
              activeModel={activeModel}
              isRunning={isRunning}
              onRunCustomPrompt={handleCustomPrompt}
              selectedCity={selectedCity}
            />
          </div>

          {/* Key Climate Indicators Strip */}
          <div className="glass-panel" style={{ padding: '14px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', textAlign: 'center' }}>
            <div>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>2m Ambient Ground</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ef4444', fontFamily: 'var(--font-mono)' }}>
                {selectedCity.baseTempC}°C
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Wet-Bulb Safety (WBGT)</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f59e0b', fontFamily: 'var(--font-mono)' }}>
                {envParams?.wet_bulb_temperature_celsius || 29.4}°C
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>CoolPath ΔT Drop</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#10b981', fontFamily: 'var(--font-mono)' }}>
                -{routingData?.cool?.tempReductionDeltaC || 5.7}°C
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Fallback honesty toast */}
      {toast && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 10000,
          background: 'rgba(15, 23, 42, 0.95)',
          border: '1px solid rgba(245, 158, 11, 0.5)',
          borderRadius: '10px',
          padding: '10px 18px',
          color: '#fbbf24',
          fontSize: '0.82rem',
          fontWeight: 600,
          boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          ⚠️ {toast}
        </div>
      )}

      {/* Export Action Brief Modal */}
      <ReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        selectedCity={selectedCity}
        activeModel={activeModel}
        routingData={routingData}
        simulationData={simulationData}
        envParams={envParams}
      />
    </div>
  );
}
