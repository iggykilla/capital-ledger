import { useEffect, useRef } from 'react'

import type { Holding, Transaction } from '../../types'
import { formatDate, formatMoney, formatPrice } from './format'

interface HoldingLotsModalProps {
  holding: Holding
  transactions: Transaction[]
  onClose: () => void
}

export const HoldingLotsModal = ({ holding, transactions, onClose }: HoldingLotsModalProps) => {
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null
    closeRef.current?.focus()
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('keydown', handleEscape)
      previousFocus?.focus()
    }
  }, [onClose])

  const dividends = transactions.filter((transaction) => transaction.type === 'DIVIDEND')

  return (
    <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
      <section
        className="modal-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="lots-title"
        onKeyDown={(event) => { if (event.key === 'Tab') { event.preventDefault(); closeRef.current?.focus() } }}
      >
        <div className="modal-heading">
          <div>
            <p className="eyebrow accent">Position sub-ledger · Synthetic</p>
            <h2 id="lots-title">{holding.ticker} <span className="muted">/ Lots & income</span></h2>
            <p className="subtle">{holding.name}</p>
          </div>
          <button type="button" ref={closeRef} className="icon-button" onClick={onClose} aria-label="Close lots dialog">×</button>
        </div>
        <div className="modal-summary">
          <div><span className="eyebrow">Cost basis · demo</span><strong>{formatMoney(holding.shares * holding.averageCost)}</strong></div>
          <div><span className="eyebrow">Shares</span><strong>{holding.shares}</strong></div>
          <div><span className="eyebrow">Dividend sample</span><strong>{formatMoney(holding.dividendIncomePlaceholder)}</strong></div>
        </div>
        <div className="section-heading"><h3>Purchase lots</h3><span className="section-meta">{holding.lots.length} records</span></div>
        {holding.lots.length === 0 ? (
          <p className="empty-state">No purchase lots are available for this sample holding.</p>
        ) : (
          <div className="ledger-list">
            {holding.lots.map((lot) => (
              <div className="ledger-item" key={lot.id}>
                <div><strong>{lot.id}</strong><small>{formatDate(lot.acquiredOn)} · {lot.shares} shares at {formatPrice(lot.price)}</small></div>
                <div className="ledger-item-end"><strong>{formatMoney(lot.shares * lot.price)}</strong><small>Fees {formatPrice(lot.fees)}</small></div>
              </div>
            ))}
          </div>
        )}
        <div className="section-heading modal-section"><h3>Dividend transactions</h3><span className="section-meta">{dividends.length} records</span></div>
        {dividends.length === 0 ? <p className="empty-state">No dividend transactions in the synthetic sample.</p> : (
          <div className="ledger-list">
            {dividends.map((transaction) => (
              <div className="ledger-item" key={transaction.id}>
                <div><strong>{formatDate(transaction.date)}</strong><small>{transaction.notes || 'Dividend distribution'}</small></div>
                <strong className="positive">+{formatMoney(transaction.amount)}</strong>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
