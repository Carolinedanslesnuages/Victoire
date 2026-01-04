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

  const settings = ref<Settings | null>(repositories.settings.load())
  const expenses = ref<Expense[]>(repositories.expenses.list())
  const closedCycles = ref<ClosedCycle[]>(repositories.closedCycles.list())
  const today = ref<IsoDate>(localTodayIso(clock()))

  const status = computed<DayStatus | null>(() => {
    if (settings.value === null) {
      return null
    }
    return computeDayStatus({
      settings: settings.value,
      expenses: expenses.value,
      today: today.value,
    })
  })

  const closingProposal = computed<ClosingProposal | null>(() => {
    if (settings.value === null) {
      return null
    }
    return proposeClosing({
      settings: settings.value,
      expenses: expenses.value,
      closedCycles: closedCycles.value,
      today: today.value,
    })
  })

  const cycleExpenses = computed<Expense[]>(() => {
    if (status.value === null) {
      return []
    }
    return expensesInCycle(expenses.value, status.value.bounds, today.value)
      .reverse()
      .sort((first, second) => compareIsoDates(second.date, first.date))
  })

  function refreshToday(): void {
    today.value = localTodayIso(clock())
  }

  function saveSettings(next: Settings): void {
    settings.value = next
    repositories.settings.save(next)
  }

  function addExpense(amountText: string, label: string): AddExpenseResult {
    const amountCents = parseEuros(amountText)
    if (amountCents === null) {
      return { ok: false, reason: 'invalidAmount' }
    }
    if (amountCents === 0) {
      return { ok: false, reason: 'zeroAmount' }
    }
    const entry: Expense = {
      identifier: createIdentifier(),
      date: today.value,
      amountCents,
      label: label.trim(),
    }
    expenses.value = [...expenses.value, entry]
    repositories.expenses.saveAll(expenses.value)
    return { ok: true }
  }

  function removeExpense(identifier: string): void {
    expenses.value = expenses.value.filter((expense) => expense.identifier !== identifier)
    repositories.expenses.saveAll(expenses.value)
  }

  function decideClosing(decision: ClosingDecision): void {
    const proposal = closingProposal.value
    if (proposal === null) {
      return
    }
    closedCycles.value = [
      ...closedCycles.value,
      { startDate: proposal.startDate, leftoverCents: proposal.leftoverCents, decision },
    ]
    repositories.closedCycles.saveAll(closedCycles.value)
  }

  function exportBackup(): string {
    return createBackup(
      { settings: settings.value, expenses: expenses.value, closedCycles: closedCycles.value },
      clock(),
    )
  }

  function importBackup(text: string): ImportResult {
    const result = parseBackup(text)
    if (!result.ok) {
      return result
    }
    settings.value = result.backup.settings
    expenses.value = result.backup.expenses
    closedCycles.value = result.backup.closedCycles
    if (result.backup.settings !== null) {
      repositories.settings.save(result.backup.settings)
    }
    repositories.expenses.saveAll(expenses.value)
    repositories.closedCycles.saveAll(closedCycles.value)
    return { ok: true }
  }

  function resetAll(): void {
    repositories.clear()
    settings.value = null
    expenses.value = []
    closedCycles.value = []
  }

