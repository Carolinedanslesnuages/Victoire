import type { ClosedCycle, Expense, Settings } from '../domain/types'
import { isClosedCycle, isExpense, isSettings, keepValid } from './guards'
import { readJson, removeKey, writeJson } from './storage'
import type { StorageBackend } from './storage'

const KEYS = {
  settings: 'settings',
  expenses: 'expenses',
  closedCycles: 'closed-cycles',
} as const

export function createRepositories(backend: StorageBackend) {
  return {
    settings: {
      load(): Settings | null {
        const value = readJson<unknown>(backend, KEYS.settings, null)
        return isSettings(value) ? value : null
      },
      save(settings: Settings): boolean {
        return writeJson(backend, KEYS.settings, settings)
      },
    },
