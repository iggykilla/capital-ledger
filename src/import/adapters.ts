import { parseLocaleNumber } from './csv.ts'
import type { LedgerTransactionType, StatementAdapter } from './types'

const normalizedHeaders = ['date', 'type', 'currency']
const rowObject = (headers: string[], row: string[]) =>
  Object.fromEntries(headers.map((header, index) => [header.trim().toLowerCase(), row[index] ?? '']))

export const capitalLedgerAdapter: StatementAdapter = {
  id: 'capital-ledger-normalized',
  label: 'Capital Ledger normalized CSV',
  detect: (headers) => {
    const lower = headers.map((header) => header.trim().toLowerCase())
    return normalizedHeaders.every((header) => lower.includes(header)) &&
      (lower.includes('netamount') || lower.includes('grossamount'))
  },
  normalize: (headers, rows, sourceFile) =>
    rows.map((row, index) => {
      const value = rowObject(headers, row)
      const type = value.type.toUpperCase() as LedgerTransactionType
      return {
        id: value.id || `row-${index + 1}`,
        source: value.source || 'Capital Ledger',
        account: value.account || undefined,
        date: value.date,
        type,
        ticker: value.ticker || undefined,
        isin: value.isin || undefined,
        quantity: parseLocaleNumber(value.quantity),
        price: parseLocaleNumber(value.price),
        currency: value.currency.toUpperCase(),
        grossAmount: parseLocaleNumber(value.grossamount),
        fee: parseLocaleNumber(value.fee),
        tax: parseLocaleNumber(value.tax),
        netAmount: parseLocaleNumber(value.netamount),
        sourceFile,
      }
    }),
}

export const revolutAdapterScaffold: StatementAdapter = {
  id: 'revolut',
  label: 'Revolut',
  detect: () => false,
  normalize: () => [],
}

export const ingAdapterScaffold: StatementAdapter = {
  id: 'ing',
  label: 'ING',
  detect: () => false,
  normalize: () => [],
}

const adapters: StatementAdapter[] = [capitalLedgerAdapter, revolutAdapterScaffold, ingAdapterScaffold]

export const detectStatementAdapter = (headers: string[], sampleRows: string[][]) =>
  adapters.find((adapter) => adapter.detect(headers, sampleRows)) ?? null
