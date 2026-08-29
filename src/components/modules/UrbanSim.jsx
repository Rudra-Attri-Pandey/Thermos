import React, { useState, useMemo } from 'react';
import { Landmark, Trees, ShieldCheck, DollarSign, HeartPulse, Leaf, Sparkles, Sliders, TrendingDown, Zap, Droplets, Gauge, Wind, Sun } from 'lucide-react';
import { PhysicsSimulator } from '../../services/physicsSimulator';

const SliderControl = ({ label, value, min, max, unit, color, icon: Icon, onChange, description, marks }) => (
  <div style={{ marginBottom: '20px' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Icon size={16} color={color} />
        <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#f8fafc' }}>{label}</span>
      </div>
      <strong style={{ color, fontFamily: 'var(--font-mono)', fontSize: '1.1rem' }}>{value}{unit}</strong>
    </div>
    <input
      type="range"
      min={min}
      max={max}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      style={{ 
        marginBottom: '4px',
        accentColor: color 
      }}
    />
    {marks && (
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', color: '#64748b', marginTop: '4px' }}>
        {marks.map((m, i) => <span key={i}>{m}</span>)}
      </div>
    )}
    <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '4px' }}>{description}</div>
  </div>
);

const ResultCard = ({ label, value, unit, color, icon: Icon, trend, description, prefix = '', size = 'normal' }) => (
  <div className="glass-panel glass-panel-interactive" style={{
    padding: size === 'large' ? '20px' : '16px',
    border: `1px solid ${color}33`,
    background: `linear-gradient(135deg, ${color}0d, ${color}06)`,
    position: 'relative',
    overflow: 'hidden'
  }}>
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: `linear-gradient(90deg, transparent, ${color}, transparent)` }} />
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: size === 'large' ? '16px' : '10px' }}>
      <div style={{
        width: size === 'large' ? '48px' : '40px',
        height: size === 'large' ? '48px' : '40px',
        borderRadius: '12px',
        background: `linear-gradient(135deg, ${color}22, ${color}11)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: `1px solid ${color}44`
      }}>
        <Icon size={size === 'large' ? 24 : 20} color={color} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: '0.65rem', fontWeight: 600, color, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '2px' }}>
          {label}
        </div>
        <div style={{ fontSize: '0.7rem', color: '#64748b' }}>{description}</div>
      </div>
    </div>
    <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', flexWrap: 'wrap' }}>
      {prefix && <span style={{ fontSize: size === 'large' ? '1.3rem' : '1rem', fontWeight: 700, color }}>{prefix}</span>}
      <span style={{ fontSize: size === 'large' ? '2.5rem' : '1.8rem', fontWeight: 800, color: '#f8fafc', fontFamily: 'var(--font-mono)' }}>
        {value}
      </span>
      {unit && <span style={{ fontSize: size === 'large' ? '1rem' : '0.8rem', color: '#94a3b8', fontWeight: 500 }}>{unit}</span>}
      {trend && (
        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#10b981', display: 'flex', alignItems: 'center', gap: '2px', marginLeft: '8px' }}>
          <TrendingDown size={12} />
          {trend}
        </span>
      )}
    </div>
  </div>
);

const BreakdownBar = ({ label, value, total, color, unit, icon: Icon }) => {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div style={{ marginBottom: '12px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Icon size={14} color={color} />
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#f8fafc' }}>{label}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <strong style={{ fontFamily: 'var(--font-mono)', color, fontSize: '0.85rem' }}>{value.toFixed(2)}{unit}</strong>
          <span style={{ fontSize: '0.7rem', color: '#64748b' }}>({pct}%)</span>
        </div>
      </div>
      <div style={{ height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
        <div style={{
          width: `${pct}%`,
          height: '100%',
          background: `linear-gradient(90deg, ${color}, ${color}aa)`,
          borderRadius: '4px',
          transition: 'width 0.5s ease-out'
        }} />
      </div>
    </div>
  );
};

export default function UrbanSim({ selectedCity, onSimulationChange }) {
  const [treeCanopyDelta, setTreeCanopyDelta] = useState(25);
  const [coolRoofCoverage, setCoolRoofCoverage] = useState(45);
  const [mistingHubs, setMistingHubs] = useState(6);

  const simResult = useMemo(() => 
    PhysicsSimulator.simulateIntervention(selectedCity, treeCanopyDelta, coolRoofCoverage, mistingHubs),
    [selectedCity, treeCanopyDelta, coolRoofCoverage, mistingHubs]
  );

  const handleCanopyChange = (val) => {
    setTreeCanopyDelta(val);
    if (onSimulationChange) {
      onSimulationChange(PhysicsSimulator.simulateIntervention(selectedCity, val, coolRoofCoverage, mistingHubs));
    }
  };

  const handleRoofChange = (val) => {
    setCoolRoofCoverage(val);
    if (onSimulationChange) {
      onSimulationChange(PhysicsSimulator.simulateIntervention(selectedCity, treeCanopyDelta, val, mistingHubs));
    }
  };

  const handleMistingChange = (val) => {
    setMistingHubs(val);
    if (onSimulationChange) {
      onSimulationChange(PhysicsSimulator.simulateIntervention(selectedCity, treeCanopyDelta, coolRoofCoverage, val));
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Hero Banner */}
      <div className="glass-panel" style={{ 
        padding: '20px 24px', 
        borderLeft: '4px solid #10b981',
        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08), rgba(0, 242, 254, 0.06))',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg, transparent, #10b981, #00f2fe, transparent)' }} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ flex: 1, minWidth: '240px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #10b981, #00f2fe)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 16px rgba(16, 185, 129, 0.4)'
              }}>
                <Landmark size={18} color="#05080f" strokeWidth={2.5} />
              </div>
              <div>
                <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#f8fafc', margin: 0, letterSpacing: '-0.02em' }}>
                  Track 04: UrbanSim — Digital Twin & Generative Cooling Simulator
                </h2>
                <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: '2px 0 0 0' }}>
                  Interactive "What-If" municipal climate intervention physics engine for policy makers & urban planners.
                </p>
              </div>
            </div>
          </div>
          <div style={{ textAlign: 'right', minWidth: '180px' }}>
            <div style={{ 
              padding: '12px 16px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(0, 242, 254, 0.1))',
              border: '1px solid rgba(16, 185, 129, 0.3)'
            }}>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'flex-end', gap: '4px', marginBottom: '4px' }}>
                <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Net Cooling</span>
                <span style={{ fontSize: '1.6rem', fontWeight: 800, color: '#10b981', fontFamily: 'var(--font-mono)' }}>-{simResult.totalTemperatureDropC}°C</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'flex-end', gap: '4px', marginTop: '4px' }}>
                <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#00f2fe', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Mitigated Temp</span>
                <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#00f2fe', fontFamily: 'var(--font-mono)' }}>{simResult.mitigatedTemperatureC}°C</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid — responsive, no horizontal overflow */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '16px' }}>
        {/* Sliders Panel */}
        <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '4px', height: 'fit-content' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
            <Sliders size={18} color="#00f2fe" />
            Interactive Intervention Controls
          </h3>

          <SliderControl
            label="Urban Tree Canopy Expansion"
            value={treeCanopyDelta}
            min={0}
            max={50}
            unit="%"
            color="#10b981"
            icon={Trees}
            onChange={handleCanopyChange}
            description={`Baseline: ${selectedCity.treeCanopyCover}% canopy · Each 1% ≈ 0.115°C cooling via evapotranspiration`}
            marks={['Baseline', '+25%', '+50% Max']}
          />

          <SliderControl
            label="High-Albedo Cool Roof Coating"
            value={coolRoofCoverage}
            min={0}
            max={100}
            unit="%"
            color="#38bdf8"
            icon={Sparkles}
            onChange={handleRoofChange}
            description="Albedo 0.15 → 0.75 · Each 1% ≈ 0.038°C cooling via solar reflectance"
            marks={['0% Dark', '50%', '100% White']}
          />

          <SliderControl
            label="Public Smart Misting Hubs"
            value={mistingHubs}
            min={0}
            max={20}
            unit=" Active"
            color="#00f2fe"
            icon={Droplets}
            onChange={handleMistingChange}
            description="Each hub ≈ 0.15°C local cooling · Smart IoT activation above 32°C"
            marks={['0 Hubs', '10', '20 Max']}
          />
        </div>

        {/* Real-time ROI & Physics Impact Output */}
        <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px', height: 'fit-content' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Gauge size={18} color="#00f2fe" />
              Simulated Physics & Economic Return (ROI)
            </h3>
            <span style={{ fontSize: '0.65rem', fontWeight: 600, color: '#10b981', background: 'rgba(16, 185, 129, 0.15)', padding: '3px 8px', borderRadius: '6px', textTransform: 'uppercase' }}>
              Live Physics
            </span>
          </div>

          {/* Primary Result */}
          <ResultCard
            size="large"
            label="Mitigated Ambient Temperature"
            value={simResult.mitigatedTemperatureC}
            unit="°C"
            color="#10b981"
            icon={Thermometer}
            trend={`${simResult.totalTemperatureDropC}°C drop`}
            description={`Baseline: ${simResult.baseTemperatureC}°C → Net cooling: ${simResult.totalTemperatureDropC}°C`}
          />

          {/* Cooling Breakdown */}
          <div className="glass-panel" style={{ padding: '16px', border: '1px solid rgba(0, 242, 254, 0.15)', background: 'rgba(0, 242, 254, 0.03)' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#00f2fe', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Zap size={14} /> Cooling Breakdown by Intervention
            </div>
            <BreakdownBar
              label="Tree Canopy Evapotranspiration"
              value={simResult.breakdown.treeCanopyCoolingC}
              total={simResult.totalTemperatureDropC}
              color="#10b981"
              unit="°C"
              icon={Trees}
            />
            <BreakdownBar
              label="Cool Roof Albedo Reflectance"
              value={simResult.breakdown.coolRoofCoolingC}
              total={simResult.totalTemperatureDropC}
              color="#38bdf8"
              unit="°C"
              icon={Sparkles}
            />
            <BreakdownBar
              label="Misting Hub Evaporative Cooling"
              value={simResult.breakdown.mistingHubsCoolingC}
              total={simResult.totalTemperatureDropC}
              color="#00f2fe"
              unit="°C"
              icon={Droplets}
            />
          </div>

          {/* Economic & Health ROI Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
            <ResultCard
              label="Annual Power Savings"
              value={simResult.economicAndHealthROI.annualPowerSavingsUSD.toLocaleString()}
              unit="USD/yr"
              color="#10b981"
              icon={DollarSign}
              trend={`${simResult.economicAndHealthROI.energySavingsPercent}% load reduction`}
              description="Peak demand shaving via pre-cooling"
              prefix="$"
            />
            <ResultCard
              label="Avoided ER Visits"
              value={simResult.economicAndHealthROI.avoidedHospitalizations}
              unit="/ yr"
              color="#ef4444"
              icon={HeartPulse}
              description="Heatstroke & dehydration prevention"
            />
            <ResultCard
              label="Carbon Offset"
              value={simResult.economicAndHealthROI.co2OffsetTons.toLocaleString()}
              unit="Tons CO₂/yr"
              color="#38bdf8"
              icon={Leaf}
              description="Grid emission reduction from HVAC efficiency"
            />
            <ResultCard
              label="Capital Payback"
              value={simResult.economicAndHealthROI.roiPaybackYears}
              unit="Years"
              color="#f59e0b"
              icon={ShieldCheck}
              description="Break-even on canopy/roof investment"
            />
          </div>

          {/* Policy Brief */}
          <div className="glass-panel" style={{ 
            padding: '16px',
            background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.08), rgba(0, 242, 254, 0.06))',
            border: '1px solid rgba(168, 85, 247, 0.2)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <Sparkles size={16} color="#a855f7" />
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#a855f7', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Policy Brief</span>
            </div>
            <p style={{ fontSize: '0.8rem', color: '#c4b5fd', lineHeight: 1.6, margin: 0 }}>
              A <strong style={{ color: '#f8fafc' }}>+{treeCanopyDelta}% tree canopy</strong> and <strong style={{ color: '#f8fafc' }}>{coolRoofCoverage}% cool-roof</strong> mandate would cool <strong style={{ color: '#f8fafc' }}>{selectedCity.name}</strong> by <strong style={{ color: '#10b981' }}>{simResult.totalTemperatureDropC}°C</strong>, saving <strong style={{ color: '#10b981' }}>${simResult.economicAndHealthROI.annualPowerSavingsUSD.toLocaleString()}</strong>/yr in HVAC energy, avoiding <strong style={{ color: '#ef4444' }}>{simResult.economicAndHealthROI.avoidedHospitalizations}</strong> heat emergencies, and offsetting <strong style={{ color: '#38bdf8' }}>{simResult.economicAndHealthROI.co2OffsetTons.toLocaleString()}</strong> tons CO₂ annually. Payback: <strong style={{ color: '#f59e0b' }}>{simResult.economicAndHealthROI.roiPaybackYears}</strong> years.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}