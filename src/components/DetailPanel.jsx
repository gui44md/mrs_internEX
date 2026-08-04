import { X, Thermometer, Zap, Gauge, Timer, TrendingUp, Siren } from 'lucide-react'
import StatusBadge from './StatusBadge'
import { FLEET_TARGETS, attentionReasons } from '../data/substations'

function Meter({ icon: Icon, label, value, unit, pct, tone }) {
  return (
    <div>
      <div className="flex items-center justify-between text-xs text-white/50">
        <span className="flex items-center gap-1.5">
          <Icon size={12} /> {label}
        </span>
        <span className="font-mono text-white/80">
          {value}
          {unit}
        </span>
      </div>
      <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-rail-700">
        <div
          className={`h-full rounded-full ${tone}`}
          style={{ width: `${Math.min(100, Math.max(4, pct))}%` }}
        />
      </div>
    </div>
  )
}

export default function DetailPanel({ substation, onClose }) {
  if (!substation) {
    return (
      <div className="flex h-full min-h-[280px] items-center justify-center rounded-xl border border-dashed border-rail-border bg-rail-800/30 p-6 text-center text-sm text-white/35">
        Selecione um ativo no mapa da linha ou na tabela
        <br />
        para ver o detalhamento operacional.
      </div>
    )
  }

  const se = substation
  const reasons = attentionReasons(se)

  return (
    <div className="rounded-xl border border-rail-border bg-rail-800/60 p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="font-mono text-[11px] text-white/40">{se.id}</p>
          <h2 className="font-display text-lg font-semibold text-white">{se.name}</h2>
          <p className="text-xs text-white/40">Malha {se.uf} · km {se.km}</p>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status={se.status} />
          <button
            onClick={onClose}
            className="rounded-md p-1 text-white/40 hover:bg-white/10 hover:text-white"
            aria-label="Fechar detalhe"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-x-5 gap-y-4">
        <Meter
          icon={Thermometer}
          label="Temperatura"
          value={se.temperature}
          unit="°C"
          pct={(se.temperature / 100) * 100}
          tone={se.temperature >= FLEET_TARGETS.temperature ? 'bg-critical' : 'bg-ok'}
        />
        <Meter
          icon={Zap}
          label="Consumo"
          value={se.consumptionMW}
          unit=" MW"
          pct={(se.consumptionMW / 20) * 100}
          tone="bg-tangerine"
        />
        <Meter
          icon={Gauge}
          label="Disponibilidade"
          value={se.availability}
          unit="%"
          pct={se.availability}
          tone={se.availability < FLEET_TARGETS.availability ? 'bg-tangerine' : 'bg-ok'}
        />
        <Meter
          icon={Timer}
          label="MTTR"
          value={se.mttrHours}
          unit="h"
          pct={(se.mttrHours / 14) * 100}
          tone={se.mttrHours > FLEET_TARGETS.mttrHours ? 'bg-critical' : 'bg-ok'}
        />
        <Meter
          icon={TrendingUp}
          label="MTBF"
          value={se.mtbfHours}
          unit="h"
          pct={(se.mtbfHours / 2200) * 100}
          tone={se.mtbfHours < FLEET_TARGETS.mtbfHours ? 'bg-critical' : 'bg-ok'}
        />
        <Meter
          icon={Siren}
          label="Falhas (90d)"
          value={se.failures90d}
          unit=""
          pct={(se.failures90d / 6) * 100}
          tone={se.failures90d > 2 ? 'bg-critical' : 'bg-ok'}
        />
      </div>

      <div className="mt-5 border-t border-rail-border pt-4">
        <p className="text-[11px] uppercase tracking-wider text-white/40">Alarmes ativos</p>
        {se.alarms.length === 0 ? (
          <p className="mt-1.5 text-sm text-white/40">Nenhum alarme ativo no momento.</p>
        ) : (
          <ul className="mt-2 flex flex-col gap-1.5">
            {se.alarms.map((a) => (
              <li
                key={a}
                className="flex items-center gap-2 rounded-lg border border-critical/25 bg-critical/10 px-2.5 py-1.5 text-xs text-critical"
              >
                <Siren size={12} />
                {a}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-4 border-t border-rail-border pt-4">
        <p className="text-[11px] uppercase tracking-wider text-white/40">
          Por que este ativo está com score {se.score}
        </p>
        <ul className="mt-2 flex flex-col gap-1 text-xs text-white/60">
          {reasons.map((r) => (
            <li key={r}>· {r}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}
