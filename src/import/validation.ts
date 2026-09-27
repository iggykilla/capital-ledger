import type { LedgerTransaction, LedgerTransactionType, ValidationResult } from './types'

const validTypes = new Set<LedgerTransactionType>([
  'BUY',
  'SELL',
  'DIVIDEND',
  'FEE',
  'TAX',
  'INTEREST',
  'TRANSFER',
  'CASH',
])

export const validateLedgerTransaction = (transaction: LedgerTransaction): ValidationResult => {
  const errors: string[] = []

  if (!transaction.date || Number.isNaN(Date.parse(transaction.date))) errors.push('Invalid date')
  if (!validTypes.has(transaction.type)) errors.push('Unsupported transaction type')
  if (!/^[A-Z]{3}$/.test(transaction.currency)) errors.push('Currency must be a 3-letter code')
  if (transaction.grossAmount === undefined && transaction.netAmount === undefined) {
    errors.push('At least one amount is required')
  }

  const numericValues = [transaction.quantity, transaction.price, transaction.grossAmount, transaction.fee, transaction.tax, transaction.netAmount]
  if (numericValues.some((value) => value !== undefined && !Number.isFinite(value))) errors.push('Invalid numeric value')

  return { valid: errors.length === 0, errors }
}
