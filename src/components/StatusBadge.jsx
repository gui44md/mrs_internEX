const STYLES = {
  Operacional: 'bg-ok/15 text-ok border-ok/40',
  Atenção: 'bg-tangerine/15 text-tangerine border-tangerine/40',
  Crítico: 'bg-critical/15 text-critical border-critical/50',
  Manutenção: 'bg-maint/15 text-maint border-maint/40',
}

const DOT = {
  Operacional: 'bg-ok',
  Atenção: 'bg-tangerine',
  Crítico: 'bg-critical',
  Manutenção: 'bg-maint',
}

export default function StatusBadge({ status, className = '' }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-mono font-medium tracking-wide ${STYLES[status]} ${className}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${DOT[status]}`} />
      {status.toUpperCase()}
    </span>
  )
}
