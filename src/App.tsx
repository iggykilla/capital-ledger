import { useState } from 'react'
import type { ReactNode } from 'react'

import { HoldingLotsModal } from './components/common/HoldingLotsModal'
import { Header } from './components/layout/Header'
import { MobileNav } from './components/layout/MobileNav'
import { useAppContext } from './context/AppContext'
import type { Holding, PrimaryView } from './types'
import { AnalysisView } from './views/AnalysisView'
import { LogsView } from './views/LogsView'
import { MetricsView } from './views/MetricsView'
import { PortfolioView } from './views/PortfolioView'
import { PositionDetailView } from './views/PositionDetailView'

function App() {
  const [lotsHolding, setLotsHolding] = useState<Holding | null>(null)
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

  const handleViewChange = (view: PrimaryView) => {
    setActiveView(view)
    clearSelectedHolding()
    setLotsHolding(null)
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
      <Header activeView={activeView} isDetail={Boolean(selectedHolding)} onViewChange={handleViewChange} />
      <main className="main-shell">{content}</main>
      <MobileNav activeView={activeView} isDetail={Boolean(selectedHolding)} onViewChange={handleViewChange} />
      {lotsHolding && (
        <HoldingLotsModal
          holding={lotsHolding}
          transactions={transactions.filter((transaction) => transaction.ticker === lotsHolding.ticker)}
          onClose={() => setLotsHolding(null)}
        />
      )}
    </div>
  )
}

export default App
