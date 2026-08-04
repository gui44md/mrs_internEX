import { useMemo, useState } from 'react'
import StatusBadge from './StatusBadge'
import { Thermometer } from 'lucide-react'

const FILTERS = ['Todos', 'Crítico', 'Atenção', 'Operacional', 'Manutenção']

export default function SubstationTable({ substations, selectedId, onSelect }) {
  const [filter, setFilter] = useState('Todos')

  const rows = useMemo(() => {
    const filtered =
      filter === 'Todos' ? substations : substations.filter((s) => s.status === filter)
    return [...filtered].sort((a, b) => b.score - a.score)
  }, [substations, filter])

  return (
    <div className="rounded-xl border border-rail-border bg-rail-800/60 p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-sm font-semibold tracking-tight text-white">
          Frota de subestações
        </h2>
        <div className="flex flex-wrap gap-1.5">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-full border px-3 py-1 text-[11px] font-mono transition ${
                filter === f
                  ? 'border-tangerine/50 bg-tangerine/15 text-tangerine'
                  : 'border-rail-border text-white/50 hover:text-white'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[880px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-rail-border text-left text-[11px] uppercase tracking-wider text-white/40">
              <th className="py-2 pr-3">Ativo</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2 text-right">Temp.</th>
              <th className="px-3 py-2 text-right">Consumo</th>
              <th className="px-3 py-2 text-right">Disponib.</th>
              <th className="px-3 py-2 text-right">Falhas 90d</th>
              <th className="px-3 py-2 text-right">MTTR</th>
              <th className="px-3 py-2 text-right">MTBF</th>
              <th className="px-3 py-2 text-right">Alarmes</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((se) => (
              <tr
                key={se.id}
                onClick={() => onSelect(se.id)}
                className={`cursor-pointer border-b border-rail-border/60 transition hover:bg-white/[0.03] ${
                  selectedId === se.id ? 'bg-tangerine/[0.06]' : ''
                }`}
              >
                <td className="py-2.5 pr-3">
                  <p className="font-medium text-white">{se.name}</p>
                  <p className="font-mono text-[11px] text-white/40">
                    {se.id} · {se.uf}
                  </p>
                </td>
                <td className="px-3 py-2.5">
                  <StatusBadge status={se.status} />
                </td>
                <td className="px-3 py-2.5 text-right font-mono">
                  <span
                    className={`inline-flex items-center gap-1 ${
                      se.temperature >= 78 ? 'text-critical' : 'text-white/75'
                    }`}
                  >
                    <Thermometer size={12} />
                    {se.temperature}°C
                  </span>
                </td>
                <td className="px-3 py-2.5 text-right font-mono text-white/75">
                  {se.consumptionMW} MW
                </td>
                <td className="px-3 py-2.5 text-right font-mono">
                  <span className={se.availability < 97 ? 'text-tangerine' : 'text-white/75'}>
                    {se.availability}%
                  </span>
                </td>
                <td className="px-3 py-2.5 text-right font-mono text-white/75">{se.failures90d}</td>
                <td className="px-3 py-2.5 text-right font-mono text-white/75">{se.mttrHours}h</td>
                <td className="px-3 py-2.5 text-right font-mono text-white/75">{se.mtbfHours}h</td>
                <td className="px-3 py-2.5 text-right font-mono">
                  <span className={se.alarms.length > 0 ? 'text-critical' : 'text-white/30'}>
                    {se.alarms.length}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
