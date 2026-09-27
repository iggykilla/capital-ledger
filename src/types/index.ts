export type PrimaryView = 'portfolio' | 'metrics' | 'logs' | 'analysis'

export type TransactionType = 'BUY' | 'SELL' | 'DIVIDEND' | 'FEE'

export interface HoldingLot {
  id: string
  acquiredOn: string
  shares: number
  price: number
  fees: number
}

export interface Holding {
  ticker: string
  name: string
  shares: number
  averageCost: number
  currentPrice: number
  annualizedReturnPlaceholderPct: number
  dividendIncomePlaceholder: number
  realizedPnLPlaceholder: number
  lots: HoldingLot[]
}

export interface Transaction {
  id: string
  date: string
  ticker: string
  type: TransactionType
  shares?: number
  price?: number
  amount: number
  fees?: number
  notes?: string
}

export interface MarketPricePoint {
  ticker: string
  asOf: string
  price: number
}

export interface DecisionLogEntry {
  id: string
  date: string
  ticker: string
  action:
    | 'BUY'
    | 'SELL'
    | 'HOLD'
    | 'THESIS_UPDATE'
    | 'VALUATION_UPDATE'
    | 'PORTFOLIO_OVERRIDE'
    | 'POSITION_SIZING'
    | 'NOTES'
  price?: number
  amount?: number
  thesis?: string
  expectedReturn?: string
  valuation?: string
  reason: string
  notes?: string
}

export interface PortfolioSummary {
  portfolioValue: number
  costBasis: number
  totalProfit: number
  totalReturnPct: number
  annualizedReturnPlaceholderPct: number
  dividendIncomePlaceholder: number
  weightsByTicker: Record<string, number>
}
