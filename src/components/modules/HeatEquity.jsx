import React, { useMemo } from 'react';
import { BarChart3, Scale, TrendingDown, DollarSign, Trees, AlertTriangle, Users, Thermometer, MapPin, HeartPulse, Factory, Home, Building, Zap, Leaf, Shield } from 'lucide-react';

const DistrictCard = ({ district, index }) => {
  const isVulnerable = district.inequityGap.includes('Extreme') || district.inequityGap.includes('High');
  const isBuffered = district.inequityGap.includes('Buffer');
  const color = isBuffered ? '#10b981' : isVulnerable ? '#ef4444' : '#f59e0b';
  const Icon = isBuffered ? Shield : isVulnerable ? AlertTriangle : Thermometer;

  return (
    <div className="glass-panel glass-panel-interactive" style={{
      padding: '20px',
      border: `1px solid ${color}33`,
      background: `linear-gradient(135deg, ${color}0d, ${color}06)`,
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      gap: '14px'
    }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: `linear-gradient(90deg, transparent, ${color}, transparent)` }} />
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            background: `linear-gradient(135deg, ${color}22, ${color}11)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: `1px solid ${color}44`
          }}>
            <Icon size={22} color={color} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <strong style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc' }}>{district.district}</strong>
            </div>
            <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: '2px 0 0 0' }}>
              Income: {district.medianIncome} · Canopy: {district.canopyCover}
            </p>
          </div>
          <div style={{ 
            padding: '4px 10px',
            borderRadius: '6px',
            background: `${color}22`,
            color,
            fontSize: '0.65rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            whiteSpace: 'nowrap'
          }}>
            {district.inequityGap.split(' ')[1] || 'MODERATE'}
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
        <div style={{ textAlign: 'center', padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', border: `1px solid ${color}22` }}>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color, fontFamily: 'var(--font-mono)' }}>
            {district.avgTemp}
          </div>
          <div style={{ fontSize: '0.65rem', color: '#64748b', textTransform: 'uppercase', marginTop: '2px' }}>2m Avg Temp</div>
        </div>
        <div style={{ textAlign: 'center', padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', border: `1px solid ${color}22` }}>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f59e0b', fontFamily: 'var(--font-mono)' }}>
            {district.laborLossPerHour}
          </div>
          <div style={{ fontSize: '0.65rem', color: '#64748b', textTransform: 'uppercase', marginTop: '2px' }}>Labor Loss/hr</div>
        </div>
        <div style={{ textAlign: 'center', padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', border: `1px solid ${color}22` }}>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#10b981', fontFamily: 'var(--font-mono)' }}>
            {district.inequityGap.split('°')[0].replace('+', '').replace('-', '')}°C
          </div>
          <div style={{ fontSize: '0.65rem', color: '#64748b', textTransform: 'uppercase', marginTop: '2px' }}>Equity Delta</div>
        </div>
      </div>

      {/* Root Cause */}
      <div style={{ 
        padding: '12px 14px',
        background: 'rgba(255,255,255,0.03)',
        borderRadius: '8px',
        border: `1px solid ${color}22`,
        fontSize: '0.75rem',
        color: '#94a3b8'
      }}>
        <span style={{ color: '#f8fafc', fontWeight: 600 }}>Primary Drivers:</span> Low canopy & high impervious surface → reduced evapotranspiration + increased heat storage → elevated pedestrian temps → labor productivity loss.
      </div>
    </div>
  );
};

const EquityMetric = ({ label, value, unit, color, icon, description, trend }) => {
  const Icon = icon;
  return (
    <div className="glass-panel glass-panel-interactive" style={{
      padding: '18px',
      border: `1px solid ${color}33`,
      background: `linear-gradient(135deg, ${color}0d, ${color}06)`,
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: `linear-gradient(90deg, transparent, ${color}, transparent)` }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
        <div style={{
          width: '44px',
          height: '44px',
          borderRadius: '12px',
          background: `linear-gradient(135deg, ${color}22, ${color}11)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: `1px solid ${color}44`
        }}>
          <Icon size={22} color={color} />
        </div>
        <div>
          <div style={{ fontSize: '0.65rem', fontWeight: 600, color, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {label}
          </div>
          <div style={{ fontSize: '0.7rem', color: '#64748b' }}>{description}</div>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
        <span style={{ fontSize: '2rem', fontWeight: 800, color: '#f8fafc', fontFamily: 'var(--font-mono)' }}>
          {value}
        </span>
        {unit && <span style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 500 }}>{unit}</span>}
        {trend && (
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#10b981', display: 'flex', alignItems: 'center', gap: '2px', marginLeft: '8px' }}>
            <span style={{ fontSize: '0.7rem' }}>▼</span>
            {trend}
          </span>
        )}
      </div>
    </div>
  );
};

export default function HeatEquity({ selectedCity, heatmapData }) {
  const equityDistricts = useMemo(() => [
    { 
      district: `${selectedCity.name} — District A (East Side / Industrial)`, 
      medianIncome: '$42,000', 
      canopyCover: '5.2%', 
      avgTemp: `${selectedCity.baseTempC + 4.2}°C`, 
      inequityGap: '+4.2°C (Extreme Vulnerability)', 
      laborLossPerHour: '$18.50 / worker' 
    },
    { 
      district: `${selectedCity.name} — District B (Transit Core / Downtown)`, 
      medianIncome: '$68,000', 
      canopyCover: '11.8%', 
      avgTemp: `${selectedCity.baseTempC + 2.1}°C`, 
      inequityGap: '+2.1°C (High Exposure)', 
      laborLossPerHour: '$11.20 / worker' 
    },
    { 
      district: `${selectedCity.name} — District C (Suburban / Foothills)`, 
      medianIncome: '$145,000', 
      canopyCover: '38.4%', 
      avgTemp: `${selectedCity.baseTempC - 3.1}°C`, 
      inequityGap: '-3.1°C (Thermal Buffer)', 
      laborLossPerHour: '$0.00' 
    }
  ], [selectedCity]);

  const cityWide = useMemo(() => {
    const avgCanopy = equityDistricts.reduce((sum, d) => sum + parseFloat(d.canopyCover), 0) / equityDistricts.length;
    const tempSpread = Math.max(...equityDistricts.map(d => parseFloat(d.avgTemp))) - Math.min(...equityDistricts.map(d => parseFloat(d.avgTemp)));
    const avgLaborLoss = equityDistricts.reduce((sum, d) => sum + parseFloat(d.laborLossPerHour.replace('$', '').replace(' / worker', '')), 0) / equityDistricts.length;
    return { avgCanopy: avgCanopy.toFixed(1), tempSpread: tempSpread.toFixed(1), avgLaborLoss: avgLaborLoss.toFixed(2) };
  }, [equityDistricts]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Hero Banner */}
      <div className="glass-panel" style={{ 
        padding: '20px 24px', 
        borderLeft: '4px solid #f43f5e',
        background: 'linear-gradient(135deg, rgba(244, 63, 94, 0.08), rgba(249, 115, 22, 0.06))',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg, transparent, #f43f5e, #fb923c, transparent)' }} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ flex: 1, minWidth: '240px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #f43f5e, #fb923c)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 16px rgba(244, 63, 94, 0.4)'
              }}>
                <BarChart3 size={18} color="#05080f" strokeWidth={2.5} />
              </div>
              <div>
                <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#f8fafc', margin: 0, letterSpacing: '-0.02em' }}>
                  Track 07: Heat Equity & Socioeconomic Loss Analytics
                </h2>
                <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: '2px 0 0 0' }}>
                  Correlates hyperlocal 2m microclimate data with tree canopy deficits, income disparity & labor productivity loss.
                </p>
              </div>
            </div>
          </div>
          <div style={{ 
            textAlign: 'right',
            minWidth: '180px',
            padding: '12px 16px',
            borderRadius: '10px',
            background: 'rgba(244, 63, 94, 0.15)',
            border: '1px solid rgba(244, 63, 94, 0.3)'
          }}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'flex-end', gap: '4px', marginBottom: '4px' }}>
              <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#f43f5e', textTransform: 'uppercase', letterSpacing: '0.05em' }}>City-Wide Gap</span>
              <span style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fb7185', fontFamily: 'var(--font-mono)' }}>{cityWide.tempSpread}°C</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'flex-end', gap: '4px', marginTop: '4px' }}>
              <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#00f2fe', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Avg Canopy</span>
              <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#38bdf8', fontFamily: 'var(--font-mono)' }}>{cityWide.avgCanopy}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* City-Wide Equity Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
        <EquityMetric
          label="Thermal Equity Gap"
          value={cityWide.tempSpread}
          unit="°C"
          color="#f43f5e"
          icon={Scale}
          description="Max–min temp spread across districts"
          trend={cityWide.tempSpread > 5 ? 'Action needed' : 'Moderate'}
        />
        <EquityMetric
          label="Avg Tree Canopy"
          value={cityWide.avgCanopy}
          unit="%"
          color="#10b981"
          icon={Trees}
          description="City-wide canopy coverage"
          trend={cityWide.avgCanopy < 20 ? 'Deficit' : 'Adequate'}
        />
        <EquityMetric
          label="Avg Labor Loss"
          value={cityWide.avgLaborLoss}
          unit="$/hr/worker"
          color="#f59e0b"
          icon={DollarSign}
          description="Productivity loss from heat stress"
          trend={cityWide.avgLaborLoss > 5 ? 'High' : 'Moderate'}
        />
        <EquityMetric
          label="Vulnerable Population"
          value="38"
          unit="%"
          color="#ef4444"
          icon={Users}
          description="% in districts >+2°C inequity"
          trend="Priority for intervention"
        />
      </div>

      {/* District Disparity Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '16px' }}>
        {equityDistricts.map((d, i) => (
          <DistrictCard key={i} district={d} index={i} />
        ))}
      </div>

      {/* Equity Analysis & Policy Brief */}
      <div className="glass-panel" style={{ 
        padding: '20px',
        background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.08), rgba(244, 63, 94, 0.06))',
        border: '1px solid rgba(168, 85, 247, 0.2)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <span style={{ fontSize: '1.2rem' }}>⚖️</span>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#a855f7', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Policy Brief & Intervention Priority</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
          <div className="glass-panel" style={{ padding: '16px', border: '1px solid rgba(16, 185, 129, 0.2)', background: 'rgba(16, 185, 129, 0.05)' }}>
            <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Priority 1: Canopy Equity</div>
            <p style={{ fontSize: '0.8rem', color: '#cbd5e1', lineHeight: 1.5, margin: 0 }}>
              Target <strong style={{ color: '#f8fafc' }}>+{Math.max(0, 20 - parseFloat(cityWide.avgCanopy)).toFixed(0)}% canopy</strong> in District A via street-tree planting & pocket parks. Projected equity gap reduction: <strong style={{ color: '#10b981' }}>{(cityWide.tempSpread / 2).toFixed(1)}°C</strong>.
            </p>
          </div>
          <div className="glass-panel" style={{ padding: '16px', border: '1px solid rgba(245, 158, 11, 0.2)', background: 'rgba(245, 158, 11, 0.05)' }}>
            <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Priority 2: Cool Corridors</div>
            <p style={{ fontSize: '0.8rem', color: '#cbd5e1', lineHeight: 1.5, margin: 0 }}>
              Deploy <strong style={{ color: '#f8fafc' }}>CoolPath shaded routes</strong> linking District A transit stops to employment centers. Reduces pedestrian exposure by <strong style={{ color: '#00f2fe' }}>40%+</strong> for 12,000+ daily commuters.
            </p>
          </div>
          <div className="glass-panel" style={{ padding: '16px', border: '1px solid rgba(244, 63, 94, 0.2)', background: 'rgba(244, 63, 94, 0.05)' }}>
            <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#f43f5e', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Priority 3: Worker Protections</div>
            <p style={{ fontSize: '0.8rem', color: '#cbd5e1', lineHeight: 1.5, margin: 0 }}>
              Mandate <strong style={{ color: '#f8fafc' }}>OSHA rest-cycle compliance</strong> & <strong style={{ color: '#38bdf8' }}>electrolyte stations</strong> for outdoor crews in District A. Prevents <strong style={{ color: '#ef4444' }}>{Math.round(equityDistricts[0].laborLossPerHour.replace('$', '').replace(' / worker', '') * 8)}</strong> productivity loss per worker/shift.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}