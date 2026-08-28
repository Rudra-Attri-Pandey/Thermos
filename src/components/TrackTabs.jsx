import React from 'react';
import { 
  Compass, 
  Building2, 
  HardHat, 
  Landmark, 
  BrainCircuit, 
  Bot, 
  BarChart3,
  LayoutGrid,
  Zap
} from 'lucide-react';

export const TRACKS = [
  { id: 'overview', name: 'Overview', icon: LayoutGrid, tag: 'Unified OS', color: '#00f2fe' },
  { id: 'track01', name: 'CoolPath Route', icon: Compass, tag: 'Track 01', color: '#38bdf8' },
  { id: 'track02', name: 'GridCool Energy', icon: Building2, tag: 'Track 02', color: '#f59e0b' },
  { id: 'track03', name: 'ThermoSafe Worker', icon: HardHat, tag: 'Track 03', color: '#ef4444' },
  { id: 'track04', name: 'UrbanSim Twin', icon: Landmark, tag: 'Track 04', color: '#10b981' },
  { id: 'track05', name: 'ThermalML Model', icon: BrainCircuit, tag: 'Track 05', color: '#a855f7' },
  { id: 'track06', name: 'Agentic Swarm', icon: Bot, tag: 'Track 06 (Core)', color: '#00f2fe' },
  { id: 'track07', name: 'Heat Equity', icon: BarChart3, tag: 'Track 07', color: '#f43f5e' }
];

export default function TrackTabs({ activeTrack, setActiveTrack }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      overflowX: 'auto',
      padding: '8px 16px 14px 16px',
      scrollbarWidth: 'none',
      scrollPadding: '0 16px'
    }}>
      {TRACKS.map((track, index) => {
        const Icon = track.icon;
        const isActive = activeTrack === track.id;
        return (
          <button
            key={track.id}
            onClick={() => setActiveTrack(track.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 16px',
              borderRadius: '12px',
              border: isActive ? `1px solid ${track.color}` : '1px solid var(--border-glass)',
              background: isActive 
                ? `linear-gradient(135deg, ${track.color}1a, ${track.color}0d)` 
                : 'rgba(15, 23, 42, 0.6)',
              color: isActive ? '#f8fafc' : '#94a3b8',
              fontSize: '0.8rem',
              fontWeight: isActive ? 700 : 500,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              boxShadow: isActive ? `0 0 20px ${track.color}22, 0 4px 12px -4px ${track.color}22` : 'none',
              transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
              position: 'relative',
              overflow: 'hidden',
              zIndex: 1
            }}
            onMouseEnter={(e) => {
              if (!isActive) {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                e.currentTarget.style.borderColor = `${track.color}44`;
                e.currentTarget.style.color = track.color;
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive) {
                e.currentTarget.style.background = 'rgba(15, 23, 42, 0.6)';
                e.currentTarget.style.borderColor = 'var(--border-glass)';
                e.currentTarget.style.color = '#94a3b8';
              }
            }}
          >
            {/* Active indicator line */}
            {isActive && (
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '3px',
                background: `linear-gradient(90deg, transparent, ${track.color}, ${track.color}88, transparent)`,
                animation: 'shimmer 1.5s infinite'
              }} />
            )}
            <Icon size={15} color={isActive ? track.color : '#94a3b8'} style={{ flexShrink: 0, transition: 'all 0.2s ease' }} />
            <span style={{ fontSize: '0.8rem', fontWeight: isActive ? 700 : 500, transition: 'all 0.2s ease' }}>
              {track.name}
            </span>
            <span style={{
              fontSize: '0.6rem',
              fontWeight: 700,
              padding: '3px 8px',
              borderRadius: '6px',
              background: isActive ? `${track.color}22` : 'rgba(255,255,255,0.05)',
              color: isActive ? track.color : '#64748b',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              transition: 'all 0.2s ease'
            }}>
              {track.tag}
            </span>
            {/* Pulse dot for active */}
            {isActive && (
              <span style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: track.color,
                boxShadow: `0 0 8px ${track.color}`,
                animation: 'pulse-slow 1.5s infinite',
                marginLeft: '4px'
              }} />
            )}
          </button>
        );
      })}
    </div>
  );
}