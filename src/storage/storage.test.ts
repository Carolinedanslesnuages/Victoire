import { expect, it } from 'vitest'
import {
  STORAGE_PREFIX,
  createMemoryBackend,
  readJson,
  removeKey,
  resolveBackend,
  writeJson,
} from './storage'
import type { StorageBackend } from './storage'

it('keeps values in the memory backend', () => {
  const backend = createMemoryBackend()
  expect(backend.getItem('missing')).toBeNull()
  backend.setItem('key', 'value')
  expect(backend.getItem('key')).toBe('value')
  backend.removeItem('key')
  expect(backend.getItem('key')).toBeNull()
})

