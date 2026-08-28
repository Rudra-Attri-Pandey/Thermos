import React, { useState, useMemo } from 'react';
import { Building2, Zap, DollarSign, ArrowDownRight, Clock, ShieldCheck, Thermometer, TrendingDown, Battery, Gauge, Leaf, Clock as ClockIcon } from 'lucide-react';

const KPICard = ({ label, value, unit, color, icon, trend, description, prefix = '' }) => (
  <div className="glass-panel glass-panel-interactive" style={{
    padding: '16px',
    border: `1px solid ${color}33`,
    background: `linear-gradient(135deg, ${color}0d, ${color}06)`,
    position: 'relative',
    overflow: 'hidden'
  }}>
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: `linear-gradient(90deg, transparent, ${color}, transparent)` }} />
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
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
        <div style={{ fontSize: '0.62rem', fontWeight: 600, color, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {label}
        </div>
        <div style={{ fontSize: '0.7rem', color: '#64748b' }}>{description}</div>
      </div>
    </div>
    <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
      {prefix && <span style={{ fontSize: '1.1rem', fontWeight: 700, color }}>{prefix}</span>}
      <span style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f8fafc', fontFamily: 'var(--font-mono)' }}>
        {value}
      </span>
      {unit && <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 500 }}>{unit}</span>}
      {trend && (
        <span style={{ fontSize: '0.7rem', fontWeight: 600, color: '#10b981', display: 'flex', alignItems: 'center', gap: '2px', marginLeft: '8px' }}>
          <TrendingDown size={10} />
          {trend}
        </span>
      )}
    </div>
  </div>
);

export default function GridCool({ selectedCity, envParams }) {
  const [buildingType, setBuildingType] = useState('commercial');
  const [squareFootage, setSquareFootage] = useState(150000);

  // Energy & HVAC Economics
  const peakTemp = selectedCity.baseTempC + 4.5;
  const offPeakTariff = 0.08; // $/kWh
  const onPeakTariff = 0.28; // $/kWh (Peak 2 PM - 6 PM)
  
  // Power savings with pre-cooling
  const baseKWhMonthly = Math.round((squareFootage * 1.8 * (peakTemp / 30)));
  const costWithoutGridCool = Math.round(baseKWhMonthly * onPeakTariff);
  const costWithGridCool = Math.round(baseKWhMonthly * (offPeakTariff * 0.7 + onPeakTariff * 0.3));
  const monthlySavingsUSD = costWithoutGridCool - costWithGridCool;
  const annualSavings = monthlySavingsUSD * 12;
  const co2Avoided = Math.round(annualSavings / 0.12 * 0.45); // rough kg CO2 per $ saved

  // 12-Hour Thermal Load Prediction Curve
  const hourlyData = useMemo(() => [
    { hour: '08:00', temp: selectedCity.baseTempC - 6, loadKW: 180, tariff: 'Off-Peak ($0.08)', action: 'normal' },
    { hour: '10:00', temp: selectedCity.baseTempC - 3, loadKW: 260, tariff: 'Off-Peak ($0.08)', action: 'precool' },
    { hour: '12:00', temp: selectedCity.baseTempC + 1, loadKW: 420, tariff: 'Mid-Peak ($0.16)', action: 'precool' },
    { hour: '14:00', temp: selectedCity.baseTempC + 3.8, loadKW: 590, tariff: 'Peak Tariff ($0.28)', action: 'coast' },
    { hour: '16:00', temp: selectedCity.baseTempC + 4.5, loadKW: 640, tariff: 'Peak Tariff ($0.28)', action: 'coast' },
    { hour: '18:00', temp: selectedCity.baseTempC + 2.0, loadKW: 480, tariff: 'Peak Tariff ($0.28)', action: 'coast' },
    { hour: '20:00', temp: selectedCity.baseTempC - 2.5, loadKW: 290, tariff: 'Off-Peak ($0.08)', action: 'normal' }
  ], [selectedCity]);

  const tariffColors = {
    'Off-Peak ($0.08)': '#10b981',
    'Mid-Peak ($0.16)': '#f59e0b',
    'Peak Tariff ($0.28)': '#ef4444'
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Hero Banner */}
      <div className="glass-panel" style={{ 
        padding: '20px 24px', 
        borderLeft: '4px solid #f59e0b',
        background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.08), rgba(249, 115, 22, 0.06))',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg, transparent, #f59e0b, #fb923c, transparent)' }} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ flex: 1, minWidth: '240px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #f59e0b, #fb923c)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 16px rgba(245, 158, 11, 0.4)'
              }}>
                <Building2 size={18} color="#05080f" strokeWidth={2.5} />
              </div>
              <div>
                <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#f8fafc', margin: 0, letterSpacing: '-0.02em' }}>
                  Track 02: GridCool — Building HVAC & Microclimate Energy Advisor
                </h2>
                <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: '2px 0 0 0' }}>
                  Predicts building microclimate thermal spikes and automates pre-cooling to bypass peak utility tariffs.
                </p>
              </div>
            </div>
          </div>
          <div style={{ textAlign: 'right', minWidth: '180px' }}>
            <div style={{ 
              padding: '12px 16px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15), rgba(249, 115, 22, 0.1))',
              border: '1px solid rgba(245, 158, 11, 0.3)'
            }}>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'flex-end', gap: '4px', marginBottom: '4px' }}>
                <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Cost Reduction</span>
                <span style={{ fontSize: '1.6rem', fontWeight: 800, color: '#f59e0b', fontFamily: 'var(--font-mono)' }}>{Math.round((monthlySavingsUSD / costWithoutGridCool) * 100)}%</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'flex-end', gap: '4px', marginTop: '4px' }}>
                <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#00f2fe', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Monthly Savings</span>
                <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#00f2fe', fontFamily: 'var(--font-mono)' }}>${monthlySavingsUSD.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
        <KPICard
          label="Estimated Monthly Savings"
          value={monthlySavingsUSD.toLocaleString()}
          unit="USD"
          color="#10b981"
          icon={DollarSign}
          trend={Math.round((monthlySavingsUSD / costWithoutGridCool) * 100) + '% vs baseline'}
          description="vs unoptimized peak-rate cooling"
          prefix="$"
        />
        <KPICard
          label="Autonomous Pre-Cool Window"
          value="10:30–12:45"
          unit=""
          color="#00f2fe"
          icon={ClockIcon}
          trend="2.25 hrs"
          description="Chill to 20.5°C before $0.28/kWh peak"
        />
        <KPICard
          label="Avoided Peak Grid Strain"
          value={Math.round(baseKWhMonthly * 0.28 / 720 * 1.5)} // rough kW reduction
          unit="kW"
          color="#f59e0b"
          icon={Zap}
          trend="Zero brownout risk"
          description="Substation load shedding avoided"
        />
        <KPICard
          label="Annual CO₂ Avoided"
          value={co2Avoided.toLocaleString()}
          unit="kg"
          color="#10b981"
          icon={Leaf}
          trend={Math.round(co2Avoided / 1000 * 100) / 100 + ' tons/yr'}
          description="Equivalent grid emission reduction"
        />
      </div>

      {/* Building Configuration */}
      <div className="glass-panel" style={{ padding: '16px', display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'flex-end' }}>
        <div style={{ flex: 1, minWidth: '200px' }}>
          <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 600, color: '#94a3b8', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Building Type
          </label>
          <select 
            value={buildingType} 
            onChange={(e) => setBuildingType(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 12px',
              background: 'rgba(15, 23, 42, 0.8)',
              border: '1px solid var(--border-glass)',
              borderRadius: '8px',
              color: '#f8fafc',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
              outline: 'none'
            }}
          >
            <option value="commercial" style={{ background: '#0b1324' }}>Commercial Office</option>
            <option value="retail" style={{ background: '#0b1324' }}>Retail / Mall</option>
            <option value="industrial" style={{ background: '#0b1324' }}>Industrial / Warehouse</option>
            <option value="hospital" style={{ background: '#0b1324' }}>Hospital / Healthcare</option>
            <option value="datacenter" style={{ background: '#0b1324' }}>Data Center</option>
          </select>
        </div>
        <div style={{ flex: 1, minWidth: '200px' }}>
          <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 600, color: '#94a3b8', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Floor Area (sq ft)
          </label>
          <input
            type="number"
            value={squareFootage}
            onChange={(e) => setSquareFootage(Math.max(1000, Number(e.target.value)))}
            min={1000}
            max={1000000}
            step={1000}
            style={{
              width: '100%',
              padding: '10px 12px',
              background: 'rgba(15, 23, 42, 0.8)',
              border: '1px solid var(--border-glass)',
              borderRadius: '8px',
              color: '#f8fafc',
              fontSize: '0.85rem',
              fontWeight: 600,
              fontFamily: 'var(--font-mono)',
              outline: 'none'
            }}
          />
        </div>
      </div>

      {/* 12-Hour Microclimate Thermal Load Schedule */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Thermometer size={18} color="#f59e0b" />
            12-Hour Forecast & Autonomous HVAC Dispatch Schedule
          </h3>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {Object.entries(tariffColors).map(([tariff, color]) => (
              <span key={tariff} style={{ 
                fontSize: '0.65rem', 
                fontWeight: 600, 
                padding: '4px 10px', 
                borderRadius: '6px', 
                background: color + '22', 
                color,
                border: color + '44',
                textTransform: 'uppercase'
              }}>
                {tariff}
              </span>
            ))}
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-glass)', color: '#94a3b8' }}>
                <th style={{ padding: '10px 12px', textAlign: 'left' }}>Time</th>
                <th style={{ padding: '10px 12px', textAlign: 'left' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Thermometer size={14} color="#f59e0b" />
                    Predicted Ambient
                  </div>
                </th>
                <th style={{ padding: '10px 12px', textAlign: 'left' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Battery size={14} color="#00f2fe" />
                    HVAC Load
                  </div>
                </th>
                <th style={{ padding: '10px 12px', textAlign: 'left' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <DollarSign size={14} color="#f59e0b" />
                    Electricity Tariff
                  </div>
                </th>
                <th style={{ padding: '10px 12px', textAlign: 'left' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Gauge size={14} color="#00f2fe" />
                    Thermos AI Action
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {hourlyData.map((row, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', transition: 'background 0.2s' }}>
                  <td style={{ padding: '12px', fontWeight: 700, fontFamily: 'var(--font-mono)', color: '#f8fafc' }}>{row.hour}</td>
                  <td style={{ padding: '12px', color: row.temp > 40 ? '#ef4444' : row.temp > 35 ? '#f59e0b' : '#10b981', fontWeight: 600 }}>
                    <span style={{ fontFamily: 'var(--font-mono)' }}>{row.temp.toFixed(1)}°C</span>
                  </td>
                  <td style={{ padding: '12px', fontFamily: 'var(--font-mono)', fontWeight: 600, color: '#00f2fe' }}>{row.loadKW} kW</td>
                  <td style={{ padding: '12px' }}>
                    <span style={{ 
                      padding: '4px 10px', 
                      borderRadius: '6px', 
                      background: tariffColors[row.tariff] + '22', 
                      color: tariffColors[row.tariff],
                      border: tariffColors[row.tariff] + '44',
                      fontSize: '0.7rem',
                      fontWeight: 600,
                      fontFamily: 'var(--font-mono)'
                    }}>
                      {row.tariff}
                    </span>
                  </td>
                  <td style={{ padding: '12px' }}>
                    {row.action === 'precool' ? (
                      <span style={{ 
                        padding: '4px 12px', 
                        borderRadius: '6px', 
                        background: 'rgba(0, 242, 254, 0.18)', 
                        color: '#00f2fe', 
                        fontWeight: 700, 
                        fontSize: '0.7rem',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        border: '1px solid rgba(0, 242, 254, 0.4)'
                      }}>
                        <Zap size={12} /> ⚡ Pre-Cool Active
                      </span>
                    ) : row.action === 'coast' ? (
                      <span style={{ 
                        padding: '4px 12px', 
                        borderRadius: '6px', 
                        background: 'rgba(16, 185, 129, 0.18)', 
                        color: '#10b981', 
                        fontWeight: 700, 
                        fontSize: '0.7rem',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        border: '1px solid rgba(16, 185, 129, 0.4)'
                      }}>
                        <ShieldCheck size={12} /> 🛡️ Thermal Coasting
                      </span>
                    ) : (
                      <span style={{ 
                        color: '#64748b', 
                        fontSize: '0.75rem',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        <Gauge size={12} color="#64748b" /> Normal Modulation
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary */}
        <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border-glass)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
          <div style={{ textAlign: 'center', padding: '12px', background: 'rgba(0, 242, 254, 0.08)', borderRadius: '10px', border: '1px solid rgba(0, 242, 254, 0.2)' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#00f2fe', fontFamily: 'var(--font-mono)' }}>{monthlySavingsUSD.toLocaleString()}</div>
            <div style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase' }}>Monthly Savings</div>
          </div>
          <div style={{ textAlign: 'center', padding: '12px', background: 'rgba(16, 185, 129, 0.08)', borderRadius: '10px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#10b981', fontFamily: 'var(--font-mono)' }}>{annualSavings.toLocaleString()}</div>
            <div style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase' }}>Annual Savings</div>
          </div>
          <div style={{ textAlign: 'center', padding: '12px', background: 'rgba(245, 158, 11, 0.08)', borderRadius: '10px', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f59e0b', fontFamily: 'var(--font-mono)' }}>{co2Avoided.toLocaleString()} kg</div>
            <div style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase' }}>CO₂ Avoided / yr</div>
          </div>
          <div style={{ textAlign: 'center', padding: '12px', background: 'rgba(249, 115, 22, 0.08)', borderRadius: '10px', border: '1px solid rgba(249, 115, 22, 0.2)' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f97316', fontFamily: 'var(--font-mono)' }}>{Math.round((costWithoutGridCool - costWithGridCool) / costWithoutGridCool * 100)}%</div>
            <div style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase' }}>Peak Cost Reduction</div>
          </div>
        </div>
      </div>
    </div>
  );
}