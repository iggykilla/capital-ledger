import { Header } from './components/layout/Header'
import { MobileNav } from './components/layout/MobileNav'
import { useAppContext } from './context/AppContext'
import { AnalysisView } from './views/AnalysisView'
import { LogsView } from './views/LogsView'
import { MetricsView } from './views/MetricsView'
import { PortfolioView } from './views/PortfolioView'
import { PositionDetailView } from './views/PositionDetailView'

function App() {
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

  const handleViewChange = (view: 'portfolio' | 'metrics' | 'logs' | 'analysis') => {
    setActiveView(view)
    if (view !== 'portfolio') {
      clearSelectedHolding()
    }
  }

  let content: React.ReactNode

  if (selectedHolding) {
    content = (
      <PositionDetailView
        holding={selectedHolding}
        summary={portfolioSummary}
        transactions={transactions}
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
      />
    )
  } else if (activeView === 'metrics') {
    content = <MetricsView />
  } else if (activeView === 'logs') {
    content = <LogsView entries={decisionLogs} />
  } else {
    content = <AnalysisView />
  }

  return (
    <div className="app-shell">
      <Header activeView={activeView} onViewChange={handleViewChange} />
      <main>{content}</main>
      <MobileNav activeView={activeView} onViewChange={handleViewChange} />
    </div>
  )
}

export default App
