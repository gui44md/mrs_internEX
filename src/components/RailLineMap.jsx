const STATUS_COLOR = {
  Operacional: '#2FBF71',
  Atenção: '#FFCF00',
  Crítico: '#FF5252',
  Manutenção: '#7B8FA1',
}

const TRACK_Y = 120
const X_START = 70
const X_END = 1830
const WIDTH = 1900
const HEIGHT = 260

export default function RailLineMap({ substations, selectedId, onSelect }) {
  const xFor = (km) => X_START + (km / 100) * (X_END - X_START)

  const ties = []
  for (let x = X_START - 10; x <= X_END + 10; x += 18) {
    ties.push(x)
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-rail-border bg-rail-800/40 p-4">
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="h-[260px] min-w-[1500px] w-full"
        role="img"
        aria-label="Mapa da malha ferroviária com status das subestações"
      >
        {/* Lastro / dormentes */}
        {ties.map((x) => (
          <line
            key={x}
            x1={x}
            y1={TRACK_Y - 14}
            x2={x}
            y2={TRACK_Y + 14}
            stroke="rgba(255,255,255,0.12)"
            strokeWidth="4"
          />
        ))}
        {/* Trilhos */}
        <line x1={X_START - 20} y1={TRACK_Y - 7} x2={X_END + 20} y2={TRACK_Y - 7} stroke="#3a5a78" strokeWidth="3" />
        <line x1={X_START - 20} y1={TRACK_Y + 7} x2={X_END + 20} y2={TRACK_Y + 7} stroke="#3a5a78" strokeWidth="3" />

        {substations.map((se, i) => {
          const x = xFor(se.km)
          const labelUp = i % 2 === 0
          const color = STATUS_COLOR[se.status]
          const needsAttention = se.status === 'Crítico' || se.status === 'Atenção'
          const isSelected = selectedId === se.id

          return (
            <g
              key={se.id}
              className="cursor-pointer"
              onClick={() => onSelect(se.id)}
              tabIndex={0}
              role="button"
              aria-label={`${se.name}, status ${se.status}`}
              onKeyDown={(e) => e.key === 'Enter' && onSelect(se.id)}
            >
              {/* Conector do rótulo */}
              <line
                x1={x}
                y1={TRACK_Y}
                x2={x}
                y2={labelUp ? TRACK_Y - 46 : TRACK_Y + 46}
                stroke="rgba(255,255,255,0.18)"
                strokeWidth="1.5"
              />

              {needsAttention && (
                <circle cx={x} cy={TRACK_Y} r="9" fill={color} opacity="0.55" className="animate-pulseRing" />
              )}

              <circle
                cx={x}
                cy={TRACK_Y}
                r={isSelected ? 11 : 9}
                fill={color}
                stroke={isSelected ? '#fff' : 'rgba(3,15,26,0.6)'}
                strokeWidth={isSelected ? 2.5 : 1.5}
              />

              <text
                x={x}
                y={labelUp ? TRACK_Y - 54 : TRACK_Y + 66}
                textAnchor="middle"
                className="font-mono"
                fontSize="11"
                fill={isSelected ? '#FFCF00' : 'rgba(255,255,255,0.75)'}
              >
                {se.id}
              </text>
              <text
                x={x}
                y={labelUp ? TRACK_Y - 40 : TRACK_Y + 80}
                textAnchor="middle"
                fontSize="10.5"
                fill="rgba(255,255,255,0.45)"
              >
                {se.name.replace('SE ', '')}
              </text>
            </g>
          )
        })}
      </svg>

      <div className="mt-2 flex flex-wrap gap-4 border-t border-rail-border px-1 pt-3 text-[11px] text-white/50">
        {Object.entries(STATUS_COLOR).map(([label, color]) => (
          <span key={label} className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
            {label}
          </span>
        ))}
        <span className="ml-auto text-white/30">Clique em uma estação para ver detalhes</span>
      </div>
    </div>
  )
}
