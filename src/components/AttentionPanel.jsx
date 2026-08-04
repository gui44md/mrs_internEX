import { AlertOctagon, FileDown } from 'lucide-react'
import StatusBadge from './StatusBadge'
import { attentionReasons } from '../data/substations'
import { exportAttentionReportPdf } from '../utils/pdfExport'

export default function AttentionPanel({ substations, selectedId, onSelect }) {
  const ranked = [...substations]
    .filter((s) => s.status !== 'Manutenção')
    .sort((a, b) => b.score - a.score)
    .slice(0, 6)

  return (
    <div className="rounded-xl border border-tangerine/25 bg-rail-800/60 p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-tangerine">
            <AlertOctagon size={16} />
            <h2 className="font-display text-sm font-semibold tracking-tight">
              Quais ativos precisam de atenção?
            </h2>
          </div>
          <p className="mt-1 text-xs text-white/40">
            Ranking por score de risco — combina disponibilidade, alarmes, MTTR, MTBF e temperatura.
          </p>
        </div>
        <button
          onClick={() => exportAttentionReportPdf(substations)}
          className="flex shrink-0 items-center gap-1.5 rounded-lg border border-tangerine/40 bg-tangerine/10 px-3 py-1.5 text-xs font-medium text-tangerine transition hover:bg-tangerine/20"
        >
          <FileDown size={13} />
          Exportar PDF
        </button>
      </div>

      <ol className="mt-4 flex flex-col gap-2">
        {ranked.map((se, i) => (
          <li key={se.id}>
            <button
              onClick={() => onSelect(se.id)}
              className={`w-full rounded-lg border px-3 py-2.5 text-left transition ${
                selectedId === se.id
                  ? 'border-tangerine/50 bg-tangerine/10'
                  : 'border-rail-border bg-rail-900/40 hover:border-tangerine/30'
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-xs text-white/30">#{i + 1}</span>
                  <div>
                    <p className="text-sm font-medium text-white">{se.name}</p>
                    <p className="font-mono text-[11px] text-white/40">{se.id}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-white/50">score {se.score}</span>
                  <StatusBadge status={se.status} />
                </div>
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {attentionReasons(se).map((r) => (
                  <span
                    key={r}
                    className="rounded border border-rail-border bg-rail-950/60 px-1.5 py-0.5 text-[10.5px] text-white/55"
                  >
                    {r}
                  </span>
                ))}
              </div>
            </button>
          </li>
        ))}
      </ol>
    </div>
  )
}
