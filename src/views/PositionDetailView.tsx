import {
  calculateDemoHoldingCostBasis,
  calculateDemoHoldingMarketValue,
  calculateDemoHoldingTotalReturnPct,
} from '../calculations/demoPortfolioCalculations'
import { KpiCard } from '../components/common/KpiCard'
import type { Holding, PortfolioSummary, Transaction } from '../types'

const currencyFormat = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
const percentFormat = new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 })

interface PositionDetailViewProps {
  holding: Holding
  summary: PortfolioSummary
  transactions: Transaction[]
  onBack: () => void
}

export const PositionDetailView = ({ holding, summary, transactions, onBack }: PositionDetailViewProps) => {
  const costBasis = calculateDemoHoldingCostBasis(holding)
  const marketValue = calculateDemoHoldingMarketValue(holding)
  const unrealizedPnL = marketValue - costBasis
  const priceReturnPct = costBasis === 0 ? 0 : (unrealizedPnL / costBasis) * 100
  const totalReturn = calculateDemoHoldingTotalReturnPct(holding)
  const portfolioWeight = summary.weightsByTicker[holding.ticker] ?? 0
  const contribution = (portfolioWeight / 100) * totalReturn

  const holdingTransactions = transactions.filter((transaction) => transaction.ticker === holding.ticker)

  return (
    <section className="view-stack">
      <div className="panel-title-row">
        <button type="button" className="back-button" onClick={onBack}>
          ← Back to Portfolio
        </button>
        <h2>
          {holding.ticker} · {holding.name}
        </h2>
      </div>

      <section className="kpi-grid">
        <KpiCard label="Price Return" value={`${percentFormat.format(priceReturnPct)}%`} />
        <KpiCard label="Dividend Return" value={currencyFormat.format(holding.dividendIncomePlaceholder)} tone="muted" />
        <KpiCard label="Total Return" value={`${percentFormat.format(totalReturn)}%`} tone={totalReturn >= 0 ? 'positive' : 'negative'} />
        <KpiCard label="Annualized Return" value={`${percentFormat.format(holding.annualizedReturnPlaceholderPct)}%`} tone="muted" />
        <KpiCard label="Cost Basis" value={currencyFormat.format(costBasis)} />
        <KpiCard label="Market Value" value={currencyFormat.format(marketValue)} />
        <KpiCard label="Realized P&L" value={currencyFormat.format(holding.realizedPnLPlaceholder)} />
        <KpiCard label="Unrealized P&L" value={currencyFormat.format(unrealizedPnL)} tone={unrealizedPnL >= 0 ? 'positive' : 'negative'} />
        <KpiCard label="Holding Period" value="Synthetic placeholder" tone="muted" />
        <KpiCard label="Portfolio Weight" value={`${percentFormat.format(portfolioWeight)}%`} />
        <KpiCard label="Contribution to Return" value={`${percentFormat.format(contribution)}%`} tone="muted" />
      </section>

      <section className="panel">
        <div className="panel-title-row">
          <h3>Holding Lots</h3>
          <p>Lot-level structure is UI-ready for validated future calculations.</p>
        </div>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Lot</th>
                <th>Acquired</th>
                <th>Shares</th>
                <th>Price</th>
                <th>Fees</th>
              </tr>
            </thead>
            <tbody>
              {holding.lots.map((lot) => (
                <tr key={lot.id}>
                  <td>{lot.id}</td>
                  <td>{lot.acquiredOn}</td>
                  <td>{lot.shares}</td>
                  <td>{currencyFormat.format(lot.price)}</td>
                  <td>{currencyFormat.format(lot.fees)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="panel">
        <div className="panel-title-row">
          <h3>Transactions (separate from market data)</h3>
        </div>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Shares</th>
                <th>Price</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {holdingTransactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td>{transaction.date}</td>
                  <td>{transaction.type}</td>
                  <td>{transaction.shares ?? '-'}</td>
                  <td>{transaction.price ? currencyFormat.format(transaction.price) : '-'}</td>
                  <td>{currencyFormat.format(transaction.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </section>
  )
}
