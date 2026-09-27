import assert from 'node:assert/strict'
import test from 'node:test'

import { detectStatementAdapter } from '../src/import/adapters.ts'
import { parseCsv } from '../src/import/csv.ts'
import { fingerprintTransaction, splitByExistingFingerprints } from '../src/import/fingerprint.ts'
import type { LedgerTransaction } from '../src/import/types.ts'
import { validateLedgerTransaction } from '../src/import/validation.ts'

test('parses comma CSV with quoted commas and empty fields', () => {
  const table = parseCsv('date,notes,amount\n2026-09-27,"Buy, long term",10\n2026-09-28,,20')
  assert.equal(table.delimiter, ',')
  assert.deepEqual(table.headers, ['date', 'notes', 'amount'])
  assert.equal(table.rows[0][1], 'Buy, long term')
  assert.equal(table.rows[1][1], '')
})

test('handles BOM, semicolon delimiter and CRLF', () => {
  const table = parseCsv('\uFEFFdate;type;currency;netAmount\r\n2026-09-27;BUY;EUR;10,50\r\n')
  assert.equal(table.delimiter, ';')
  assert.equal(table.headers[0], 'date')
  assert.equal(table.rows[0][3], '10,50')
})

test('unknown formats stay unsupported', () => {
  assert.equal(detectStatementAdapter(['mystery', 'value'], [['x', '1']]), null)
})

test('strict normalized CSV is detected without guessing broker schemas', () => {
  assert.equal(detectStatementAdapter(['date', 'type', 'currency', 'netAmount'], [['2026-09-27', 'BUY', 'EUR', '10']])?.id, 'capital-ledger-normalized')
})

const transaction: LedgerTransaction = {
  id: 'a',
  source: 'Synthetic',
  account: 'Test',
  date: '2026-09-27',
  type: 'BUY',
  ticker: 'TEST',
  quantity: 2,
  price: 10,
  currency: 'EUR',
  netAmount: -20,
}

test('fingerprints are deterministic and ignore filename/import metadata', () => {
  const first = fingerprintTransaction({ ...transaction, sourceFile: 'one.csv', importId: '1' })
  const second = fingerprintTransaction({ ...transaction, sourceFile: 'renamed.csv', importId: '2' })
  assert.equal(first, second)
})

test('duplicate splitting is idempotent within and across imports', () => {
  const existing = new Set<string>([fingerprintTransaction(transaction)])
  const result = splitByExistingFingerprints([transaction, { ...transaction, id: 'b', date: '2026-09-28' }], existing)
  assert.equal(result.duplicates.length, 1)
  assert.equal(result.fresh.length, 1)
})

test('normalization validation rejects missing amounts and bad currency', () => {
  const result = validateLedgerTransaction({ ...transaction, currency: 'EU', netAmount: undefined })
  assert.equal(result.valid, false)
  assert.match(result.errors.join(' '), /Currency/)
  assert.match(result.errors.join(' '), /amount/)
})
