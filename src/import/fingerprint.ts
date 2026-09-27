import type { LedgerTransaction } from './types'

const stablePart = (value: string | number | undefined) => value === undefined ? '' : String(value).trim()

export const transactionFingerprintInput = (transaction: LedgerTransaction) => [
  transaction.source,
  transaction.account,
  transaction.date,
  transaction.type,
  transaction.ticker,
  transaction.isin,
  transaction.quantity,
  transaction.price,
  transaction.currency,
  transaction.grossAmount,
  transaction.fee,
  transaction.tax,
  transaction.netAmount,
].map(stablePart).join('|')

export const fingerprintTransaction = (transaction: LedgerTransaction) => {
  const input = transactionFingerprintInput(transaction)
  let hash = 0x811c9dc5
  for (let index = 0; index < input.length; index += 1) {
    hash ^= input.charCodeAt(index)
    hash = Math.imul(hash, 0x01000193)
  }
  return `cl-${(hash >>> 0).toString(16).padStart(8, '0')}`
}

export const splitByExistingFingerprints = (transactions: LedgerTransaction[], existing: Set<string>) => {
  const fresh: LedgerTransaction[] = []
  const duplicates: LedgerTransaction[] = []
  for (const transaction of transactions) {
    const fingerprint = fingerprintTransaction(transaction)
    if (existing.has(fingerprint)) duplicates.push(transaction)
    else {
      existing.add(fingerprint)
      fresh.push(transaction)
    }
  }
  return { fresh, duplicates }
}
