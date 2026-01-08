import type { ClosedCycle, Expense, IsoDate, Settings } from '../domain/types'
import { isClosedCycle, isExpense, isIsoDateString, isSettings, keepValid } from './guards'
import { readJson, removeKey, writeJson } from './storage'
import type { StorageBackend } from './storage'

const KEYS = {
  settings: 'settings',
  expenses: 'expenses',
  closedCycles: 'closed-cycles',
  paydays: 'paydays',
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
    expenses: {
      list(): Expense[] {
        return keepValid(readJson<unknown>(backend, KEYS.expenses, []), isExpense)
      },
      saveAll(expenses: readonly Expense[]): boolean {
        return writeJson(backend, KEYS.expenses, expenses)
      },
    },
    closedCycles: {
      list(): ClosedCycle[] {
        return keepValid(readJson<unknown>(backend, KEYS.closedCycles, []), isClosedCycle)
      },
      saveAll(cycles: readonly ClosedCycle[]): boolean {
        return writeJson(backend, KEYS.closedCycles, cycles)
      },
    },
    paydays: {
      list(): IsoDate[] {
        return keepValid(readJson<unknown>(backend, KEYS.paydays, []), isIsoDateString)
      },
      saveAll(paydays: readonly IsoDate[]): boolean {
        return writeJson(backend, KEYS.paydays, paydays)
      },
    },
    clear(): void {
      removeKey(backend, KEYS.settings)
      removeKey(backend, KEYS.expenses)
      removeKey(backend, KEYS.closedCycles)
      removeKey(backend, KEYS.paydays)
    },
  }
}

export type Repositories = ReturnType<typeof createRepositories>
