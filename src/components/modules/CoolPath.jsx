import React from 'react';
import { Compass, ShieldCheck, Sun, Umbrella, AlertTriangle, ArrowRight, Activity, MapPin, TrendingDown, Droplets, Leaf, Wind, Zap, Gauge } from 'lucide-react';

const MetricCard = ({ label, value, unit, color, icon, trend, description }) => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px',
    background: 'rgba(255, 255, 255, 0.03)',
    border: `1px solid ${color}33`,
    borderRadius: '10px',
    transition: 'all 0.2s ease'
  }}>
    <div style={{
      width: '44px',
      height: '44px',
      borderRadius: '10px',
      background: `linear-gradient(135deg, ${color}22, ${color}11)`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      border: `1px solid ${color}44`
    }}>
      <icon size={20} color={color} />
    </div>
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ fontSize: '0.62rem', fontWeight: 600, color: color, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '2px' }}>
        {label}
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '1.35rem', fontWeight: 800, color: '#f8fafc', fontFamily: 'var(--font-mono)' }}>
          {value}
        </span>
        {unit && <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 500 }}>{unit}</span>}
        {trend && (
          <span style={{ fontSize: '0.7rem', fontWeight: 600, color: '#10b981', display: 'flex', alignItems: 'center', gap: '2px', marginLeft: '8px' }}>
            <TrendingDown size={10} />
            {trend}
          </span>
        )}
      </div>
      {description && <p style={{ fontSize: '0.65rem', color: '#64748b', margin: '4px 0 0 0', lineHeight: 1.3 }}>{description}</p>}
    </div>
  </div>
);

const RouteCard = ({ title, icon, color, temp, metrics, badge, children, gradient }) => (
  <div className="glass-panel glass-panel-interactive" style={{
    padding: '20px',
    border: `1px solid ${color}44`,
    background: gradient || `linear-gradient(135deg, ${color}0d, ${color}06)`,
    boxShadow: `0 0 24px -4px ${color}33`,
    position: 'relative',
    overflow: 'hidden'
  }}>
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: `linear-gradient(90deg, transparent, ${color}, transparent)` }} />
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '10px',
          background: `linear-gradient(135deg, ${color}22, ${color}11)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: `1px solid ${color}44`
        }}>
          <icon size={20} color={color} />
        </div>
        <div>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc', margin: 0 }}>{title}</h3>
          <span style={{
            fontSize: '0.62rem',
            fontWeight: 700,
            padding: '2px 8px',
            borderRadius: '20px',
            background: `${color}22`,
            color,
            border: `1px solid ${color}44`,
            textTransform: 'uppercase'
          }}>
            {badge}
          </span>
        </div>
      </div>
      <div style={{ textAlign: 'right' }}>
        <div style={{ fontSize: '2.5rem', fontWeight: 800, color, fontFamily: 'var(--font-mono)', lineHeight: 1, textShadow: `0 0 16px ${color}88` }}>
          {temp}°C
        </div>
        <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '-4px' }}>{metrics?.tempLabel || 'Time-weighted Avg'}</div>
      </div>
    </div>

    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginBottom: '16px' }}>
      {metrics?.items?.map((m, i) => (
        <MetricCard key={i} {...m} />
      ))}
    </div>

    <p style={{ fontSize: '0.75rem', color: '#94a3b8', lineHeight: 1.5, borderTop: '1px solid var(--border-glass)', paddingTop: '12px' }}>
      {children}
    </p>
  </div>
);

export default function CoolPath({ routingData, selectedCity }) {
  if (!routingData) {
    return (
      <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>
        <div style={{ width: '48px', height: '48px', margin: '0 auto 16px', borderRadius: '12px', background: 'rgba(0, 242, 254, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(0, 242, 254, 0.2)' }}>
          <Activity size={24} color="#00f2fe" />
        </div>
        <p style={{ fontSize: '0.9rem', fontWeight: 500 }}>Loading CoolPath Navigation…</p>
        <p style={{ fontSize: '0.75rem', marginTop: '8px' }}>Sampling live 2m thermal grid for {selectedCity?.name}</p>
      </div>
    );
  }

  const { standard, cool, comparison } = routingData;
  const tempDrop = cool.tempReductionDeltaC ?? 0;
  const exposureSaved = comparison?.exposureSavedCMin ?? 0;
  const exposurePct = comparison?.exposureReductionPercent ?? 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Hero Banner */}
      <div className="glass-panel" style={{ 
        padding: '20px 24px', 
        borderLeft: '4px solid #00f2fe',
        background: 'linear-gradient(135deg, rgba(0, 242, 254, 0.08), rgba(16, 185, 129, 0.06))',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg, transparent, #00f2fe, #10b981, transparent)' }} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ flex: 1, minWidth: '240px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #00f2fe, #38bdf8)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 16px rgba(0, 242, 254, 0.4)'
              }}>
                <Compass size={18} color="#05080f" strokeWidth={2.5} />
              </div>
              <div>
                <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#f8fafc', margin: 0, letterSpacing: '-0.02em' }}>
                  Track 01: Thermal Shadow & CoolPath Navigation
                </h2>
                <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: '2px 0 0 0' }}>
                  Real-time pedestrian & gig-worker routing avoiding asphalt heat traps · FortyGuard 2m LTM
                </p>
              </div>
            </div>
          </div>
          <div style={{ 
            textAlign: 'right',
            padding: '16px 20px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(0, 242, 254, 0.1))',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            minWidth: '180px'
          }}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'flex-end', gap: '4px', marginBottom: '4px' }}>
              <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Temp Reduction</span>
              <span style={{ fontSize: '1.8rem', fontWeight: 800, color: '#10b981', fontFamily: 'var(--font-mono)' }}>-{tempDrop}°C</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'flex-end', gap: '4px' }}>
              <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#00f2fe', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Exposure Saved</span>
              <span style={{ fontSize: '1.35rem', fontWeight: 800, color: '#00f2fe', fontFamily: 'var(--font-mono)' }}>{exposureSaved} °C·min</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'flex-end', gap: '4px', marginTop: '4px' }}>
              <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Exposure Reduction</span>
              <span style={{ fontSize: '1.35rem', fontWeight: 800, color: '#f59e0b', fontFamily: 'var(--font-mono)' }}>{exposurePct}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Route Comparison Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
        {/* Standard Asphalt Card */}
        <RouteCard
          title="Standard Asphalt Corridor"
          icon={Sun}
          color="#ef4444"
          temp={standard.avgTempC}
          badge="DANGER"
          gradient="linear-gradient(135deg, rgba(239, 68, 68, 0.08), rgba(239, 68, 68, 0.03))"
          metrics={{
            tempLabel: 'Peak Asphalt Temp',
            items: [
              { label: 'Heat Exposure', value: standard.exposureCMin, unit: '°C·min', color: '#ef4444', icon: Gauge, trend: null, description: 'Cumulative thermal load' },
              { label: 'Distance / Time', value: standard.distanceKm, unit: `km · ${standard.walkTimeMin} min`, color: '#f8fafc', icon: MapPin, trend: null, description: 'Direct road corridor' },
              { label: 'Shade Coverage', value: standard.shadePercent, unit: '%', color: '#ef4444', icon: Leaf, trend: null, description: 'Severe canopy deficit' },
              { label: 'UV Index', value: standard.uvRadiationIndex, unit: '/12', color: '#ef4444', icon: Zap, trend: null, description: 'Extreme radiation hazard' },
            ]
          }}
        >
          Direct sun exposure along road corridors. {standard.sampledSegments}/{standard.segmentCount} segments sampled from {routingData.dataSource === 'estimate' ? 'baseline estimate' : 'live 2m thermal grid'}. {standard.directSunExposureMins} mins direct sun.
        </RouteCard>

        {/* Thermos CoolPath Card */}
        <RouteCard
          title="Thermos CoolPath Corridor"
          icon={Umbrella}
          color="#00f2fe"
          temp={cool.avgTempC}
          badge="OPTIMAL"
          gradient="linear-gradient(135deg, rgba(0, 242, 254, 0.08), rgba(16, 185, 129, 0.06))"
          metrics={{
            tempLabel: 'Shaded Ambient Temp',
            items: [
              { label: 'Heat Exposure', value: cool.exposureCMin, unit: '°C·min', color: '#10b981', icon: Gauge, trend: `${exposurePct}% less`, description: 'Cumulative thermal load' },
              { label: 'Distance / Time', value: cool.distanceKm, unit: `km · ${cool.walkTimeMin} min`, color: '#f8fafc', icon: MapPin, trend: comparison?.extraWalkMins > 0 ? `+${comparison.extraWalkMins} min` : comparison?.extraWalkMins < 0 ? `${comparison.extraWalkMins} min` : null, description: 'Optimized shaded detour' },
              { label: 'Shade Coverage', value: cool.shadePercent, unit: '%', color: '#10b981', icon: Leaf, trend: null, description: 'Continuous canopy corridor' },
              { label: 'Cooling Shelters', value: cool.hydrationsAlongPath, unit: 'nearby', color: '#00f2fe', icon: Droplets, trend: null, description: 'Free water & misting' },
            ]
          }}
        >
          Routed through cooler corridors: {tempDrop}°C lower time-weighted temp and {exposureSaved}°C·min ({exposurePct}%) less heat exposure than the direct route. {cool.hydrationsAlongPath} cooling shelter(s) within 400m.
        </RouteCard>
      </div>

      {/* Comparison Summary */}
      {comparison && (
        <div className="glass-panel" style={{ 
          padding: '16px 20px',
          background: 'linear-gradient(135deg, rgba(0, 242, 254, 0.06), rgba(16, 185, 129, 0.05))',
          border: '1px solid rgba(0, 242, 254, 0.2)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#94a3b8', fontSize: '0.8rem' }}>
              <ArrowRight size={16} color="#00f2fe" />
              <span>CoolPath Advantage Summary</span>
            </div>
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
              <div style={{ textAlign: 'center', padding: '8px 16px', background: 'rgba(0, 242, 254, 0.1)', borderRadius: '8px', border: '1px solid rgba(0, 242, 254, 0.2)' }}>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#00f2fe', fontFamily: 'var(--font-mono)' }}>{comparison.extraDistanceKm >= 0 ? '+' : ''}{comparison.extraDistanceKm} km</div>
                <div style={{ fontSize: '0.65rem', color: '#64748b', textTransform: 'uppercase' }}>Extra Distance</div>
              </div>
              <div style={{ textAlign: 'center', padding: '8px 16px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#10b981', fontFamily: 'var(--font-mono)' }}>{comparison.extraWalkMins >= 0 ? '+' : ''}{comparison.extraWalkMins} min</div>
                <div style={{ fontSize: '0.65rem', color: '#64748b', textTransform: 'uppercase' }}>Extra Walk Time</div>
              </div>
              <div style={{ textAlign: 'center', padding: '8px 16px', background: 'rgba(245, 158, 11, 0.1)', borderRadius: '8px', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#f59e0b', fontFamily: 'var(--font-mono)' }}>{exposurePct}%</div>
                <div style={{ fontSize: '0.65rem', color: '#64748b', textTransform: 'uppercase' }}>Exposure Reduced</div>
              </div>
              <div style={{ textAlign: 'center', padding: '8px 16px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#10b981', fontFamily: 'var(--font-mono)' }}>{cool.hydrationsAlongPath}</div>
                <div style={{ fontSize: '0.65rem', color: '#64748b', textTransform: 'uppercase' }}>Shelters Nearby</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}