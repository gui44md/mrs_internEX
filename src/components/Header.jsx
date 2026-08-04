import { Activity } from 'lucide-react'

export default function Header({ lastUpdate }) {
  return (
    <header className="border-b border-rail-border bg-rail-900/60 backdrop-blur">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-3 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-navy ring-1 ring-tangerine/30">
            <span className="font-display text-lg font-700 text-tangerine">MRS</span>
          </div>
          <div>
            <h1 className="font-display text-lg font-semibold tracking-tight text-white sm:text-xl">
              Central de Monitoramento de Ativos
            </h1>
            <p className="text-xs text-white/50">
              Corredor ferroviário Minas Gerais · Rio de Janeiro · São Paulo
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 rounded-full border border-ok/30 bg-ok/10 px-3 py-1.5 text-xs font-mono text-ok">
            <Activity size={13} className="animate-pulse" />
            SCADA online
          </div>
          <div className="text-right">
            <p className="text-[11px] uppercase tracking-wider text-white/40">Última leitura</p>
            <p className="font-mono text-sm text-white/80">{lastUpdate}</p>
          </div>
        </div>
      </div>
    </header>
  )
}
