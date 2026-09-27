import {
  calculateDemoHoldingCostBasis,
  calculateDemoHoldingMarketValue,
  calculateDemoHoldingTotalReturnPct,
} from '../calculations/demoPortfolioCalculations'
import { KpiCard } from '../components/common/KpiCard'
import { formatDate, formatMoney, formatPercent, formatPrice } from '../components/common/format'
import type { DecisionLogEntry, Holding, PortfolioSummary, Transaction } from '../types'

const todayInDays = Math.floor(Date.now() / 86_400_000)

interface PositionDetailViewProps {
  holding: Holding
  summary: PortfolioSummary
  transactions: Transaction[]
  decisionLogs: DecisionLogEntry[]
  isIncluded: boolean
  onToggleHolding: (ticker: string) => void
  onOpenLots: () => void
  onBack: () => void
}

export const PositionDetailView = ({
  holding, summary, transactions, decisionLogs, isIncluded, onToggleHolding, onOpenLots, onBack,
}: PositionDetailViewProps) => {
  const invested = calculateDemoHoldingCostBasis(holding)
  const marketValue = calculateDemoHoldingMarketValue(holding)
  const pricePnl = marketValue - invested
  const totalReturn = calculateDemoHoldingTotalReturnPct(holding)
  const totalProfit = pricePnl + holding.dividendIncomePlaceholder + holding.realizedPnLPlaceholder
  const firstLotDate = holding.lots.map((lot) => lot.acquiredOn).sort()[0]
  const daysHeld = firstLotDate
    ? Math.max(0, todayInDays - Math.floor(Date.parse(`${firstLotDate}T00:00:00Z`) / 86_400_000))
    : null
  const holdingTransactions = transactions.filter((transaction) => transaction.ticker === holding.ticker)
    .sort((a, b) => b.date.localeCompare(a.date))
  const latestDecision = decisionLogs.filter((entry) => entry.ticker === holding.ticker)
    .sort((a, b) => b.date.localeCompare(a.date))[0]

  return (
    <div className="view-stack">
      <div className="detail-back-row">
        <button type="button" className="back-link" onClick={onBack}><span aria-hidden="true">←</span> Portfolio ledger</button>
        <span className="eyebrow">Position detail / Synthetic</span>
      </div>
      <section className="detail-hero">
        <div className="detail-head">
          <div className="instrument detail-instrument"><span className="instrument-icon">{holding.ticker[0]}</span>
            <div><p className="eyebrow accent">Position snapshot</p><h1>{holding.ticker} <span className="detail-name">/ {holding.name}</span></h1>
              <p className="subtle">{holding.shares} shares · {formatPrice(holding.currentPrice)} per share · synthetic price</p></div>
          </div>
          <label className="switch-label detail-switch"><input className="switch-input" type="checkbox" checked={isIncluded}
            onChange={() => onToggleHolding(holding.ticker)} /><span>{isIncluded ? 'Included in portfolio' : 'Excluded from portfolio'}</span></label>
        </div>
        <div className="detail-headline">
          <div><span className="eyebrow">Current value · demo</span><strong>{formatMoney(marketValue)}</strong><span className="subtle">Invested {formatMoney(invested)}</span></div>
          <div><span className="eyebrow">Price appreciation · demo</span><strong className={pricePnl >= 0 ? 'positive' : 'negative'}>{formatMoney(pricePnl)}</strong><span className="subtle">Market value less cost basis</span></div>
        </div>
      </section>
      <div className="data-notice" role="note"><span className="notice-mark" aria-hidden="true">i</span>
        <span>Sample inputs and simplified calculations. Dividend and realized amounts are placeholders. XIRR and performance contribution await a validated engine.</span></div>

      <section aria-labelledby="detail-breakdown">
        <div className="section-heading"><div><p className="eyebrow accent">Return anatomy</p><h2 id="detail-breakdown">What drove this position?</h2></div><span className="section-meta">All figures in USD</span></div>
        <div className="kpi-grid detail-kpis">
          <KpiCard label="Invested · demo" value={formatMoney(invested)} detail="Shares × average cost" />
          <KpiCard label="Worth today · demo" value={formatMoney(marketValue)} detail="Synthetic price snapshot" />
          <KpiCard label="Price appreciation · demo" value={formatMoney(pricePnl)} tone={pricePnl >= 0 ? 'positive' : 'negative'} detail="Unrealized price change" />
          <KpiCard label="Dividends · demo" value={formatMoney(holding.dividendIncomePlaceholder)} detail="Placeholder cash income" />
          <KpiCard label="Total profit · demo" value={formatMoney(totalProfit)} tone={totalProfit >= 0 ? 'positive' : 'negative'} detail="Includes placeholder realized P/L" />
          <KpiCard label="Total return · demo" value={formatPercent(totalReturn, true)} tone={totalReturn >= 0 ? 'positive' : 'negative'} detail="Simplified, unvalidated" />
        </div>
      </section>
      <section className="detail-secondary" aria-label="Timing and portfolio context">
        <div className="context-cell"><span className="eyebrow">Annualized return / XIRR</span><strong className="pending-text">Pending</strong><small>Cash flow methodology required</small></div>
        <div className="context-cell"><span className="eyebrow">Holding period</span><strong>{daysHeld === null ? 'Pending' : `${daysHeld.toLocaleString()} days`}</strong><small>{firstLotDate ? `Since ${formatDate(firstLotDate)} · sample first lot` : 'No acquisition date'}</small></div>
        <div className="context-cell"><span className="eyebrow">Portfolio weight · demo</span><strong>{isIncluded ? formatPercent(summary.weightsByTicker[holding.ticker] ?? 0) : 'Excluded'}</strong><small>Based on included positions</small></div>
        <div className="context-cell"><span className="eyebrow">Contribution to performance</span><strong className="pending-text">Pending</strong><small>Validated attribution required</small></div>
      </section>

      <div className="detail-columns">
        <section className="panel">
          <div className="section-heading"><div><p className="eyebrow accent">Execution record</p><h2>Purchase lots</h2></div>
            <button type="button" className="text-button arrow-button" onClick={onOpenLots}>Open lot ledger <span aria-hidden="true">↗</span></button></div>
          {holding.lots.length === 0 ? <p className="empty-state">No lots in this synthetic sample.</p> : (
            <div className="ledger-list">
              {holding.lots.map((lot) => (
                <div className="ledger-item" key={lot.id}><div><strong>{lot.id}</strong><small>{formatDate(lot.acquiredOn)} · {lot.shares} shares</small></div>
                  <div className="ledger-item-end"><strong>{formatPrice(lot.price)} / share</strong><small>Fees {formatPrice(lot.fees)}</small></div></div>
              ))}
            </div>
          )}
        </section>
        <section className="panel">
          <div className="section-heading"><div><p className="eyebrow accent">Decision context</p><h2>Latest journal entry</h2></div><span className="section-meta">Demo log</span></div>
          {latestDecision ? (
            <article className="decision-preview">
              <div className="decision-preview-top"><span className="action-badge">{latestDecision.action.replaceAll('_', ' ')}</span><time dateTime={latestDecision.date}>{formatDate(latestDecision.date)}</time></div>
              <strong>{latestDecision.reason}</strong>
              {latestDecision.thesis && <p className="subtle">{latestDecision.thesis}</p>}
              {latestDecision.valuation && <small>Valuation note · {latestDecision.valuation}</small>}
            </article>
          ) : <p className="empty-state">No sample decisions for this position yet.</p>}
        </section>
      </div>
      <section className="panel">
        <div className="section-heading"><div><p className="eyebrow accent">Cash flow record</p><h2>Transactions</h2>
          <p className="subtle">Sample executions and distributions, separate from market prices.</p></div><span className="section-meta">{holdingTransactions.length} records</span></div>
        {holdingTransactions.length === 0 ? <p className="empty-state">No transactions in this synthetic sample.</p> : (
          <div className="table-scroll"><table className="transactions-table">
            <thead><tr><th scope="col">Date</th><th scope="col">Action</th><th scope="col">Shares</th><th scope="col">Price</th><th scope="col">Amount</th><th scope="col">Notes</th></tr></thead>
            <tbody>{holdingTransactions.map((transaction) => (
              <tr key={transaction.id}><td>{formatDate(transaction.date)}</td><td><span className="action-badge">{transaction.type}</span></td>
                <td className="numeric">{transaction.shares ?? '—'}</td><td className="numeric">{transaction.price === undefined ? '—' : formatPrice(transaction.price)}</td>
                <td className="numeric strong">{formatMoney(transaction.amount)}</td><td>{transaction.notes ?? '—'}</td></tr>
            ))}</tbody>
          </table></div>
        )}
      </section>
    </div>
  )
}
