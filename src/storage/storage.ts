export interface StorageBackend {
  getItem(key: string): string | null
  setItem(key: string, value: string): void
  removeItem(key: string): void
}

export const STORAGE_PREFIX = 'victoire:v1:'

export function createMemoryBackend(): StorageBackend {
  const items = new Map<string, string>()
  return {
    getItem: (key) => items.get(key) ?? null,
    setItem: (key, value) => {
      items.set(key, value)
    },
    removeItem: (key) => {
      items.delete(key)
    },
  }
}

export function resolveBackend(): StorageBackend {
  try {
    const probeKey = `${STORAGE_PREFIX}probe`
    window.localStorage.setItem(probeKey, '1')
    window.localStorage.removeItem(probeKey)
    return window.localStorage
  } catch {
    return createMemoryBackend()
  }
}

export function readJson<Value>(backend: StorageBackend, key: string, fallback: Value): Value {
  try {
    const raw = backend.getItem(STORAGE_PREFIX + key)
    return raw === null ? fallback : (JSON.parse(raw) as Value)
  } catch {
    return fallback
  }
}

export function writeJson(backend: StorageBackend, key: string, value: unknown): boolean {
  try {
    backend.setItem(STORAGE_PREFIX + key, JSON.stringify(value))
    return true
  } catch {
    return false
  }
}

export function removeKey(backend: StorageBackend, key: string): void {
  try {
    backend.removeItem(STORAGE_PREFIX + key)
  } catch {
    // Nothing to clean when the storage is unavailable.
  }
}
