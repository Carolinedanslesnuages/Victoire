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

