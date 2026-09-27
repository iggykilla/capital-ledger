import { useState } from 'react'

import {
  calculateDemoHoldingCostBasis,
  calculateDemoHoldingMarketValue,
  calculateDemoHoldingTotalReturnPct,
} from '../calculations/demoPortfolioCalculations'
import { formatMoney, formatPercent, formatPrice } from '../components/common/format'
import type { Holding, PortfolioSummary } from '../types'

type Filter = 'all' | 'included' | 'excluded' | 'income'

interface PortfolioViewProps {
  holdings: Holding[]
  includedTickers: Set<string>
  summary: PortfolioSummary
  onToggleHolding: (ticker: string) => void
  onOpenPosition: (ticker: string) => void
  onOpenLots: (holding: Holding) => void
}

export const PortfolioView = ({
  holdings, includedTickers, summary, onToggleHolding, onOpenPosition, onOpenLots,
}: PortfolioViewProps) => {
  const [filter, setFilter] = useState<Filter>('all')
  const counts: Record<Filter, number> = {
    all: holdings.length,
    included: holdings.filter((holding) => includedTickers.has(holding.ticker)).length,
    excluded: holdings.filter((holding) => !includedTickers.has(holding.ticker)).length,
    income: holdings.filter((holding) => holding.dividendIncomePlaceholder > 0).length,
  }
  const filters: { id: Filter; label: string }[] = [
    { id: 'all', label: 'All holdings' },
    { id: 'included', label: 'Included' },
    { id: 'excluded', label: 'Excluded' },
    { id: 'income', label: 'Income sample' },
  ]
  const visible = holdings.filter((holding) => {
    if (filter === 'included') return includedTickers.has(holding.ticker)
    if (filter === 'excluded') return !includedTickers.has(holding.ticker)
    if (filter === 'income') return holding.dividendIncomePlaceholder > 0
    return true
  }).sort((a, b) => calculateDemoHoldingMarketValue(b) - calculateDemoHoldingMarketValue(a))

  return (
    <div className="view-stack">
      <div className="view-intro">
        <div><p className="eyebrow accent">01 / Portfolio</p><h1>Portfolio overview</h1>
          <p className="subtle">Positions, income and the effect of including each holding.</p></div>
        <span className="view-badge">Synthetic sample</span>
      </div>
      <div className="data-notice" role="note">
        <span className="notice-mark" aria-hidden="true">i</span>
        <span>Illustrative USD figures from demo inputs. Return totals are unvalidated; annualized return and XIRR are pending.</span>
      </div>

      <section className="hero-panel" aria-label="Demo portfolio snapshot">
        <div className="hero-top">
          <div>
            <p className="eyebrow">Portfolio value <span className="tag-inline">DEMO</span></p>
            <p className="hero-value">{formatMoney(summary.portfolioValue)}</p>
            <p className="subtle">Included positions · USD · synthetic prices</p>
          </div>
          <div className="hero-pending">
            <span className="eyebrow">Annualized return / XIRR</span>
            <strong>Pending</strong>
            <span className="subtle">Requires a validated cash flow engine</span>
          </div>
        </div>
        <div className="hero-metrics">
          <div><span className="eyebrow">Cost basis · demo</span><strong>{formatMoney(summary.costBasis)}</strong><small>Included positions</small></div>
          <div><span className="eyebrow">Total profit · demo</span><strong className={summary.totalProfit >= 0 ? 'positive' : 'negative'}>{formatMoney(summary.totalProfit)}</strong><small>Sample estimate</small></div>
          <div><span className="eyebrow">Total return · demo</span><strong className={summary.totalReturnPct >= 0 ? 'positive' : 'negative'}>{formatPercent(summary.totalReturnPct, true)}</strong><small>Unvalidated method</small></div>
          <div><span className="eyebrow">Dividend income · demo</span><strong className="income">{formatMoney(summary.dividendIncomePlaceholder)}</strong><small>Sample distributions</small></div>
        </div>
      </section>

      <section className="panel holding-panel">
        <div className="section-heading">
          <div><p className="eyebrow accent">Position ledger</p><h2>Holdings</h2>
            <p className="subtle">Switch a position on or off to update the demo snapshot and weights.</p></div>
          <span className="section-meta" aria-live="polite">{counts.included} of {counts.all} included</span>
        </div>
        <div className="filter-row" role="group" aria-label="Filter holdings">
          {filters.map(({ id, label }) => (
            <button type="button" className={filter === id ? 'filter-chip active' : 'filter-chip'}
              aria-pressed={filter === id} onClick={() => setFilter(id)} key={id}>
              {label} <span>{counts[id]}</span>
            </button>
          ))}
        </div>
        {visible.length === 0 ? (
          <div className="empty-state"><strong>No holdings in this view.</strong><span>Choose another filter or change a position switch.</span>
            <button type="button" className="text-button" onClick={() => setFilter('all')}>Show all holdings</button></div>
        ) : (
          <>
            <div className="table-scroll desktop-ledger">
              <table className="holdings-table">
                <thead><tr><th scope="col">Position</th><th scope="col">Market value</th><th scope="col">Cost basis</th><th scope="col">Price P/L</th><th scope="col">Total return</th><th scope="col">Income</th><th scope="col">Weight</th><th scope="col">Included</th><th scope="col"><span className="sr-only">Actions</span></th></tr></thead>
                <tbody>
                  {visible.map((holding) => {
                    const included = includedTickers.has(holding.ticker)
                    const value = calculateDemoHoldingMarketValue(holding)
                    const pricePnl = value - calculateDemoHoldingCostBasis(holding)
                    const totalReturn = calculateDemoHoldingTotalReturnPct(holding)
                    return (
                      <tr key={holding.ticker} className={included ? '' : 'excluded-row'}>
                        <td><div className="instrument"><span className="instrument-icon">{holding.ticker[0]}</span><div><button type="button" className="ticker-link" onClick={() => onOpenPosition(holding.ticker)}>{holding.ticker}</button><small>{holding.name}</small></div></div></td>
                        <td className="numeric strong">{formatMoney(value)}<small>{holding.shares} shares · {formatPrice(holding.currentPrice)}</small></td>
                        <td className="numeric">{formatMoney(calculateDemoHoldingCostBasis(holding))}</td>
                        <td className={`numeric ${pricePnl >= 0 ? 'positive' : 'negative'}`}>{formatMoney(pricePnl)}</td>
                        <td className={`numeric ${totalReturn >= 0 ? 'positive' : 'negative'}`}>{formatPercent(totalReturn, true)}</td>
                        <td className="numeric income">{formatMoney(holding.dividendIncomePlaceholder)}</td>
                        <td className="numeric">{included ? formatPercent(summary.weightsByTicker[holding.ticker] ?? 0) : '—'}</td>
                        <td><input className="switch-input" type="checkbox" checked={included} aria-label={`Include ${holding.ticker} in portfolio snapshot`} onChange={() => onToggleHolding(holding.ticker)} /></td>
                        <td><button className="text-button" type="button" onClick={() => onOpenLots(holding)}>Lots</button></td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
            <div className="mobile-ledger">
              {visible.map((holding) => {
                const included = includedTickers.has(holding.ticker)
                const pricePnl = calculateDemoHoldingMarketValue(holding) - calculateDemoHoldingCostBasis(holding)
                return (
                  <article className={included ? 'holding-card' : 'holding-card is-excluded'} key={holding.ticker}>
                    <div className="holding-card-top">
                      <div className="instrument"><span className="instrument-icon">{holding.ticker[0]}</span><div><strong>{holding.ticker}</strong><small>{holding.name}</small></div></div>
                      <div className="holding-value"><strong>{formatMoney(calculateDemoHoldingMarketValue(holding))}</strong><small className={pricePnl >= 0 ? 'positive' : 'negative'}>{formatMoney(pricePnl)} price P/L</small></div>
                    </div>
                    <div className="holding-card-metrics">
                      <div><span className="eyebrow">Invested · demo</span><strong>{formatMoney(calculateDemoHoldingCostBasis(holding))}</strong></div>
                      <div><span className="eyebrow">Dividends · demo</span><strong className="income">{formatMoney(holding.dividendIncomePlaceholder)}</strong></div>
                      <div><span className="eyebrow">Total return · demo</span><strong className={calculateDemoHoldingTotalReturnPct(holding) >= 0 ? 'positive' : 'negative'}>{formatPercent(calculateDemoHoldingTotalReturnPct(holding), true)}</strong></div>
                    </div>
                    <div className="holding-card-footer">
                      <label className="switch-label"><input className="switch-input" type="checkbox" checked={included} onChange={() => onToggleHolding(holding.ticker)} /><span>{included ? 'Included' : 'Excluded'}</span></label>
                      <div className="inline-actions"><button type="button" className="text-button" onClick={() => onOpenLots(holding)}>Lots</button><button type="button" className="text-button arrow-button" onClick={() => onOpenPosition(holding.ticker)}>Details <span aria-hidden="true">↗</span></button></div>
                    </div>
                  </article>
                )
              })}
            </div>
          </>
        )}
        <p className="table-footnote">Price P/L excludes income. Total return and weights use the demo calculation layer. Switches affect portfolio aggregates, not the underlying position records.</p>
      </section>
    </div>
  )
}
