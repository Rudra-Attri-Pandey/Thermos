import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Terminal, Send, CheckCircle2, Clock, Sparkles, Play, Flame, ShieldAlert, Cpu, Zap, Brain, Zap as ZapIcon, Activity, FileText, Search, Mic } from 'lucide-react';

const AGENT_COLORS = {
  '🤖 Master Dispatcher Agent': '#00f2fe',
  '🧠 Nemotron 3 Ultra — Reasoning': '#a855f7',
  '🌐 Sentinel Data Agent': '#38bdf8',
  '🚶 Thermal Shadow Agent': '#f97316',
  '🌳 UrbanSim Physics Agent': '#10b981',
  '⚖️ HeatEquity & Impact Agent': '#f59e0b',
  '👤 User Request': '#c084fc',
  '⚠️ Resilience Controller': '#ef4444',
  '🟢 NVIDIA Nemotron 3 Ultra (550B)': '#34d399'
};

const TOOL_ICONS = {
  'NEMOTRON_550B_PLAN': '🧠',
  'REASONING_TRACE': '💭',
  'TOOL_CALL': '🔧',
  'POST': '📡',
  'GET': '📥',
  'COMPUTE': '⚡',
  'SIMULATE': '🧪',
  'GENERATE': '📝',
  'FALLBACK': '⚠️',
  'FORCE': '⚡',
  'SYSTEM': '🖥️',
  'USER_PROMPT': '💬',
  'NVIDIA_NIM_RESPONSE': '🤖',
  'DETERMINISTIC_BRIEF': '📋'
};

export default function AgentTerminal({ 
  logs, 
  activeModel, 
  isRunning, 
  onRunCustomPrompt,
  selectedCity 
}) {
  const [inputPrompt, setInputPrompt] = useState('');
  const logEndRef = useRef(null);
  const [focused, setFocused] = useState(false);
  const [activeLogIndex, setActiveLogIndex] = useState(null);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [logs]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputPrompt.trim() || isRunning) return;
    onRunCustomPrompt(inputPrompt);
    setInputPrompt('');
  };

  const samplePrompts = [
    { label: 'Heat Audit', prompt: `Audit extreme heat hotspots in ${selectedCity.name}` },
    { label: 'CoolPath', prompt: `Generate shaded CoolPath for delivery riders` },
    { label: 'UrbanSim', prompt: `Simulate +30% tree canopy & cool roof ROI` },
    { label: 'HVAC Optimize', prompt: `Optimize building HVAC pre-cooling schedule` }
  ];

  const getAgentColor = (agent) => AGENT_COLORS[agent] || '#00f2fe';
  const getToolIcon = (tool) => {
    const prefix = Object.keys(TOOL_ICONS).find(k => tool.startsWith(k));
    return prefix ? TOOL_ICONS[prefix] : '⚙️';
  };

  const formatDuration = (ms) => {
    if (ms == null || ms === '') return null;
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
  };

  const isReasoning = (log) => log.tool === 'REASONING_TRACE' || log.tool?.startsWith('REASONING');
  const isToolCall = (log) => log.tool?.startsWith('TOOL_CALL');
  const isResult = (log) => log.tool?.endsWith('_RESULT');
  const isError = (log) => log.tool?.includes('FALLBACK') || log.tool?.includes('ERROR');
  const isFinal = (log) => log.tool === 'GENERATE_EXECUTIVE_BRIEF' || log.tool === 'DETERMINISTIC_BRIEF';

  return (
    <div className="glass-panel" style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      minHeight: '420px',
      overflow: 'hidden',
      border: focused ? '1px solid rgba(0, 242, 254, 0.5)' : '1px solid rgba(0, 242, 254, 0.2)',
      boxShadow: focused ? '0 0 32px -4px rgba(0, 242, 254, 0.15)' : 'none',
      transition: 'all 0.3s ease',
      background: 'rgba(5, 8, 16, 0.7)'
    }} onMouseEnter={() => setFocused(true)} onMouseLeave={() => setFocused(false)}>
      
      {/* Terminal Header */}
      <div style={{
        padding: '12px 16px',
        borderBottom: '1px solid var(--border-glass)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'rgba(5, 8, 16, 0.9)',
        position: 'relative'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ 
            width: '32px', 
            height: '32px', 
            borderRadius: '8px', 
            background: 'linear-gradient(135deg, #00f2fe, #a855f7)',
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            boxShadow: '0 0 16px rgba(0, 242, 254, 0.3)'
          }}>
            <Terminal size={16} color="#05080f" strokeWidth={2.5} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#f8fafc', letterSpacing: '0.01em' }}>
                Autonomous Agent Swarm Terminal
              </span>
              <span style={{ fontSize: '0.6rem', fontWeight: 700, padding: '2px 6px', borderRadius: '4px', background: 'rgba(0, 242, 254, 0.15)', color: '#00f2fe', border: '1px solid rgba(0, 242, 254, 0.3)', textTransform: 'uppercase' }}>
                Track 06
              </span>
            </div>
            <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>
              Real-time Nemotron 3 Ultra tool-calling · {logs.length} events
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '6px', 
            fontSize: '0.7rem', 
            color: '#10b981', 
            background: 'rgba(16, 185, 129, 0.12)', 
            padding: '4px 10px', 
            borderRadius: '6px', 
            border: '1px solid rgba(16, 185, 129, 0.25)' 
          }}>
            <Cpu size={12} color="#10b981" />
            <span style={{ fontWeight: 600 }}>Nemotron 3 Ultra · 550B</span>
            <span style={{ 
              width: '6px', 
              height: '6px', 
              borderRadius: '50%', 
              background: '#10b981', 
              boxShadow: '0 0 8px #10b981',
              animation: 'pulse-slow 2s infinite'
            }} />
          </div>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '6px', 
            fontSize: '0.7rem', 
            color: isRunning ? '#f97316' : '#64748b', 
            background: isRunning ? 'rgba(249, 115, 22, 0.12)' : 'rgba(100, 116, 139, 0.12)', 
            padding: '4px 10px', 
            borderRadius: '6px', 
            border: `1px solid ${isRunning ? 'rgba(249, 115, 22, 0.25)' : 'rgba(100, 116, 139, 0.2)'}` 
          }}>
            {isRunning ? (
              <>
                <Activity size={12} color="#f97316" style={{ animation: 'pulse-slow 1s infinite' }} />
                <span>Processing…</span>
              </>
            ) : (
              <>
                <CheckCircle2 size={12} color="#10b981" />
                <span>Ready</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Quick Prompt Suggestions */}
      <div style={{
        padding: '10px 14px',
        display: 'flex',
        gap: '8px',
        overflowX: 'auto',
        background: 'linear-gradient(90deg, rgba(15, 23, 42, 0.6), rgba(11, 19, 35, 0.8))',
        borderBottom: '1px solid var(--border-glass)',
        scrollbarWidth: 'none'
      }}>
        {samplePrompts.map((item, idx) => (
          <button
            key={idx}
            onClick={() => onRunCustomPrompt(item.prompt)}
            disabled={isRunning}
            title={item.prompt}
            style={{
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              color: '#94a3b8',
              fontSize: '0.7rem',
              fontWeight: 500,
              padding: '6px 12px',
              borderRadius: '8px',
              cursor: isRunning ? 'not-allowed' : 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              minWidth: 'fit-content'
            }}
            onMouseEnter={(e) => { if (!isRunning) { e.currentTarget.style.background = 'rgba(0, 242, 254, 0.1)'; e.currentTarget.style.borderColor = '#00f2fe'; e.currentTarget.style.color = '#00f2fe'; }}}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)'; e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.06)'; e.currentTarget.style.color = '#94a3b8'; }}
          >
            <Sparkles size={12} style={{ flexShrink: 0 }} />
            <span>{item.label}</span>
          </button>
        ))}
      </div>

      {/* Log Messages Stream */}
      <div style={{
        flex: 1,
        padding: '12px',
        overflowY: 'auto',
        fontFamily: 'var(--font-mono)',
        fontSize: '0.75rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        background: 'rgba(3, 5, 12, 0.95)'
      }}>
        {logs.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)', gap: '12px', padding: '20px', textAlign: 'center' }}>
            <div style={{ 
              width: '64px', 
              height: '64px', 
              borderRadius: '50%', 
              background: 'rgba(0, 242, 254, 0.1)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              border: '1px solid rgba(0, 242, 254, 0.2)'
            }}>
              <Terminal size={28} strokeWidth={1.5} color="#38bdf8" />
            </div>
            <p style={{ fontSize: '0.85rem', fontWeight: 500, color: '#f8fafc' }}>Agent Swarm Ready</p>
            <p style={{ fontSize: '0.7rem', maxWidth: '280px' }}>Click <strong style="color: #00f2fe">"Run AI Swarm"</strong> or enter a query below to begin autonomous climate analysis.</p>
          </div>
        ) : (
          logs.map((log, index) => {
            const color = getAgentColor(log.agent);
            const isActive = activeLogIndex === index;
            const logType = isReasoning(log) ? 'reasoning' : isToolCall(log) ? 'toolcall' : isResult(log) ? 'result' : isError(log) ? 'error' : isFinal(log) ? 'final' : 'normal';

            const logStyles = {
              base: {
                padding: '12px 14px',
                borderRadius: '10px',
                background: 'rgba(11, 19, 35, 0.8)',
                borderLeft: `3px solid ${color}`,
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
                transition: 'all 0.2s ease',
                border: isActive ? `1px solid ${color}` : '1px solid transparent',
                boxShadow: isActive ? `0 0 16px -2px ${color}` : 'none',
                opacity: isActive ? 1 : 0.95
              },
              reasoning: {
                background: 'rgba(168, 85, 247, 0.08)',
                borderLeftColor: '#a855f7'
              },
              toolcall: {
                background: 'rgba(249, 115, 22, 0.08)',
                borderLeftColor: '#f97316'
              },
              result: {
                background: 'rgba(16, 185, 129, 0.08)',
                borderLeftColor: '#10b981'
              },
              error: {
                background: 'rgba(239, 68, 68, 0.08)',
                borderLeftColor: '#ef4444'
              },
              final: {
                background: 'rgba(0, 242, 254, 0.08)',
                borderLeftColor: '#00f2fe'
              }
            };

            const style = { ...logStyles.base, ...(logStyles[logType] || {}) };

            return (
              <div 
                key={index} 
                style={style}
                onMouseEnter={() => setActiveLogIndex(index)}
                onMouseLeave={() => setActiveLogIndex(null)}
              >
                {/* Header: Agent + Time */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ 
                      width: '8px', 
                      height: '8px', 
                      borderRadius: '50%', 
                      background: color,
                      boxShadow: `0 0 8px ${color}`
                    }} />
                    <span style={{ 
                      fontWeight: 700, 
                      color, 
                      fontSize: '0.78rem',
                      fontFamily: 'var(--font-sans)'
                    }}>
                      {log.agent}
                    </span>
                    {log.durationMs != null && log.durationMs !== '' && (
                      <span style={{ 
                        fontSize: '0.65rem', 
                        color: 'var(--text-muted)', 
                        fontFamily: 'var(--font-mono)',
                        background: 'rgba(255,255,255,0.04)',
                        padding: '1px 6px',
                        borderRadius: '4px'
                      }}>
                        {formatDuration(log.durationMs)}
                      </span>
                    )}
                  </div>
                  <span style={{ fontSize: '0.65rem', color: '#64748b', fontFamily: 'var(--font-mono)' }}>
                    {log.timestamp}
                  </span>
                </div>

                {/* Tool Badge + Action */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <span style={{
                    fontSize: '0.62rem',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '4px',
                    background: `rgba(${color === '#00f2fe' ? '0, 242, 254' : color === '#a855f7' ? '168, 85, 247' : color === '#f97316' ? '249, 115, 22' : color === '#38bdf8' ? '56, 189, 248' : color === '#10b981' ? '16, 185, 129' : '245, 158, 11'}, 0.15)`,
                    color,
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <span style={{ fontSize: '0.7rem' }}>{getToolIcon(log.tool)}</span>
                    {log.tool}
                  </span>
                  <span style={{ color: '#e2e8f0', fontSize: '0.78rem', fontWeight: 500, fontFamily: 'var(--font-sans)' }}>
                    {log.action}
                  </span>
                </div>

                {/* Details */}
                <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.72rem', lineHeight: '1.5', wordBreak: 'break-word' }}>
                  {log.details}
                </p>

                {/* Reasoning trace expander for long reasoning */}
                {isReasoning(log) && log.details.length > 200 && (
                  <details style={{ marginTop: '4px' }}>
                    <summary style={{ 
                      cursor: 'pointer', 
                      color: '#a855f7', 
                      fontSize: '0.65rem', 
                      fontWeight: 600,
                      fontFamily: 'var(--font-sans)',
                      userSelect: 'none'
                    }}>
                      ▸ Show full reasoning trace
                    </summary>
                    <div style={{ 
                      marginTop: '8px', 
                      padding: '8px 10px', 
                      background: 'rgba(168, 85, 247, 0.05)', 
                      borderRadius: '6px',
                      border: '1px solid rgba(168, 85, 247, 0.15)',
                      fontSize: '0.68rem',
                      lineHeight: '1.6',
                      color: '#c4b5fd',
                      whiteSpace: 'pre-wrap',
                      fontFamily: 'var(--font-mono)'
                    }}>
                      {log.details}
                    </div>
                  </details>
                )}
              </div>
            );
          })
        )}
        <div ref={logEndRef} style={{ height: '4px' }} />
      </div>

      {/* Input Prompt Box */}
      <form onSubmit={handleSubmit} style={{
        padding: '12px',
        borderTop: '1px solid var(--border-glass)',
        display: 'flex',
        gap: '10px',
        background: 'rgba(5, 8, 16, 0.95)',
        position: 'relative'
      }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <input
            type="text"
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder={`Ask Thermos Agents (e.g. "Assess heatstroke risk for elderly in ${selectedCity.name}")...`}
            disabled={isRunning}
            style={{
              flex: 1,
              background: focused ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.04)',
              border: focused ? '1px solid #00f2fe' : '1px solid var(--border-glass)',
              borderRadius: '10px',
              padding: '10px 14px',
              color: '#f8fafc',
              fontSize: '0.82rem',
              fontFamily: 'var(--font-sans)',
              outline: 'none',
              transition: 'all 0.2s ease',
              boxShadow: focused ? '0 0 0 3px rgba(0, 242, 254, 0.1)' : 'none'
            }}
          />
          {!inputPrompt && !focused && (
            <span style={{
              position: 'absolute',
              left: '14px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-dim)',
              fontSize: '0.82rem',
              pointerEvents: 'none',
              fontFamily: 'var(--font-sans)',
              transition: 'opacity 0.2s ease'
            }}>
              Ask Thermos Agents…
            </span>
          )}
        </div>
        <button
          type="submit"
          disabled={isRunning || !inputPrompt.trim()}
          style={{
            background: isRunning || !inputPrompt.trim() 
              ? 'rgba(255, 255, 255, 0.05)' 
              : 'linear-gradient(135deg, #00f2fe 0%, #38bdf8 100%)',
            border: 'none',
            borderRadius: '10px',
            padding: '10px 16px',
            color: isRunning || !inputPrompt.trim() ? '#475569' : '#05080f',
            cursor: isRunning || !inputPrompt.trim() ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s ease',
            boxShadow: isRunning || !inputPrompt.trim() ? 'none' : '0 0 20px rgba(0, 242, 254, 0.4), 0 4px 12px -4px rgba(0, 242, 254, 0.2)',
            minWidth: '48px'
          }}
        >
          {isRunning ? (
            <Activity size={18} color="#94a3b8" style={{ animation: 'spin 1s linear infinite' }} />
          ) : (
            <Send size={18} color="#05080f" />
          )}
        </button>
      </form>
    </div>
  );
}