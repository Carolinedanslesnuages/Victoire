import type { ClosedCycle, Expense, Settings } from '../domain/types'
import { isClosedCycle, isExpense, isSettings, keepValid } from './guards'
import { readJson, removeKey, writeJson } from './storage'
import type { StorageBackend } from './storage'

const KEYS = {
  settings: 'settings',
  expenses: 'expenses',
  closedCycles: 'closed-cycles',
} as const

