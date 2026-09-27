import { useMemo, useRef, useState } from 'react'

import { detectStatementAdapter } from '../../import/adapters'
import { parseCsv } from '../../import/csv'
import { fingerprintTransaction, splitByExistingFingerprints } from '../../import/fingerprint'
import type { LedgerTransaction } from '../../import/types'
import { validateLedgerTransaction } from '../../import/validation'
import { getExistingFingerprints, saveImport } from '../../storage/indexedDb'

interface PreviewFile {
  filename: string
  source: string
  rowCount: number
  validRows: number
  rejectedRows: number
  duplicateRows: number
  errors: string[]
  supported: boolean
  transactions: LedgerTransaction[]
}

interface ImportDataModalProps {
  onClose: () => void
  onImported: () => void
}

const makeImportId = () => globalThis.crypto?.randomUUID?.() ?? `import-${Date.now()}`

export const ImportDataModal = ({ onClose, onImported }: ImportDataModalProps) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [previews, setPreviews] = useState<PreviewFile[]>([])
  const [busy, setBusy] = useState(false)
  const [dragging, setDragging] = useState(false)

  const processFiles = async (files: File[]) => {
    setBusy(true)
    try {
      const next: PreviewFile[] = []
      for (const file of files) {
        if (!file.name.toLowerCase().endsWith('.csv')) {
          next.push({ filename: file.name, source: 'Unsupported / Unknown format', rowCount: 0, validRows: 0, rejectedRows: 0, duplicateRows: 0, errors: ['Only CSV files are supported in this phase.'], supported: false, transactions: [] })
          continue
        }

        const table = parseCsv(await file.text())
        const adapter = detectStatementAdapter(table.headers, table.rows.slice(0, 5))
        if (!adapter) {
          next.push({ filename: file.name, source: 'Unsupported / Unknown format', rowCount: table.rows.length, validRows: 0, rejectedRows: table.rows.length, duplicateRows: 0, errors: ['No supported statement adapter matched these headers.'], supported: false, transactions: [] })
          continue
        }

        const normalized = adapter.normalize(table.headers, table.rows, file.name)
        const validTransactions: LedgerTransaction[] = []
        const validationErrors: string[] = []
        normalized.forEach((transaction, index) => {
          const result = validateLedgerTransaction(transaction)
          if (result.valid) validTransactions.push(transaction)
          else validationErrors.push(`Row ${index + 2}: ${result.errors.join(', ')}`)
        })

        const existing = await getExistingFingerprints(validTransactions)
        const split = splitByExistingFingerprints(validTransactions, new Set(existing))
        next.push({
          filename: file.name,
          source: adapter.label,
          rowCount: table.rows.length,
          validRows: split.fresh.length,
          rejectedRows: normalized.length - validTransactions.length,
          duplicateRows: split.duplicates.length,
          errors: validationErrors.slice(0, 6),
          supported: true,
          transactions: validTransactions,
        })
      }
      setPreviews(next)
    } finally {
      setBusy(false)
    }
  }

  const importable = useMemo(() => previews.flatMap((preview) => preview.supported ? preview.transactions : []), [previews])
  const canConfirm = previews.some((preview) => preview.supported && preview.validRows > 0)

  const confirmImport = async () => {
    if (!canConfirm) return
    setBusy(true)
    try {
      const existing = await getExistingFingerprints(importable)
      const { fresh } = splitByExistingFingerprints(importable, new Set(existing))
      const importId = makeImportId()
      await saveImport(fresh, {
        id: importId,
        importedAt: new Date().toISOString(),
        sourceFiles: previews.filter((preview) => preview.supported).map((preview) => preview.filename),
        transactionCount: 0,
        duplicateCount: importable.length - fresh.length,
      })
      onImported()
      onClose()
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="import-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="import-modal" role="dialog" aria-modal="true" aria-labelledby="import-title">
        <div className="import-modal-header">
          <div><span className="eyebrow">LOCAL-FIRST</span><h2 id="import-title">Import portfolio</h2></div>
          <button type="button" className="icon-button" onClick={onClose} aria-label="Close import">×</button>
        </div>

        <div
          className={`import-dropzone${dragging ? ' is-dragging' : ''}`}
          onDragEnter={(event) => { event.preventDefault(); setDragging(true) }}
          onDragOver={(event) => event.preventDefault()}
          onDragLeave={() => setDragging(false)}
          onDrop={(event) => { event.preventDefault(); setDragging(false); void processFiles(Array.from(event.dataTransfer.files)) }}
        >
          <strong>Drop statements here</strong>
          <span>or</span>
          <button type="button" className="button-primary" onClick={() => inputRef.current?.click()}>Choose files</button>
          <small>CSV · processed locally in your browser</small>
          <input ref={inputRef} hidden type="file" accept=".csv,text/csv" multiple onChange={(event) => void processFiles(Array.from(event.target.files ?? []))} />
        </div>

        <p className="privacy-note">Your files are processed locally and are not uploaded.</p>

        {previews.length > 0 && (
          <div className="import-preview-list">
            {previews.map((preview) => (
              <article className={`import-preview-card${preview.supported ? '' : ' unsupported'}`} key={preview.filename}>
                <div className="import-preview-heading"><strong>{preview.filename}</strong><span>{preview.source}</span></div>
                <div className="import-preview-stats">
                  <span><b>{preview.rowCount}</b> rows</span>
                  <span><b>{preview.validRows}</b> new</span>
                  <span><b>{preview.duplicateRows}</b> already imported</span>
                  <span><b>{preview.rejectedRows}</b> rejected</span>
                </div>
                {preview.errors.length > 0 && <ul>{preview.errors.map((error) => <li key={error}>{error}</li>)}</ul>}
              </article>
            ))}
          </div>
        )}

        <div className="import-modal-footer">
          <button type="button" className="button-secondary" onClick={onClose}>Cancel</button>
          <button type="button" className="button-primary" disabled={!canConfirm || busy} onClick={() => void confirmImport()}>{busy ? 'Processing…' : 'Confirm Import'}</button>
        </div>
      </section>
    </div>
  )
}
