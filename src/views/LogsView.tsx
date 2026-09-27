import { useState } from 'react'

import { formatDate, formatMoney, formatPrice } from '../components/common/format'
import type { DecisionLogEntry } from '../types'

interface LogsViewProps {
  entries: DecisionLogEntry[]
}

const actions: DecisionLogEntry['action'][] = [
  'BUY', 'SELL', 'HOLD', 'THESIS_UPDATE', 'VALUATION_UPDATE',
  'PORTFOLIO_OVERRIDE', 'POSITION_SIZING', 'NOTE',
]
const labelAction = (action: DecisionLogEntry['action']) => action.replaceAll('_', ' ')
const actionClass = (action: DecisionLogEntry['action']) => {
  if (action === 'BUY') return 'buy'
  if (action === 'SELL') return 'sell'
  if (action === 'HOLD') return 'hold'
  return 'update'
}

export const LogsView = ({ entries }: LogsViewProps) => {
  const [query, setQuery] = useState('')
  const [ticker, setTicker] = useState('ALL')
  const [action, setAction] = useState<'ALL' | DecisionLogEntry['action']>('ALL')
  const tickers = ['ALL', ...new Set(entries.map((entry) => entry.ticker))]
  const sorted = [...entries].sort((a, b) => b.date.localeCompare(a.date))
  const normalized = query.trim().toLowerCase()
  const visible = sorted.filter((entry) =>
    (ticker === 'ALL' || entry.ticker === ticker) &&
    (action === 'ALL' || entry.action === action) &&
    (!normalized || [
      entry.ticker, entry.action, entry.date, entry.reason, entry.thesis,
      entry.valuation, entry.expectedReturn, entry.notes,
    ].some((field) => field?.toLowerCase().includes(normalized))))
  const reset = () => { setQuery(''); setTicker('ALL'); setAction('ALL') }
  const latest = sorted[0]

  return (
    <div className="view-stack">
      <div className="view-intro"><div><p className="eyebrow accent">03 / Logs</p><h1>Decision journal</h1>
        <p className="subtle">Keep the reasoning next to each decision, then revisit it later.</p></div><span className="view-badge">Read-only demo</span></div>
      <div className="data-notice" role="note"><span className="notice-mark" aria-hidden="true">i</span>
        <span>These are synthetic journal examples. The journal does not save or sync new entries yet; decisions and broker transactions are separate records.</span></div>

      {latest && <section className="journal-feature" aria-label="Latest journal entry">
        <div className="journal-feature-top"><div><p className="eyebrow accent">Latest decision</p>
          <h2>{latest.ticker} <span className="muted">/ {labelAction(latest.action)}</span></h2></div><time dateTime={latest.date}>{formatDate(latest.date)}</time></div>
        <p>{latest.reason}</p>
        {latest.thesis && <div className="journal-thesis"><span className="eyebrow">Thesis</span>{latest.thesis}</div>}
      </section>}

      <section className="panel">
        <div className="section-heading"><div><p className="eyebrow accent">Journal explorer</p><h2>Search the decision trail</h2></div>
          <span className="section-meta" aria-live="polite">{visible.length} of {entries.length} entries</span></div>
        <div className="journal-controls">
          <label className="search-field"><span className="sr-only">Search decisions</span><span aria-hidden="true">⌕</span>
            <input type="search" value={query} placeholder="Search ticker, thesis, reason, note..." onChange={(event) => setQuery(event.target.value)} /></label>
          <label className="select-field">Ticker
            <select value={ticker} onChange={(event) => setTicker(event.target.value)}>
              {tickers.map((value) => <option value={value} key={value}>{value === 'ALL' ? 'All tickers' : value}</option>)}
            </select>
          </label>
        </div>
        <div className="filter-row action-filters" role="group" aria-label="Filter by action">
          <button type="button" className={action === 'ALL' ? 'filter-chip active' : 'filter-chip'} aria-pressed={action === 'ALL'} onClick={() => setAction('ALL')}>All actions</button>
          {actions.map((value) => <button type="button" key={value} className={action === value ? 'filter-chip active' : 'filter-chip'}
            aria-pressed={action === value} onClick={() => setAction(value)}>{labelAction(value)}</button>)}
        </div>
        {visible.length === 0 ? <div className="empty-state"><strong>No decisions match these filters.</strong><span>Try another action or clear the search.</span>
          <button type="button" className="text-button" onClick={reset}>Reset filters</button></div> : (
          <div className="journal-list">
            {visible.map((entry) => <article className="journal-entry" key={entry.id}>
              <div className="journal-entry-head">
                <div className="journal-identity"><span className="instrument-icon">{entry.ticker[0]}</span>
                  <div><strong>{entry.ticker}</strong><small><time dateTime={entry.date}>{formatDate(entry.date)}</time></small></div></div>
                <span className={`action-badge ${actionClass(entry.action)}`}>{labelAction(entry.action)}</span>
              </div>
              <p className="journal-reason">{entry.reason}</p>
              {(entry.price !== undefined || entry.amount !== undefined) &&
                <div className="journal-facts">
                  {entry.price !== undefined && <span><small>Price</small><strong>{formatPrice(entry.price)}</strong></span>}
                  {entry.amount !== undefined && <span><small>Amount</small><strong>{formatMoney(entry.amount)}</strong></span>}
                </div>}
              {(entry.thesis || entry.expectedReturn || entry.valuation || entry.notes) &&
                <dl className="journal-details">
                  {entry.thesis && <div><dt>Thesis</dt><dd>{entry.thesis}</dd></div>}
                  {entry.expectedReturn && <div><dt>Expected return</dt><dd>{entry.expectedReturn}</dd></div>}
                  {entry.valuation && <div><dt>Valuation</dt><dd>{entry.valuation}</dd></div>}
                  {entry.notes && <div><dt>Notes</dt><dd>{entry.notes}</dd></div>}
                </dl>}
            </article>)}
          </div>
        )}
      </section>
    </div>
  )
}
