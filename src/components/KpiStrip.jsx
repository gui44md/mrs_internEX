import { Gauge, Siren, Timer, TrendingUp, AlertTriangle } from 'lucide-react'
import { FLEET_TARGETS } from '../data/substations'

function Kpi({ icon: Icon, label, value, unit, hint, accent }) {
  return (
    <div className="flex-1 rounded-xl border border-rail-border bg-rail-800/60 p-4 min-w-[160px]">
      <div className="flex items-center gap-2 text-white/50">
        <Icon size={14} />
        <span className="text-[11px] uppercase tracking-wider">{label}</span>
      </div>
      <div className="mt-2 flex items-baseline gap-1">
        <span className={`font-display font-mono text-2xl font-semibold ${accent || 'text-white'}`}>
          {value}
        </span>
        {unit && <span className="text-sm text-white/40">{unit}</span>}
      </div>
      {hint && <p className="mt-1 text-[11px] text-white/40">{hint}</p>}
    </div>
  )
}

export default function KpiStrip({ substations }) {
  const active = substations.filter((s) => s.status !== 'Manutenção')
  const avgAvailability = (
    active.reduce((sum, s) => sum + s.availability, 0) / active.length
  ).toFixed(2)
  const totalAlarms = substations.reduce((sum, s) => sum + s.alarms.length, 0)
  const avgMttr = (active.reduce((sum, s) => sum + s.mttrHours, 0) / active.length).toFixed(1)
  const avgMtbf = Math.round(active.reduce((sum, s) => sum + s.mtbfHours, 0) / active.length)
  const criticalCount = substations.filter((s) => s.status === 'Crítico').length

  return (
    <div className="flex flex-wrap gap-3">
      <Kpi
        icon={Gauge}
        label="Disponibilidade média"
        value={avgAvailability}
        unit="%"
        hint={`Meta: ${FLEET_TARGETS.availability}%`}
        accent={avgAvailability < FLEET_TARGETS.availability ? 'text-tangerine' : 'text-ok'}
      />
      <Kpi
        icon={Siren}
        label="Alarmes ativos"
        value={totalAlarms}
        hint="Nas últimas 24h, malha completa"
        accent={totalAlarms > 10 ? 'text-critical' : 'text-white'}
      />
      <Kpi
        icon={AlertTriangle}
        label="Ativos críticos"
        value={criticalCount}
        unit={`/ ${substations.length}`}
        hint="Requerem intervenção imediata"
        accent={criticalCount > 0 ? 'text-critical' : 'text-ok'}
      />
      <Kpi
        icon={Timer}
        label="MTTR médio"
        value={avgMttr}
        unit="h"
        hint={`Meta: < ${FLEET_TARGETS.mttrHours}h`}
        accent={avgMttr > FLEET_TARGETS.mttrHours ? 'text-tangerine' : 'text-ok'}
      />
      <Kpi
        icon={TrendingUp}
        label="MTBF médio"
        value={avgMtbf}
        unit="h"
        hint={`Meta: > ${FLEET_TARGETS.mtbfHours}h`}
        accent={avgMtbf < FLEET_TARGETS.mtbfHours ? 'text-tangerine' : 'text-ok'}
      />
    </div>
  )
}
