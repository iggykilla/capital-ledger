import { createContext, useContext, useMemo, useState } from 'react'
import type { ReactNode } from 'react'

import { calculateDemoPortfolioSummary } from '../calculations/demoPortfolioCalculations'
import { demoDecisionLogs, demoHoldings, demoMarketPrices, demoTransactions } from '../data/demoData'
import type { Holding, PrimaryView } from '../types'

interface AppContextValue {
  activeView: PrimaryView
  selectedHolding: Holding | null
  includedTickers: Set<string>
  holdings: Holding[]
  transactions: typeof demoTransactions
  marketPrices: typeof demoMarketPrices
  decisionLogs: typeof demoDecisionLogs
  portfolioSummary: ReturnType<typeof calculateDemoPortfolioSummary>
  setActiveView: (view: PrimaryView) => void
  selectHolding: (ticker: string) => void
  clearSelectedHolding: () => void
  toggleHoldingInPortfolio: (ticker: string) => void
}

const AppContext = createContext<AppContextValue | undefined>(undefined)

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [activeView, setActiveView] = useState<PrimaryView>('portfolio')
  const [selectedTicker, setSelectedTicker] = useState<string | null>(null)
  const [includedTickers, setIncludedTickers] = useState<Set<string>>(
    () => new Set(demoHoldings.map((holding) => holding.ticker)),
  )

  const selectedHolding = useMemo(
    () => demoHoldings.find((holding) => holding.ticker === selectedTicker) ?? null,
    [selectedTicker],
  )

  const portfolioSummary = useMemo(
    () => calculateDemoPortfolioSummary(demoHoldings, includedTickers),
    [includedTickers],
  )

  const selectHolding = (ticker: string) => {
    setSelectedTicker(ticker)
  }

  const clearSelectedHolding = () => {
    setSelectedTicker(null)
  }

  const toggleHoldingInPortfolio = (ticker: string) => {
    setIncludedTickers((previous) => {
      const next = new Set(previous)
      if (next.has(ticker)) {
        next.delete(ticker)
      } else {
        next.add(ticker)
      }
      return next
    })
  }

  return (
    <AppContext.Provider
      value={{
        activeView,
        selectedHolding,
        includedTickers,
        holdings: demoHoldings,
        transactions: demoTransactions,
        marketPrices: demoMarketPrices,
        decisionLogs: demoDecisionLogs,
        portfolioSummary,
        setActiveView,
        selectHolding,
        clearSelectedHolding,
        toggleHoldingInPortfolio,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export const useAppContext = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider')
  }
  return context
}
