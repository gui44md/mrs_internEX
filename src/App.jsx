import { useMemo, useState } from 'react'
import Header from './components/Header'
import KpiStrip from './components/KpiStrip'
import RailLineMap from './components/RailLineMap'
import AttentionPanel from './components/AttentionPanel'
import SubstationTable from './components/SubstationTable'
import DetailPanel from './components/DetailPanel'
import { generateSubstations } from './data/substations'
import DetailPanel from './components/DetailPanel'
import HistoryChart from './components/HistoryChart'   // <- adicionar
import { generateSubstations } from './data/substations'

export default function App() {
  const substations = useMemo(() => generateSubstations(), [])
  const [selectedId, setSelectedId] = useState(null)

  const selected = substations.find((s) => s.id === selectedId) || null

  const lastUpdate = useMemo(
    () =>
      new Date().toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      }),
    [],
  )

  return (
    <div className="min-h-screen pb-16">
      <Header lastUpdate={lastUpdate} />

      <main className="mx-auto flex max-w-[1400px] flex-col gap-5 px-6 py-6">
        <KpiStrip substations={substations} />

        <RailLineMap
          substations={substations}
          selectedId={selectedId}
          onSelect={(id) => setSelectedId((prev) => (prev === id ? null : id))}
        />

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div className="flex flex-col gap-5">
            <AttentionPanel
              substations={substations}
              selectedId={selectedId}
              onSelect={setSelectedId}
            />
            <SubstationTable
              substations={substations}
              selectedId={selectedId}
              onSelect={setSelectedId}
            />
          </div>

          <DetailPanel substation={selected} onClose={() => setSelectedId(null)} />
        </div>
      </main>

      <footer className="mx-auto max-w-[1400px] px-6 text-[11px] text-white/25">
        Protótipo de dashboard — dados simulados para fins de portfólio, inspirado na operação da
        MRS Logística.
      </footer>
    </div>
  )
}
