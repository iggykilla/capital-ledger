import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'

import { HoldingLotsModal } from './components/common/HoldingLotsModal'
import { ImportDataModal } from './components/import/ImportDataModal'
import { LocalDataBar } from './components/import/LocalDataBar'
import { Header } from './components/layout/Header'
import { MobileNav } from './components/layout/MobileNav'
import { useAppContext } from './context/AppContext'
import type { LocalDataStatus } from './import/types'
import { clearLocalPortfolioData, getLocalDataStatus } from './storage/indexedDb'
import type { Holding, PrimaryView } from './types'
import { AnalysisView } from './views/AnalysisView'
import { LogsView } from './views/LogsView'
import { MetricsView } from './views/MetricsView'
import { PortfolioView } from './views/PortfolioView'
import { PositionDetailView } from './views/PositionDetailView'

function App() {
  const [lotsHolding, setLotsHolding] = useState<Holding | null>(null)
  const [isImportOpen, setIsImportOpen] = useState(false)
  const [localDataStatus, setLocalDataStatus] = useState<LocalDataStatus | null>(null)
  const {
    activeView,
    decisionLogs,
    selectedHolding,
    includedTickers,
    holdings,
    portfolioSummary,
    setActiveView,
    clearSelectedHolding,
    selectHolding,
    toggleHoldingInPortfolio,
    transactions,
  } = useAppContext()

  const refreshLocalStatus = async () => {
    setLocalDataStatus(await getLocalDataStatus())
  }

  useEffect(() => {
    void refreshLocalStatus()
  }, [])

  const handleViewChange = (view: PrimaryView) => {
    setActiveView(view)
    clearSelectedHolding()
    setLotsHolding(null)
  }

  const handleClearLocalData = async () => {
    const confirmed = window.confirm('Clear all local Capital Ledger portfolio data from this browser? This cannot be undone.')
    if (!confirmed) return
    await clearLocalPortfolioData()
    await refreshLocalStatus()
  }

  let content: ReactNode

  if (selectedHolding) {
    content = (
      <PositionDetailView
        holding={selectedHolding}
        summary={portfolioSummary}
        transactions={transactions}
        decisionLogs={decisionLogs}
        isIncluded={includedTickers.has(selectedHolding.ticker)}
        onToggleHolding={toggleHoldingInPortfolio}
        onOpenLots={() => setLotsHolding(selectedHolding)}
        onBack={clearSelectedHolding}
      />
    )
  } else if (activeView === 'portfolio') {
    content = (
      <PortfolioView
        holdings={holdings}
        includedTickers={includedTickers}
        summary={portfolioSummary}
        onToggleHolding={toggleHoldingInPortfolio}
        onOpenPosition={selectHolding}
        onOpenLots={setLotsHolding}
      />
    )
  } else if (activeView === 'metrics') {
    content = <MetricsView holdings={holdings} includedTickers={includedTickers} summary={portfolioSummary} />
  } else if (activeView === 'logs') {
    content = <LogsView entries={decisionLogs} />
  } else {
    content = <AnalysisView />
  }

  return (
    <div className="app-shell">
      <Header activeView={activeView} isDetail={Boolean(selectedHolding)} onViewChange={handleViewChange} onImportData={() => setIsImportOpen(true)} />
      <main className="main-shell">
        <LocalDataBar status={localDataStatus} onImport={() => setIsImportOpen(true)} onClear={() => void handleClearLocalData()} />
        {content}
      </main>
      <MobileNav activeView={activeView} isDetail={Boolean(selectedHolding)} onViewChange={handleViewChange} />
      {lotsHolding && (
        <HoldingLotsModal
          holding={lotsHolding}
          transactions={transactions.filter((transaction) => transaction.ticker === lotsHolding.ticker)}
          onClose={() => setLotsHolding(null)}
        />
      )}
      {isImportOpen && <ImportDataModal onClose={() => setIsImportOpen(false)} onImported={() => void refreshLocalStatus()} />}
    </div>
  )
}

export default App
