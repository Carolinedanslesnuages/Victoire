import { computed, ref } from 'vue'
import { compareIsoDates, localTodayIso } from '../domain/dates'
import { computeDayStatus, expensesInCycle } from '../domain/allowance'
import { proposeClosing } from '../domain/closing'
import { parseEuros } from '../domain/money'
import type {
  ClosedCycle,
  ClosingDecision,
  ClosingProposal,
  DayStatus,
  Expense,
  IsoDate,
  Settings,
} from '../domain/types'
import { createBackup, parseBackup } from '../storage/backup'
import { createRepositories } from '../storage/repositories'
import type { StorageBackend } from '../storage/storage'

export type AddExpenseResult =
  | { ok: true }
  | { ok: false; reason: 'invalidAmount' | 'zeroAmount' }

export type ImportResult =
  | { ok: true }
  | { ok: false; reason: 'notJson' | 'wrongVersion' | 'invalidContent' }

function createIdentifier(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
}

export function createAppState(backend: StorageBackend, clock: () => Date = () => new Date()) {
  const repositories = createRepositories(backend)

