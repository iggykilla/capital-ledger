import { calculateDemoHoldingCostBasis, calculateDemoHoldingMarketValue } from '../calculations/demoPortfolioCalculations'
import { formatMoney, formatPercent } from '../components/common/format'
import type { Holding, PortfolioSummary } from '../types'

interface MetricsViewProps {
  holdings: Holding[]
  includedTickers: Set<string>
  summary: PortfolioSummary
}

const pendingMetrics = [
  { title: 'Cumulative return', detail: 'Needs a defined start date and reconciled cash flows.' },
  { title: 'Calendar-year return', detail: 'Needs dated valuations and a return methodology.' },
  { title: 'Benchmark return', detail: 'Needs historical total return data for the benchmark.' },
  { title: 'Portfolio vs S&P 500', detail: 'Needs like-for-like dates, flows and benchmark treatment.' },
  { title: 'Contribution by holding', detail: 'Needs validated attribution across purchases, sales and income.' },
  { title: 'Risk', detail: 'Needs historical price series before volatility or drawdown can be shown.' },
]

export const MetricsView = ({ holdings, includedTickers, summary }: MetricsViewProps) => {
  const included = holdings.filter((holding) => includedTickers.has(holding.ticker))
  const pricePnl = included.reduce((sum, holding) =>
    sum + calculateDemoHoldingMarketValue(holding) - calculateDemoHoldingCostBasis(holding), 0)
  const ranked = [...included].sort((a, b) =>
    (summary.weightsByTicker[b.ticker] ?? 0) - (summary.weightsByTicker[a.ticker] ?? 0))

  return (
    <div className="view-stack">
      <div className="view-intro"><div><p className="eyebrow accent">02 / Metrics</p><h1>Performance & measurement</h1>
        <p className="subtle">A clear path from sample totals to validated portfolio returns.</p></div><span className="view-badge">Methodology pending</span></div>
      <div className="data-notice" role="note"><span className="notice-mark" aria-hidden="true">i</span>
        <span>Figures marked demo use synthetic inputs. XIRR, annualized and benchmark results remain unavailable until their calculation and source data are validated.</span></div>

      <section className="panel">
        <div className="section-heading"><div><p className="eyebrow accent">Return anatomy</p><h2>Price, income, total, timing</h2></div><span className="section-meta">Included positions · USD</span></div>
        <div className="decomposition-grid">
          <article className="decomposition-card"><span className="step-number">01</span><span className="eyebrow">Price return · demo</span>
            <strong className={pricePnl >= 0 ? 'positive' : 'negative'}>{formatMoney(pricePnl)}</strong>
            <p>Market value less sample cost basis.</p></article>
          <article className="decomposition-card"><span className="step-number">02</span><span className="eyebrow">Dividend return · demo</span>
            <strong className="income">{formatMoney(summary.dividendIncomePlaceholder)}</strong>
            <p>Sample income assigned to included positions.</p></article>
          <article className="decomposition-card"><span className="step-number">03</span><span className="eyebrow">Total profit · demo</span>
            <strong className={summary.totalProfit >= 0 ? 'positive' : 'negative'}>{formatMoney(summary.totalProfit)}</strong>
            <p>Includes the demo realized P/L placeholder. Sample total return: {formatPercent(summary.totalReturnPct, true)}.</p></article>
          <article className="decomposition-card pending-card"><span className="step-number">04</span><span className="eyebrow">Annualized return / XIRR</span>
            <strong>Pending</strong><p>Requires dated, reconciled cash flows and a validated method.</p></article>
        </div>
      </section>

      <div className="metrics-columns">
        <section className="panel benchmark-panel">
          <div className="section-heading"><div><p className="eyebrow accent">Relative performance</p><h2>Portfolio vs S&P 500</h2></div><span className="pending-pill">Pending</span></div>
          <p className="subtle">A comparison needs an agreed period and equivalent treatment of contributions, dividends and currency.</p>
          <div className="comparison-lines">
            <div><span>Capital Ledger portfolio</span><strong>—</strong></div>
            <div><span>S&P 500 total return</span><strong>—</strong></div>
            <div><span>Difference</span><strong>Pending</strong></div>
          </div>
          <p className="table-footnote">No benchmark figure or performance chart is implied by this layout.</p>
        </section>
        <section className="panel">
          <div className="section-heading"><div><p className="eyebrow accent">Exposure</p><h2>Concentration</h2></div><span className="section-meta">Demo market weights</span></div>
          {ranked.length === 0 ? <p className="empty-state">Include at least one holding to see sample weights.</p> : (
            <div className="weight-list">
              {ranked.map((holding) => {
                const weight = summary.weightsByTicker[holding.ticker] ?? 0
                return <div className="weight-item" key={holding.ticker}>
                  <div><strong>{holding.ticker}</strong><span>{formatPercent(weight)}</span></div>
                  <div className="weight-track"><span style={{ width: `${Math.max(0, Math.min(weight, 100))}%` }} /></div>
                </div>
              })}
            </div>
          )}
          <p className="table-footnote">Weights update when positions are included or excluded in Portfolio.</p>
        </section>
      </div>

      <section className="panel">
        <div className="section-heading"><div><p className="eyebrow accent">Future measurement</p><h2>Metrics awaiting validation</h2></div><span className="section-meta">No projected values</span></div>
        <div className="pending-grid">
          {pendingMetrics.map((metric) => <article className="pending-item" key={metric.title}>
            <div><h3>{metric.title}</h3><span className="pending-pill">Pending</span></div><p>{metric.detail}</p>
          </article>)}
        </div>
      </section>
    </div>
  )
}
