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

it('writes and reads JSON under the namespace', () => {
  const backend = createMemoryBackend()
  expect(writeJson(backend, 'sample', { amount: 5 })).toBe(true)
  expect(backend.getItem(`${STORAGE_PREFIX}sample`)).toBe('{"amount":5}')
  expect(readJson(backend, 'sample', null)).toEqual({ amount: 5 })
})

it('returns the fallback when nothing is stored', () => {
  expect(readJson(createMemoryBackend(), 'missing', 42)).toBe(42)
})

it('returns the fallback when the content is corrupted', () => {
  const backend = createMemoryBackend()
  backend.setItem(`${STORAGE_PREFIX}broken`, '{not json')
  expect(readJson(backend, 'broken', 'fallback')).toBe('fallback')
})

it('reports a failure when the storage refuses a write', () => {
  const full: StorageBackend = {
    getItem: () => null,
    setItem: () => {
      throw new Error('quota exceeded')
    },
    removeItem: () => undefined,
  }
  expect(writeJson(full, 'sample', 1)).toBe(false)
})

it('removes a stored key', () => {
  const backend = createMemoryBackend()
  writeJson(backend, 'sample', 1)
  removeKey(backend, 'sample')
  expect(readJson(backend, 'sample', 'gone')).toBe('gone')
})

it('resolves a working backend in the browser', () => {
  const backend = resolveBackend()
  backend.setItem('probe-check', 'ok')
  expect(backend.getItem('probe-check')).toBe('ok')
  backend.removeItem('probe-check')
})
