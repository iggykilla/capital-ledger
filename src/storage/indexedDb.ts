import { fingerprintTransaction } from '../import/fingerprint'
import type { ImportRecord, LedgerTransaction, LocalDataStatus, StoredLedgerTransaction } from '../import/types'

const DB_NAME = 'capital-ledger'
const DB_VERSION = 1
const TRANSACTIONS = 'transactions'
const IMPORTS = 'imports'

const requestAsPromise = <T>(request: IDBRequest<T>) => new Promise<T>((resolve, reject) => {
  request.onsuccess = () => resolve(request.result)
  request.onerror = () => reject(request.error)
})

const openDatabase = () => new Promise<IDBDatabase>((resolve, reject) => {
  const request = indexedDB.open(DB_NAME, DB_VERSION)
  request.onupgradeneeded = () => {
    const db = request.result
    if (!db.objectStoreNames.contains(TRANSACTIONS)) {
      db.createObjectStore(TRANSACTIONS, { keyPath: 'fingerprint' })
    }
    if (!db.objectStoreNames.contains(IMPORTS)) {
      db.createObjectStore(IMPORTS, { keyPath: 'id' })
    }
  }
  request.onsuccess = () => resolve(request.result)
  request.onerror = () => reject(request.error)
})

const transactionDone = (transaction: IDBTransaction) => new Promise<void>((resolve, reject) => {
  transaction.oncomplete = () => resolve()
  transaction.onerror = () => reject(transaction.error)
  transaction.onabort = () => reject(transaction.error)
})

export const getExistingFingerprints = async (transactions: LedgerTransaction[]) => {
  const db = await openDatabase()
  try {
    const tx = db.transaction(TRANSACTIONS, 'readonly')
    const store = tx.objectStore(TRANSACTIONS)
    const existing = new Set<string>()
    for (const item of transactions) {
      const fingerprint = fingerprintTransaction(item)
      if (await requestAsPromise(store.getKey(fingerprint))) existing.add(fingerprint)
    }
    await transactionDone(tx)
    return existing
  } finally {
    db.close()
  }
}

export const saveImport = async (transactions: LedgerTransaction[], importRecord: ImportRecord) => {
  const db = await openDatabase()
  try {
    const tx = db.transaction([TRANSACTIONS, IMPORTS], 'readwrite')
    const transactionStore = tx.objectStore(TRANSACTIONS)
    const importStore = tx.objectStore(IMPORTS)
    let saved = 0
    let duplicates = 0

    for (const item of transactions) {
      const fingerprint = fingerprintTransaction(item)
      const existing = await requestAsPromise(transactionStore.getKey(fingerprint))
      if (existing) {
        duplicates += 1
        continue
      }
      const stored: StoredLedgerTransaction = { ...item, importId: importRecord.id, fingerprint }
      transactionStore.put(stored)
      saved += 1
    }

    importStore.put({ ...importRecord, transactionCount: saved, duplicateCount: duplicates })
    await transactionDone(tx)
    return { saved, duplicates }
  } finally {
    db.close()
  }
}

export const loadTransactions = async () => {
  const db = await openDatabase()
  try {
    const tx = db.transaction(TRANSACTIONS, 'readonly')
    const result = await requestAsPromise(tx.objectStore(TRANSACTIONS).getAll()) as StoredLedgerTransaction[]
    await transactionDone(tx)
    return result
  } finally {
    db.close()
  }
}

export const getLocalDataStatus = async (): Promise<LocalDataStatus> => {
  const db = await openDatabase()
  try {
    const tx = db.transaction([TRANSACTIONS, IMPORTS], 'readonly')
    const transactions = await requestAsPromise(tx.objectStore(TRANSACTIONS).getAll()) as StoredLedgerTransaction[]
    const imports = await requestAsPromise(tx.objectStore(IMPORTS).getAll()) as ImportRecord[]
    await transactionDone(tx)

    const accounts = new Set(transactions.map((item) => `${item.source}:${item.account ?? 'default'}`))
    const lastImportAt = imports.map((item) => item.importedAt).sort().at(-1) ?? null
    return { transactionCount: transactions.length, accountCount: accounts.size, lastImportAt }
  } finally {
    db.close()
  }
}

export const clearLocalPortfolioData = async () => {
  const db = await openDatabase()
  try {
    const tx = db.transaction([TRANSACTIONS, IMPORTS], 'readwrite')
    tx.objectStore(TRANSACTIONS).clear()
    tx.objectStore(IMPORTS).clear()
    await transactionDone(tx)
  } finally {
    db.close()
  }
}
