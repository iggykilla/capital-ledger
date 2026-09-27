import type { Holding, PortfolioSummary } from '../types'

export const calculateDemoHoldingCostBasis = (holding: Holding): number => holding.shares * holding.averageCost

export const calculateDemoHoldingMarketValue = (holding: Holding): number => holding.shares * holding.currentPrice

export const calculateDemoHoldingTotalReturnPct = (holding: Holding): number => {
  const costBasis = calculateDemoHoldingCostBasis(holding)
  if (costBasis === 0) {
    return 0
  }

  const totalPnL =
    calculateDemoHoldingMarketValue(holding) -
    costBasis +
    holding.dividendIncomePlaceholder +
    holding.realizedPnLPlaceholder
  return (totalPnL / costBasis) * 100
}

export const calculateDemoPortfolioSummary = (
  holdings: Holding[],
  includedTickers: Set<string>,
): PortfolioSummary => {
  const includedHoldings = holdings.filter((holding) => includedTickers.has(holding.ticker))

  const costBasis = includedHoldings.reduce((sum, holding) => sum + calculateDemoHoldingCostBasis(holding), 0)
  const portfolioValue = includedHoldings.reduce((sum, holding) => sum + calculateDemoHoldingMarketValue(holding), 0)
  const dividendIncomePlaceholder = includedHoldings.reduce(
    (sum, holding) => sum + holding.dividendIncomePlaceholder,
    0,
  )
  const realizedPnLPlaceholder = includedHoldings.reduce(
    (sum, holding) => sum + holding.realizedPnLPlaceholder,
    0,
  )

  const totalProfit = portfolioValue - costBasis + dividendIncomePlaceholder + realizedPnLPlaceholder
  const totalReturnPct = costBasis === 0 ? 0 : (totalProfit / costBasis) * 100

  const annualizedReturnPlaceholderPct =
    costBasis === 0
      ? 0
      : includedHoldings.reduce((sum, holding) => {
          const weight = calculateDemoHoldingCostBasis(holding) / costBasis
          return sum + weight * holding.annualizedReturnPlaceholderPct
        }, 0)

  const weightsByTicker = Object.fromEntries(
    holdings.map((holding) => {
      const marketValue = includedTickers.has(holding.ticker) ? calculateDemoHoldingMarketValue(holding) : 0
      const weight = portfolioValue === 0 ? 0 : (marketValue / portfolioValue) * 100
      return [holding.ticker, weight]
    }),
  )

  return {
    portfolioValue,
    costBasis,
    totalProfit,
    totalReturnPct,
    annualizedReturnPlaceholderPct,
    dividendIncomePlaceholder,
    weightsByTicker,
  }
}
