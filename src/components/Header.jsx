import React from 'react';
import { 
  Flame, 
  Cpu, 
  Activity, 
  MapPin, 
  Download, 
  ShieldCheck, 
  RefreshCw, 
  Zap,
  Layers,
  Radio,
  Circle
} from 'lucide-react';
import { CITIES } from '../services/cityDatasets';

export default function Header({
  selectedCity,
  setSelectedCity,
  activeModel,
  credits,
  apiStatus,
  isRunning,
  onRunAutonomousSwarm,
  onOpenReportModal
}) {
  const badgeColor = '#10b981';
  const badgeBg = 'rgba(16, 185, 129, 0.12)';
  const badgeBorder = 'rgba(16, 185, 129, 0.3)';
  const badgeLabel = 'Live data';

  const headerStyle = {
    margin: '12px 16px',
    padding: '14px 22px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '14px',
    background: 'rgba(11, 19, 35, 0.9)',
    backdropFilter: 'blur(20px) saturate(180%)',
    border: '1px solid var(--border-glass)',
    borderRadius: '16px',
    boxShadow: '0 4px 24px -4px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.03)',
    position: 'relative',
    overflow: 'hidden'
  };

  const badgeStyle = (bg, border, color) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: bg,
    border: `1px solid ${border}`,
    borderRadius: '10px',
    padding: '7px 14px',
    fontSize: '0.75rem',
    fontWeight: 700,
    color,
    letterSpacing: '0.04em',
    transition: 'all 0.2s ease'
  });

  const selectWrapperStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: 'rgba(15, 23, 42, 0.8)',
    border: '1px solid var(--border-glass)',
    borderRadius: '10px',
    padding: '7px 14px',
    transition: 'all 0.2s ease'
  };

  const selectStyle = {
    background: 'transparent',
    border: 'none',
    color: '#f8fafc',
    fontSize: '0.85rem',
    fontWeight: 600,
    cursor: 'pointer',
    outline: 'none',
    minWidth: '180px'
  };

  const buttonPrimaryStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: isRunning ? 'rgba(56, 189, 248, 0.15)' : 'linear-gradient(135deg, #00f2fe 0%, #38bdf8 100%)',
    color: isRunning ? '#38bdf8' : '#05080f',
    border: 'none',
    borderRadius: '10px',
    padding: '9px 18px',
    fontSize: '0.85rem',
    fontWeight: 800,
    cursor: isRunning ? 'not-allowed' : 'pointer',
    boxShadow: isRunning ? 'none' : '0 0 20px rgba(0, 242, 254, 0.35), 0 4px 12px -4px rgba(0, 242, 254, 0.2)',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    textTransform: 'uppercase',
    letterSpacing: '0.04em'
  };

  const buttonSecondaryStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    background: 'rgba(255, 255, 255, 0.05)',
    color: '#f8fafc',
    border: '1px solid var(--border-glass)',
    borderRadius: '10px',
    padding: '9px 16px',
    fontSize: '0.82rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    textTransform: 'uppercase',
    letterSpacing: '0.02em'
  };

  return (
    <header style={headerStyle}>
      {/* Animated background scanline */}
      <div className="scanline-effect" style={{ 
        position: 'absolute', 
        top: 0, left: 0, right: 0, bottom: 0, 
        pointerEvents: 'none',
        borderRadius: '16px'
      }} />

      {/* Brand & Project Identity */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', position: 'relative', zIndex: 1 }}>
        <div style={{
          width: '46px',
          height: '46px',
          borderRadius: '14px',
          background: 'linear-gradient(135deg, #00f2fe 0%, #38bdf8 50%, #06b6d4 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 24px rgba(0, 242, 254, 0.5), inset 0 1px 0 rgba(255,255,255,0.2)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <Flame size={26} color="#05080f" strokeWidth={2.5} />
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 50%)',
            borderRadius: '14px'
          }} />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h1 style={{ 
              fontSize: '1.35rem', 
              fontWeight: 800, 
              letterSpacing: '-0.03em', 
              margin: 0, 
              lineHeight: 1.1,
              background: 'linear-gradient(135deg, #00f2fe 0%, #38bdf8 50%, #c084fc 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              THERMOS AI
            </h1>
            <span style={{
              fontSize: '0.62rem',
              fontWeight: 800,
              padding: '3px 10px',
              borderRadius: '20px',
              background: 'linear-gradient(135deg, rgba(0, 242, 254, 0.15), rgba(56, 189, 248, 0.1))',
              color: '#00f2fe',
              border: '1px solid rgba(0, 242, 254, 0.3)',
              textTransform: 'uppercase',
              letterSpacing: '0.08em'
            }}>
              Autonomous OS
            </span>
          </div>
          <p style={{ 
            fontSize: '0.78rem', 
            color: 'var(--text-secondary)', 
            margin: '2px 0 0 0',
            fontWeight: 400,
            letterSpacing: '0.01em'
          }}>
            Hyperlocal 2m Temperature Intelligence · FortyGuard Hackathon '26 · Developed by Rudra Attri Pandey
          </p>
        </div>
      </div>

      {/* Control Actions & Selectors */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', position: 'relative', zIndex: 1 }}>
        
        {/* City Selector */}
        <div style={selectWrapperStyle} onMouseEnter={(e) => e.currentTarget.style.borderColor = 'rgba(0, 242, 254, 0.4)'} onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-glass)'}>
          <MapPin size={16} color="#38bdf8" />
          <select 
            value={selectedCity.id} 
            onChange={(e) => setSelectedCity(CITIES[e.target.value])}
            style={selectStyle}
          >
            {Object.values(CITIES).map(city => (
              <option key={city.id} value={city.id} style={{ background: '#0b1324', color: '#fff' }}>
                {city.name}
              </option>
            ))}
          </select>
        </div>

        {/* AI Model Brain Badge */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(56, 189, 248, 0.08))',
          border: '1px solid rgba(16, 185, 129, 0.25)',
          borderRadius: '10px',
          padding: '7px 14px',
          transition: 'all 0.2s ease'
        }}>
          <Cpu size={16} color="#10b981" />
          <span style={{ 
            fontSize: '0.8rem', 
            fontWeight: 700, 
            color: '#34d399',
            letterSpacing: '0.01em',
            background: 'linear-gradient(135deg, #34d399, #10b981)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Nemotron 3 Ultra · 550B
          </span>
          <span style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background: '#10b981',
            boxShadow: '0 0 8px #10b981',
            animation: 'pulse-slow 2s infinite'
          }} />
        </div>

        {/* Data Source Honesty Badge */}
        <div style={badgeStyle(badgeBg, badgeBorder, badgeColor)}>
          <span style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: badgeColor,
            boxShadow: `0 0 10px ${badgeColor}`,
            display: 'inline-block',
            animation: isLive ? 'pulse-slow 2s infinite' : 'none'
          }} />
          <span>{badgeLabel}</span>
        </div>

        {/* Live API Credits Badge */}
        <div style={badgeStyle('rgba(0, 242, 254, 0.08)', 'rgba(0, 242, 254, 0.25)', '#38bdf8')}>
          <ShieldCheck size={16} color="#00f2fe" />
          <span>FortyGuard API:</span>
          <strong style={{ color: '#00f2fe', fontFamily: 'var(--font-mono)' }}>{(credits).toLocaleString()} Cr</strong>
        </div>

        {/* Master Autonomous Workflow Button */}
        <button
          onClick={onRunAutonomousSwarm}
          disabled={isRunning}
          style={buttonPrimaryStyle}
          onMouseEnter={(e) => { if (!isRunning) { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 0 28px rgba(0, 242, 254, 0.45), 0 6px 16px -4px rgba(0, 242, 254, 0.3)'; }}}
          onMouseLeave={(e) => { if (!isRunning) { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 242, 254, 0.35), 0 4px 12px -4px rgba(0, 242, 254, 0.2)'; }}}
        >
          {isRunning ? (
            <>
              <RefreshCw size={16} style={{ animation: 'spin 1s linear infinite' }} />
              <span>Agents Running…</span>
            </>
          ) : (
            <>
              <Zap size={16} fill="#05080f" />
              <span>Run AI Swarm</span>
            </>
          )}
        </button>

        {/* Export Brief Button */}
        <button
          onClick={onOpenReportModal}
          style={buttonSecondaryStyle}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)'; e.currentTarget.style.borderColor = 'rgba(0, 242, 254, 0.3)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'; e.currentTarget.style.borderColor = 'var(--border-glass)'; e.currentTarget.style.transform = 'translateY(0)'; }}
        >
          <Download size={15} />
          <span>Export Brief</span>
        </button>

      </div>
    </header>
  );
}