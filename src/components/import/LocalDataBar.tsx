import type { LocalDataStatus } from '../../import/types'

interface LocalDataBarProps {
  status: LocalDataStatus | null
  onImport: () => void
  onClear: () => void
}

const formatDate = (value: string | null) => value
  ? new Intl.DateTimeFormat(undefined, { day: 'numeric', month: 'short' }).format(new Date(value))
  : 'Never'

export const LocalDataBar = ({ status, onImport, onClear }: LocalDataBarProps) => {
  const hasLocalData = Boolean(status?.transactionCount)

  return (
    <section className="local-data-bar" aria-label="Local portfolio data status">
      <div>
        <span className="eyebrow">{hasLocalData ? 'LOCAL DATA STORED' : 'DEMO MODE'}</span>
        <strong>{hasLocalData ? `${status?.transactionCount ?? 0} transactions` : 'No local portfolio imported'}</strong>
        <small>
          {hasLocalData
            ? `${status?.accountCount ?? 0} accounts · Last import ${formatDate(status?.lastImportAt ?? null)} · Portfolio views remain demo-only for now.`
            : 'Synthetic demo data is shown in portfolio views. Imported data is kept separate.'}
        </small>
      </div>
      <div className="local-data-actions">
        <button type="button" className="button-secondary" onClick={onImport}>Import data</button>
        {hasLocalData && <button type="button" className="button-danger-quiet" onClick={onClear}>Clear local data</button>}
      </div>
    </section>
  )
}
