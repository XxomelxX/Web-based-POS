export type OfflineAction = {
  id: string
  type: string
  payload: unknown
  timestamp: number
  status: "pending" | "synced" | "error"
  error?: string
}

const DB_NAME = "jj-store-offline"
const DB_VERSION = 1
const STORE_QUEUE = "queue"
const STORE_DATA = "data"

function isBrowser() {
  return typeof window !== "undefined" && typeof window.indexedDB !== "undefined"
}

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (!isBrowser()) return reject(new Error("IndexedDB is not available"))

    const request = window.indexedDB.open(DB_NAME, DB_VERSION)

    request.onupgradeneeded = () => {
      const db = request.result
      if (!db.objectStoreNames.contains(STORE_QUEUE)) {
        db.createObjectStore(STORE_QUEUE, { keyPath: "id" })
      }
      if (!db.objectStoreNames.contains(STORE_DATA)) {
        db.createObjectStore(STORE_DATA, { keyPath: "key" })
      }
    }

    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

function promisifyRequest<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

function transactionComplete(tx: IDBTransaction): Promise<void> {
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
    tx.onabort = () => reject(tx.error)
  })
}

export async function initOfflineDB() {
  const db = await openDB()
  db.close()
}

export async function addQueueAction(action: OfflineAction) {
  const db = await openDB()
  const tx = db.transaction(STORE_QUEUE, "readwrite")
  tx.objectStore(STORE_QUEUE).put(action)
  await transactionComplete(tx)
  db.close()
}

export async function getQueueCount() {
  const db = await openDB()
  const tx = db.transaction(STORE_QUEUE, "readonly")
  const store = tx.objectStore(STORE_QUEUE)
  const countRequest = store.count()
  const count = await promisifyRequest<number>(countRequest)
  db.close()
  return count
}

export async function getPendingQueueActions() {
  const db = await openDB()
  const tx = db.transaction(STORE_QUEUE, "readonly")
  const store = tx.objectStore(STORE_QUEUE)
  const request = store.getAll()
  const actions = await promisifyRequest<OfflineAction[]>(request)
  db.close()
  return actions
}

export async function clearQueueAction(actionId: string) {
  const db = await openDB()
  const tx = db.transaction(STORE_QUEUE, "readwrite")
  tx.objectStore(STORE_QUEUE).delete(actionId)
  await transactionComplete(tx)
  db.close()
}

export async function clearAllQueue() {
  const db = await openDB()
  const tx = db.transaction(STORE_QUEUE, "readwrite")
  tx.objectStore(STORE_QUEUE).clear()
  await transactionComplete(tx)
  db.close()
}

export async function saveData<T>(key: string, value: T) {
  const db = await openDB()
  const tx = db.transaction(STORE_DATA, "readwrite")
  tx.objectStore(STORE_DATA).put({ key, value })
  await transactionComplete(tx)
  db.close()
}

export async function getData<T>(key: string): Promise<T | null> {
  const db = await openDB()
  const tx = db.transaction(STORE_DATA, "readonly")
  const request = tx.objectStore(STORE_DATA).get(key)
  const result = await promisifyRequest<{ key: string; value: T } | undefined>(request)
  db.close()
  return result?.value ?? null
}

export async function syncQueue() {
  const actions = await getPendingQueueActions()
  if (actions.length === 0) {
    return { synced: 0, errors: 0 }
  }

  const db = await openDB()
  const tx = db.transaction(STORE_QUEUE, "readwrite")
  const store = tx.objectStore(STORE_QUEUE)

  for (const action of actions) {
    store.delete(action.id)
  }

  await transactionComplete(tx)
  db.close()

  return { synced: actions.length, errors: 0 }
}
