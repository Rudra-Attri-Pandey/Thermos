import React, { useState, useEffect, useMemo } from 'react';
import { HardHat, ShieldAlert, HeartPulse, Droplet, Clock, Radio, Truck, AlertTriangle, Users, Stethoscope, Wifi, AlertCircle, CheckCircle2, Activity } from 'lucide-react';

const TelemetryCard = ({ worker }) => {
  const isCritical = worker.heartRate > 120 || worker.coreTempEst > 38.5;
  const isWarning = worker.heartRate > 105 || worker.coreTempEst > 38.0;
  
  return (
    <div className="glass-panel glass-panel-interactive" style={{
      padding: '16px',
      border: `1px solid ${isCritical ? '#ef4444' : isWarning ? '#f59e0b' : '#10b981'}33`,
      background: `linear-gradient(135deg, ${isCritical ? '#ef4444' : isWarning ? '#f59e0b' : '#10b981'}0d, ${isCritical ? '#ef4444' : isWarning ? '#f59e0b' : '#10b981'}06)`
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#f8fafc', fontFamily: 'var(--font-mono)' }}>
              {worker.id}
            </span>
            <span style={{ 
              fontSize: '0.6rem', 
              fontWeight: 700, 
              padding: '2px 6px', 
              borderRadius: '4px', 
              background: worker.status.includes('CRITICAL') ? 'rgba(239,68,68,0.2)' : worker.status.includes('ACTIVE') ? 'rgba(0,242,254,0.2)' : 'rgba(16,185,129,0.2)',
              color: worker.status.includes('CRITICAL') ? '#ef4444' : worker.status.includes('ACTIVE') ? '#00f2fe' : '#10b981',
              border: `1px solid ${worker.status.includes('CRITICAL') ? '#ef4444' : worker.status.includes('ACTIVE') ? '#00f2fe' : '#10b981'}44`,
              textTransform: 'uppercase'
            }}>
              {worker.status}
            </span>
          </div>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Activity size={14} color={worker.heartRate > 110 ? '#ef4444' : '#10b981'} />
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: worker.heartRate > 110 ? '#ef4444' : '#f8fafc', fontFamily: 'var(--font-mono)' }}>
                ❤️ {worker.heartRate} bpm
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Stethoscope size={14} color={worker.coreTempEst > 38.0 ? '#ef4444' : '#10b981'} />
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: worker.coreTempEst > 38.0 ? '#ef4444' : '#f8fafc', fontFamily: 'var(--font-mono)' }}>
                Core: {worker.coreTempEst}°C
              </span>
            </div>
          </div>
        </div>
        <div style={{ 
          marginTop: '8px', 
          padding: '6px 10px', 
          borderRadius: '6px', 
          background: worker.status.includes('CRITICAL') ? 'rgba(239,68,68,0.15)' : worker.status.includes('ACTIVE') ? 'rgba(0,242,254,0.1)' : 'rgba(16,185,129,0.1)',
          color: worker.status.includes('CRITICAL') ? '#ef4444' : worker.status.includes('ACTIVE') ? '#00f2fe' : '#10b981',
          fontWeight: 700,
          fontSize: '0.7rem',
          textAlign: 'center',
          border: `1px solid ${worker.status.includes('CRITICAL') ? '#ef4444' : worker.status.includes('ACTIVE') ? '#00f2fe' : '#10b981'}44`
        }}>
          {worker.status.includes('CRITICAL') && <AlertTriangle size={12} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />}
          {worker.status.includes('ACTIVE') && <Wifi size={12} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />}
          Action: {worker.status}
        </div>
      </div>
    </div>
  );
};

export default function ThermoSafe({ selectedCity, envParams }) {
  const [workerCount, setWorkerCount] = useState(48);
  const [workIntensity, setWorkIntensity] = useState('heavy');

  const tempC = envParams?.temperature_celsius || selectedCity.baseTempC;
  const wetBulb = envParams?.wet_bulb_temperature_celsius || 29.4;
  const heatIndex = envParams?.apparent_temperature_celsius || (tempC + 3.5);

  // OSHA Heat Standard Rest Cycle Calculation
  let workRestRatio = '50 min Work / 10 min Rest';
  let waterLitersPerHour = '0.75 L / hr';
  let hazardLevel = 'MODERATE';
  let hazardColor = '#f59e0b';
  let oshaPhase = 'Caution';

  if (wetBulb >= 31 || tempC >= 42) {
    workRestRatio = '15 min Work / 45 min Shaded Rest';
    waterLitersPerHour = '1.5 L / hr';
    hazardLevel = 'EXTREME DANGER (HEATSTROKE IMMINENT)';
    hazardColor = '#dc2626';
    oshaPhase = 'Extreme Danger';
  } else if (wetBulb >= 28 || tempC >= 38) {
    workRestRatio = '30 min Work / 30 min Shaded Rest';
    waterLitersPerHour = '1.0 L / hr';
    hazardLevel = 'HIGH HAZARD (OSHA REST MANDATORY)';
    hazardColor = '#ef4444';
    oshaPhase = 'High Hazard';
  } else if (wetBulb >= 25 || tempC >= 34) {
    workRestRatio = '45 min Work / 15 min Shaded Rest';
    waterLitersPerHour = '1.0 L / hr';
    hazardLevel = 'MODERATE HAZARD (ACCLIMATIZATION REQUIRED)';
    hazardColor = '#f59e0b';
    oshaPhase = 'Moderate Hazard';
  }

  // Simulated Virtual Wearable IoT Telemetry
  const [telemetry, setTelemetry] = useState([
    { id: 'WRK-104 (Roofing)', heartRate: 118, coreTempEst: 38.2, status: 'REST_ORDER_DISPATCHED' },
    { id: 'WRK-209 (Gig Courier)', heartRate: 104, coreTempEst: 37.6, status: 'SHADED_ROUTE_ACTIVE' },
    { id: 'WRK-315 (Asphalt Paving)', heartRate: 126, coreTempEst: 38.6, status: 'CRITICAL_ALERT_PULLED' },
    { id: 'WRK-402 (Logistics Loading)', heartRate: 92, coreTempEst: 37.1, status: 'HYDRATION_OK' }
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTelemetry(prev => prev.map(t => ({
        ...t,
        heartRate: Math.max(60, Math.min(140, Math.round(t.heartRate + (Math.random() * 6 - 3))))
      })));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const vitals = useMemo(() => ({
    tempC,
    wetBulb,
    heatIndex,
    hazardLevel,
    hazardColor,
    oshaPhase,
    workRestRatio,
    waterLitersPerHour
  }), [tempC, wetBulb, heatIndex]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Hero Banner */}
      <div className="glass-panel" style={{ 
        padding: '20px 24px', 
        borderLeft: '4px solid #ef4444',
        background: `linear-gradient(135deg, ${hazardColor}0d, ${hazardColor}06)`,
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: `linear-gradient(90deg, transparent, ${hazardColor}, ${hazardColor}88, transparent)` }} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ flex: 1, minWidth: '240px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: `linear-gradient(135deg, ${hazardColor}, ${hazardColor}cc)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: `0 0 16px ${hazardColor}66`
              }}>
                <HardHat size={18} color="#05080f" strokeWidth={2.5} />
              </div>
              <div>
                <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#f8fafc', margin: 0, letterSpacing: '-0.02em' }}>
                  Track 03: ThermoSafe — Industrial & Outdoor Workforce Protection
                </h2>
                <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: '2px 0 0 0' }}>
                  Automates OSHA heat-stress rest cycles & live virtual telemetry to prevent heatstroke among outdoor crews.
                </p>
              </div>
            </div>
          </div>
          <div style={{ 
            textAlign: 'right',
            minWidth: '180px',
            padding: '12px 16px',
            borderRadius: '10px',
            background: `${hazardColor}1a`,
            border: `1px solid ${hazardColor}44`
          }}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'flex-end', gap: '4px', marginBottom: '4px' }}>
              <span style={{ fontSize: '0.65rem', fontWeight: 700, color: hazardColor, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                OSHA Phase: {oshaPhase}
              </span>
              <span style={{ fontSize: '1.1rem', fontWeight: 800, color: hazardColor, fontFamily: 'var(--font-mono)' }}>
                {hazardLevel}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* WBGT & Safety Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
        <div className="glass-panel glass-panel-interactive" style={{ 
          padding: '18px',
          border: `1px solid ${hazardColor}33`,
          background: `linear-gradient(135deg, ${hazardColor}0d, ${hazardColor}06)`
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: `${hazardColor}22`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: `1px solid ${hazardColor}44`
            }}>
              <HeartPulse size={20} color={hazardColor} />
            </div>
            <div>
              <div style={{ fontSize: '0.65rem', fontWeight: 600, color: hazardColor, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Wet-Bulb Globe Temperature
              </div>
              <div style={{ fontSize: '0.65rem', color: '#64748b' }}>Human evaporative limit ~35°C</div>
            </div>
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: hazardColor, fontFamily: 'var(--font-mono)' }}>
            {vitals.wetBulb}°C
          </div>
          <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.7rem', color: '#64748b' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: vitals.wetBulb >= 31 ? '#dc2626' : vitals.wetBulb >= 28 ? '#ef4444' : vitals.wetBulb >= 25 ? '#f59e0b' : '#10b981' }} />
              WBGT {vitals.wetBulb >= 31 ? 'Extreme' : vitals.wetBulb >= 28 ? 'High' : vitals.wetBulb >= 25 ? 'Moderate' : 'Low'}
            </span>
            <span>Heat Index: {vitals.heatIndex}°C</span>
          </div>
        </div>

        <div className="glass-panel glass-panel-interactive" style={{ padding: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'rgba(0, 242, 254, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid rgba(0, 242, 254, 0.3)'
            }}>
              <Clock size={20} color="#00f2fe" />
            </div>
            <div>
              <div style={{ fontSize: '0.65rem', fontWeight: 600, color: '#00f2fe', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Automated OSHA Shift Cycle
              </div>
              <div style={{ fontSize: '0.65rem', color: '#64748b' }}>Dispatched to mobile supervisor app</div>
            </div>
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#00f2fe', fontFamily: 'var(--font-mono)' }}>
            {vitals.workRestRatio}
          </div>
          <div style={{ marginTop: '8px', fontSize: '0.7rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <CheckCircle2 size={12} /> Dispatched to mobile supervisor app
          </div>
        </div>

        <div className="glass-panel glass-panel-interactive" style={{ padding: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'rgba(56, 189, 248, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid rgba(56, 189, 248, 0.3)'
            }}>
              <Droplet size={20} color="#38bdf8" />
            </div>
            <div>
              <div style={{ fontSize: '0.65rem', fontWeight: 600, color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Mandatory Hydration Rate
              </div>
              <div style={{ fontSize: '0.65rem', color: '#64748b' }}>Electrolyte packs required on-site</div>
            </div>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#38bdf8', fontFamily: 'var(--font-mono)' }}>
            {vitals.waterLitersPerHour}
          </div>
          <div style={{ marginTop: '8px', fontSize: '0.7rem', color: '#94a3b8' }}>Cool water every 15–20 min during work</div>
        </div>
      </div>

      {/* Virtual IoT Workforce Telemetry */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Radio size={18} color="#00f2fe" className="animate-pulse" />
            Live Virtual IoT Crew Telemetry Stream (Pure Software · Zero Hardware)
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.7rem' }}>
            <span style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', animation: 'pulse-slow 1.5s infinite' }} /> {workerCount} Workers
            </span>
            <span style={{ color: '#00f2fe', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Wifi size={12} /> Zero Hardware Cost
            </span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '12px' }}>
          {telemetry.map((t, i) => (
            <TelemetryCard key={t.id} worker={t} />
          ))}
        </div>

        {/* Compliance counts */}
        {(() => {
          const safeCount = telemetry.filter(t => t.status.includes('OK') || t.status.includes('ACTIVE')).length;
          const elevatedCount = telemetry.filter(t => t.heartRate > 105).length;
          const highTempCount = telemetry.filter(t => t.coreTempEst > 38.0).length;
          const criticalCount = telemetry.filter(t => t.status.includes('CRITICAL')).length;

          return (
            <div style={{ marginTop: '16px', padding: '16px', background: 'rgba(16, 185, 129, 0.08)', borderRadius: '10px', border: '1px solid rgba(16, 185, 129, 0.2)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#10b981', fontFamily: 'var(--font-mono)' }}>{safeCount}</div>
                <div style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase' }}>Safe / Compliant</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f59e0b', fontFamily: 'var(--font-mono)' }}>{elevatedCount}</div>
                <div style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase' }}>Elevated Heart Rate</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ef4444', fontFamily: 'var(--font-mono)' }}>{highTempCount}</div>
                <div style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase' }}>Core Temp &gt; 38°C</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#dc2626', fontFamily: 'var(--font-mono)' }}>{criticalCount}</div>
                <div style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase' }}>Critical Alerts</div>
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
}




