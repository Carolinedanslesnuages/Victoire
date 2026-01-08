import { computed, ref } from 'vue'
import { paydayToConfirm } from '../domain/cycle'
import { compareIsoDates, isValidIsoDate, localTodayIso } from '../domain/dates'
import { computeDayStatus, expensesInCycle } from '../domain/allowance'
import { proposeClosing } from '../domain/closing'
import { reviewCycles, totalSaved } from '../domain/review'
import type { CycleReview } from '../domain/review'
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

export type ExpenseFailure =
  | 'invalidAmount'
  | 'zeroAmount'
  | 'invalidDate'
  | 'futureDate'
  | 'outOfCycle'

export type AddExpenseResult = { ok: true } | { ok: false; reason: ExpenseFailure }

export interface ExpenseFields {
  amountText: string
  label: string
  date: IsoDate
}

type CheckedFields =
  | { ok: true; amountCents: number; label: string; date: IsoDate }
  | { ok: false; reason: ExpenseFailure }

export type RecordPaydayResult =
  | { ok: true }
  | { ok: false; reason: 'invalidDate' | 'futureDate' }

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
  const paydays = ref<IsoDate[]>(repositories.paydays.list())
  const today = ref<IsoDate>(localTodayIso(clock()))

  const status = computed<DayStatus | null>(() => {
    if (settings.value === null) {
      return null
    }
    return computeDayStatus({
      settings: settings.value,
      expenses: expenses.value,
      today: today.value,
      recordedPaydays: paydays.value,
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
      recordedPaydays: paydays.value,
    })
  })

  const reviews = computed<CycleReview[]>(() => {
    if (settings.value === null) {
      return []
    }
    return reviewCycles({
      settings: settings.value,
      expenses: expenses.value,
      closedCycles: closedCycles.value,
      today: today.value,
      recordedPaydays: paydays.value,
    })
  })

  const savedTotalCents = computed<number>(() => totalSaved(reviews.value))

  const paydayQuestion = computed<IsoDate | null>(() => {
    if (settings.value === null) {
      return null
    }
    return paydayToConfirm(today.value, settings.value.payday, paydays.value)
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

  function checkFields(fields: ExpenseFields): CheckedFields {
    const amountCents = parseEuros(fields.amountText)
    if (amountCents === null) {
      return { ok: false, reason: 'invalidAmount' }
    }
    if (amountCents === 0) {
      return { ok: false, reason: 'zeroAmount' }
    }
    if (!isValidIsoDate(fields.date)) {
      return { ok: false, reason: 'invalidDate' }
    }
    if (compareIsoDates(fields.date, today.value) > 0) {
      return { ok: false, reason: 'futureDate' }
    }
    const cycleStart = status.value?.bounds.start
    if (cycleStart !== undefined && compareIsoDates(fields.date, cycleStart) < 0) {
      return { ok: false, reason: 'outOfCycle' }
    }
    return { ok: true, amountCents, label: fields.label.trim(), date: fields.date }
  }

  function addExpense(
    amountText: string,
    label: string,
    date: IsoDate = today.value,
  ): AddExpenseResult {
    const checked = checkFields({ amountText, label, date })
    if (!checked.ok) {
      return checked
    }
    const entry: Expense = {
      identifier: createIdentifier(),
      date: checked.date,
      amountCents: checked.amountCents,
      label: checked.label,
    }
    expenses.value = [...expenses.value, entry]
    repositories.expenses.saveAll(expenses.value)
    return { ok: true }
  }

  function updateExpense(identifier: string, fields: ExpenseFields): AddExpenseResult {
    const checked = checkFields(fields)
    if (!checked.ok) {
      return checked
    }
    expenses.value = expenses.value.map((expense) =>
      expense.identifier === identifier
        ? { ...expense, date: checked.date, amountCents: checked.amountCents, label: checked.label }
        : expense,
    )
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

  function startWithRemaining(remainingCents: number, label: string): boolean {
    const current = status.value
    if (current === null) {
      return false
    }
    const spentCents = current.potCents - remainingCents
    if (spentCents <= 0) {
      return false
    }
    const entry: Expense = {
      identifier: createIdentifier(),
      date: current.bounds.start,
      amountCents: spentCents,
      label,
    }
    expenses.value = [...expenses.value, entry]
    repositories.expenses.saveAll(expenses.value)
    return true
  }

  function recordPayday(date: IsoDate): RecordPaydayResult {
    if (!isValidIsoDate(date)) {
      return { ok: false, reason: 'invalidDate' }
    }
    if (compareIsoDates(date, today.value) > 0) {
      return { ok: false, reason: 'futureDate' }
    }
    paydays.value = [...paydays.value.filter((recorded) => recorded !== date), date]
    repositories.paydays.saveAll(paydays.value)
    return { ok: true }
  }

  function exportBackup(): string {
    return createBackup(
      {
        settings: settings.value,
        expenses: expenses.value,
        closedCycles: closedCycles.value,
        paydays: paydays.value,
      },
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
    paydays.value = result.backup.paydays
    if (result.backup.settings !== null) {
      repositories.settings.save(result.backup.settings)
    }
    repositories.expenses.saveAll(expenses.value)
    repositories.closedCycles.saveAll(closedCycles.value)
    repositories.paydays.saveAll(paydays.value)
    return { ok: true }
  }

  function resetAll(): void {
    repositories.clear()
    settings.value = null
    expenses.value = []
    closedCycles.value = []
    paydays.value = []
  }

  return {
    settings,
    expenses,
    today,
    status,
    closingProposal,
    paydayQuestion,
    reviews,
    savedTotalCents,
    cycleExpenses,
    refreshToday,
    saveSettings,
    addExpense,
    updateExpense,
    removeExpense,
    decideClosing,
    startWithRemaining,
    recordPayday,
    exportBackup,
    importBackup,
    resetAll,
  }
}

export type AppState = ReturnType<typeof createAppState>
