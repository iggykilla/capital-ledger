export type LedgerTransactionType =
  | 'BUY'
  | 'SELL'
  | 'DIVIDEND'
  | 'FEE'
  | 'TAX'
  | 'INTEREST'
  | 'TRANSFER'
  | 'CASH'

export interface LedgerTransaction {
  id: string
  source: string
  account?: string
  date: string
  type: LedgerTransactionType
  ticker?: string
  isin?: string
  quantity?: number
  price?: number
  currency: string
  grossAmount?: number
  fee?: number
  tax?: number
  netAmount?: number
  sourceFile?: string
  importId?: string
}

export interface StoredLedgerTransaction extends LedgerTransaction {
  fingerprint: string
}

export interface ImportRecord {
  id: string
  importedAt: string
  sourceFiles: string[]
  transactionCount: number
  duplicateCount: number
}

export interface LocalDataStatus {
  transactionCount: number
  accountCount: number
  lastImportAt: string | null
}

export interface CsvTable {
  delimiter: ',' | ';'
  headers: string[]
  rows: string[][]
}

export interface ValidationResult {
  valid: boolean
  errors: string[]
}

export interface StatementAdapter {
  id: string
  label: string
  detect: (headers: string[], sampleRows: string[][]) => boolean
  normalize: (headers: string[], rows: string[][], sourceFile: string) => LedgerTransaction[]
}
