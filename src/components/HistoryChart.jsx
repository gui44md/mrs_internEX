import { useMemo, useState } from 'react'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts'
import { LineChart as LineChartIcon } from 'lucide-react'
import { generateHistory } from '../data/substations'

const RANGE_OPTIONS = [
  { label: '24h', hours: 24 },
  { label: '7d', hours: 24 * 7 },
]

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-rail-border bg-rail-950/95 px-3 py-2 text-xs shadow-lg">
      <p className="font-mono text-white/50">{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} className="font-mono" style={{ color: p.color }}>
          {p.name}: {p.value}
          {p.dataKey === 'temperature' ? '°C' : ' MW'}
        </p>
      ))}
    </div>
  )
}

export default function HistoryChart({ substation }) {
  const [rangeIdx, setRangeIdx] = useState(0)
  const hours = RANGE_OPTIONS[rangeIdx].hours

  // para o range de 7 dias, amostra 1 ponto a cada 4h para manter o gráfico legível
  const data = useMemo(() => {
    const full = generateHistory(substation, hours)
    return hours > 24 ? full.filter((_, i) => i % 4 === 0) : full
  }, [substation, hours])

  return (
    <div className="rounded-xl border border-rail-border bg-rail-800/60 p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-white/70">
          <LineChartIcon size={15} />
          <h2 className="font-display text-sm font-semibold tracking-tight text-white">
            Histórico de temperatura e consumo
          </h2>
        </div>
        <div className="flex gap-1.5">
          {RANGE_OPTIONS.map((opt, i) => (
            <button
              key={opt.label}
              onClick={() => setRangeIdx(i)}
              className={`rounded-full border px-3 py-1 text-[11px] font-mono transition ${
                rangeIdx === i
                  ? 'border-tangerine/50 bg-tangerine/15 text-tangerine'
                  : 'border-rail-border text-white/50 hover:text-white'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 h-[220px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 4, right: 12, left: -12, bottom: 0 }}>
            <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
            <XAxis
              dataKey="time"
              tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }}
              axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
              tickLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              yAxisId="temp"
              tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              width={34}
            />
            <YAxis
              yAxisId="consumo"
              orientation="right"
              tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              width={34}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              yAxisId="temp"
              type="monotone"
              dataKey="temperature"
              name="Temperatura"
              stroke="#FFCF00"
              strokeWidth={2}
              dot={false}
            />
            <Line
              yAxisId="consumo"
              type="monotone"
              dataKey="consumptionMW"
              name="Consumo"
              stroke="#5DCAA5"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-2 flex gap-4 text-[11px] text-white/45">
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-tangerine" /> Temperatura (°C)
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-[#5DCAA5]" /> Consumo (MW)
        </span>
      </div>
    </div>
  )
}