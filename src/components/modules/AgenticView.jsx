import React from 'react';
import { Bot, Cpu, Network, CheckCircle, Clock, Zap, ArrowRight, Layers as LayersIcon, Radio, Brain, Shield, Thermometer, Zap as ZapIcon, Droplets, Leaf, Scale, Globe, Users, CheckCircle2 } from 'lucide-react';

const AGENTS = [
  {
    id: 'master',
    name: 'Master Dispatcher',
    emoji: '🤖',
    role: 'Intent Deconstruction & Graph Routing',
    tools: ['LLM_PLANNER_GRAPH', 'DELEGATE_SUBTASK', 'SYNTHESIZE_BRIEF'],
    status: 'READY',
    color: '#00f2fe',
    icon: Brain,
    description: 'Orchestrates the full swarm — parses intent, plans tool calls, synthesizes executive briefs from live data.'
  },
  {
    id: 'sentinel',
    name: 'Sentinel Data Agent',
    emoji: '🌐',
    role: 'FortyGuard Asynchronous Ingestion & Polling',
    tools: ['POST /v1/heatmap', 'POST /v1/env_params', 'POST /v1/streetview', 'GET /v1/status'],
    status: 'LIVE — 2M Credits',
    color: '#38bdf8',
    icon: Network,
    description: 'Real-time 2m thermal grid ingestion — async polling with 15-attempt timeout, synthetic fallback on failure.'
  },
  {
    id: 'thermal',
    name: 'Thermal Shadow Agent',
    emoji: '🚶',
    role: 'Microclimate Pathfinding & WBGT Rest Safety',
    tools: ['COMPUTE_SHADOW_CORRIDOR', 'OSHA_REST_DISPATCH', 'EXPOSURE_CALCULATOR'],
    status: 'READY',
    color: '#f97316',
    icon: Thermometer,
    description: 'Exposure-optimal routing — snaps waypoints to coolest live cells, computes °C·min exposure, dispatches OSHA rest cycles.'
  },
  {
    id: 'gridcool',
    name: 'GridCool Energy Agent',
    emoji: '⚡',
    role: 'HVAC Thermal Load & Peak Tariff Optimizer',
    tools: ['PREDICT_MICROCLIMATE_PEAK', 'SCHEDULE_PRECOOL', 'CALCULATE_SAVINGS'],
    status: 'READY',
    color: '#f59e0b',
    icon: ZapIcon,
    description: '12hr thermal load forecasting — autonomous pre-cooling at off-peak tariffs, substation strain reduction.'
  },
  {
    id: 'urbansim',
    name: 'UrbanSim Physics Agent',
    emoji: '🌳',
    role: 'Thermodynamic Intervention Simulator',
    tools: ['SIMULATE_ALBEDO_EVAPOTRANSPIRATION', 'CALCULATE_ROI', 'GENERATE_POLICY_BRIEF'],
    status: 'READY',
    color: '#10b981',
    icon: Leaf,
    description: 'What-if physics engine — tree canopy evapotranspiration + cool-roof albedo + misting hub cooling with $/CO₂ ROI.'
  },
  {
    id: 'heatequity',
    name: 'HeatEquity & Impact Agent',
    emoji: '⚖️',
    role: 'Socioeconomic Gap & Executive Brief Generator',
    tools: ['SYNTHESIZE_EQUITY_GAP', 'GENERATE_EXECUTIVE_BRIEF', 'EXPORT_ACTION_PDF'],
    status: 'READY',
    color: '#a855f7',
    icon: Scale,
    description: 'Canopy deficit × income correlation — inequity scoring, labor productivity loss ($/hr), actionable policy briefs.'
  }
];

const stats = [
  { label: 'Agents Active', value: '6', color: '#00f2fe', icon: Bot },
  { label: 'Tools Available', value: '18', color: '#38bdf8', icon: Zap },
  { label: 'Avg Latency', value: '122ms', color: '#10b981', icon: Clock },
  { label: 'Tool-Calling Loop', value: 'Enabled', color: '#a855f7', icon: Brain }
];

const SwarmStats = () => (
  <div className="glass-panel" style={{ padding: '16px' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
      <LayersIcon size={16} color="#00f2fe" />
      <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f8fafc' }}>Swarm Telemetry</span>
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px' }}>
      {stats.map((s, i) => (
        <div key={i} className="glass-panel glass-panel-interactive" style={{ 
          padding: '14px',
          textAlign: 'center',
          border: `1px solid ${s.color}33`,
          background: `linear-gradient(135deg, ${s.color}0d, ${s.color}06)`
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginBottom: '6px' }}>
            <s.icon size={16} color={s.color} />
            <span style={{ fontSize: '0.65rem', fontWeight: 600, color: s.color, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {s.label}
            </span>
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: s.color, fontFamily: 'var(--font-mono)' }}>
            {s.value}
          </div>
        </div>
      ))}
    </div>
  </div>
);

const AgentCard = ({ agent }) => (
  <div className="glass-panel glass-panel-interactive" style={{
    padding: '20px',
    border: `1px solid ${agent.color}33`,
    background: `linear-gradient(135deg, ${agent.color}0d, ${agent.color}06)`,
    position: 'relative',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    gap: '14px'
  }}>
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: `linear-gradient(90deg, transparent, ${agent.color}, transparent)` }} />
    
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{
          width: '44px',
          height: '44px',
          borderRadius: '12px',
          background: `linear-gradient(135deg, ${agent.color}22, ${agent.color}11)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: `1px solid ${agent.color}44`
        }}>
          <agent.icon size={22} color={agent.color} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '1.5rem', lineHeight: 1 }}>{agent.emoji}</span>
            <strong style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc' }}>{agent.name}</strong>
          </div>
          <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: '2px 0 0 0', lineHeight: 1.4 }}>{agent.role}</p>
        </div>
        <div style={{ 
          padding: '4px 10px',
          borderRadius: '6px',
          background: 'rgba(16, 185, 129, 0.15)',
          color: '#10b981',
          fontSize: '0.65rem',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          whiteSpace: 'nowrap'
        }}>
          {agent.status}
        </div>
      </div>
    </div>

    <p style={{ fontSize: '0.75rem', color: '#94a3b8', lineHeight: 1.5, margin: 0 }}>{agent.description}</p>

    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
      {agent.tools.map((t, idx) => (
        <span key={idx} style={{
          fontSize: '0.65rem',
          fontFamily: 'var(--font-mono)',
          padding: '4px 8px',
          borderRadius: '6px',
          background: `${agent.color}1a`,
          color: agent.color,
          border: `1px solid ${agent.color}33`,
          transition: 'all 0.2s ease'
        }}>
          {t}
        </span>
      ))}
    </div>

    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'space-between',
      paddingTop: '8px',
      borderTop: '1px solid var(--border-glass)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ 
          width: '8px', 
          height: '8px', 
          borderRadius: '50%', 
          background: '#10b981',
          boxShadow: '0 0 8px #10b981',
          animation: 'pulse-slow 2s infinite'
        }} />
        <span style={{ fontSize: '0.7rem', color: '#10b981', fontWeight: 600 }}>Agent Active</span>
      </div>
      <span style={{ 
        fontSize: '0.65rem', 
        fontWeight: 600, 
        color: agent.color, 
        fontFamily: 'var(--font-mono)',
        background: `${agent.color}1a`,
        padding: '2px 8px',
        borderRadius: '4px'
      }}>
        {agent.emoji} {agent.id}
      </span>
    </div>
  </div>
);

const WorkflowDiagramComponent = () => (
  <div className="glass-panel" style={{ padding: '20px' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
      <ArrowRight size={18} color="#00f2fe" />
      <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#f8fafc' }}>Autonomous Workflow Pipeline</span>
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {[
        { step: 1, label: 'USER INTENT', desc: 'Natural language query → Nemotron parses & decomposes', color: '#a855f7', icon: Brain },
        { step: 2, label: 'TOOL PLANNING', desc: 'LLM selects tools & args → auto-generates call graph', color: '#00f2fe', icon: Network },
        { step: 3, label: 'EXECUTION', desc: 'Parallel tool calls → live FortyGuard / physics engines', color: '#f59e0b', icon: ZapIcon },
        { step: 4, label: 'REASONING', desc: 'Nemotron chain-of-thought over live results', color: '#a855f7', icon: Brain },
        { step: 5, label: 'ITERATION', desc: 'Loop until synthesis complete → max 8 steps', color: '#38bdf8', icon: ArrowRight },
        { step: 6, label: 'EXECUTIVE BRIEF', desc: 'Crisp 2-3 sentence actionable recommendation', color: '#10b981', icon: CheckCircle2 }
      ].map((s, i) => (
        <div key={i} style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '16px',
          padding: '12px 16px',
          background: `${s.color}0d`,
          border: `1px solid ${s.color}33`,
          borderRadius: '10px',
          transition: 'all 0.2s ease'
        }}>
          <div style={{ 
            width: '36px', 
            height: '36px', 
            borderRadius: '10px', 
            background: `linear-gradient(135deg, ${s.color}22, ${s.color}11)`,
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            border: `1px solid ${s.color}44`,
            flexShrink: 0
          }}>
            <s.icon size={18} color={s.color} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
              <span style={{ fontSize: '0.65rem', fontWeight: 700, color: s.color, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Step {s.step}
              </span>
              <strong style={{ fontSize: '0.85rem', color: '#f8fafc' }}>{s.label}</strong>
            </div>
            <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: 0 }}>{s.desc}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default function AgenticView({ activeModel, isRunning, onRunSwarm }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Hero Banner */}
      <div className="glass-panel" style={{ 
        padding: '20px 24px', 
        borderLeft: '4px solid #00f2fe',
        background: 'linear-gradient(135deg, rgba(0, 242, 254, 0.08), rgba(168, 85, 247, 0.06))',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg, transparent, #00f2fe, #a855f7, transparent)' }} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ flex: 1, minWidth: '240px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #00f2fe, #a855f7)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 16px rgba(0, 242, 254, 0.4)'
              }}>
                <Bot size={18} color="#05080f" strokeWidth={2.5} />
              </div>
              <div>
                <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#f8fafc', margin: 0, letterSpacing: '-0.02em' }}>
                  Track 06: Autonomous Multi-Agent Swarm (Core Flagship Brain)
                </h2>
                <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: '2px 0 0 0' }}>
                  Closed-loop multi-agent division of labor orchestrating FortyGuard APIs and climate actions without human delay.
                </p>
              </div>
            </div>
          </div>
          <div style={{ 
            textAlign: 'right',
            minWidth: '180px',
            padding: '12px 16px',
            borderRadius: '10px',
            background: 'rgba(0, 242, 254, 0.12)',
            border: '1px solid rgba(0, 242, 254, 0.25)'
          }}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'flex-end', gap: '4px', marginBottom: '4px' }}>
              <span style={{ fontSize: '0.65rem', fontWeight: 700, color: '#00f2fe', textTransform: 'uppercase', letterSpacing: '0.05em' }}>LLM Engine</span>
              <span style={{ fontSize: '1rem', fontWeight: 800, color: '#c084fc', fontFamily: 'var(--font-mono)' }}>Nemotron 550B</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'flex-end', gap: '4px', marginTop: '4px' }}>
              <span style={{ fontSize: '0.65rem', fontWeight: 700, color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Tool-Calling</span>
              <span style={{ fontSize: '1rem', fontWeight: 700, color: '#10b981' }}>Enabled</span>
            </div>
          </div>
        </div>
      </div>

      {/* Swarm Stats */}
      <SwarmStats />

      {/* Agent Roster */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '16px' }}>
        {AGENTS.map((agent, i) => (
          <AgentCard key={agent.id} agent={agent} index={i} />
        ))}
      </div>

      {/* Workflow Pipeline */}
      <WorkflowDiagramComponent />

      {/* Run Button */}
      <button
        onClick={onRunSwarm}
        disabled={isRunning}
        style={{
          width: '100%',
          padding: '16px 24px',
          background: isRunning 
            ? 'rgba(56, 189, 248, 0.15)' 
            : 'linear-gradient(135deg, #00f2fe 0%, #a855f7 100%)',
          color: isRunning ? '#38bdf8' : '#05080f',
          border: 'none',
          borderRadius: '12px',
          fontSize: '0.95rem',
          fontWeight: 800,
          cursor: isRunning ? 'not-allowed' : 'pointer',
          boxShadow: isRunning ? 'none' : '0 0 24px rgba(0, 242, 254, 0.35), 0 6px 20px -6px rgba(0, 242, 254, 0.25)',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px'
        }}
        onMouseEnter={(e) => { if (!isRunning) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 0 32px rgba(0, 242, 254, 0.45), 0 8px 24px -6px rgba(0, 242, 254, 0.3)'; }}}
        onMouseLeave={(e) => { if (!isRunning) { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 0 24px rgba(0, 242, 254, 0.35), 0 6px 20px -6px rgba(0, 242, 254, 0.25)'; }}}
      >
        {isRunning ? (
          <>
            <Radio size={20} color="#38bdf8" className="animate-pulse" />
            <span>Swarm Executing Autonomous Workflow…</span>
          </>
        ) : (
          <>
            <Zap size={20} fill="#05080f" />
            <span>Run Autonomous Swarm</span>
          </>
        )}
      </button>
    </div>
  );
}