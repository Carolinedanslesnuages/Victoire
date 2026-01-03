import { compareIsoDates } from './dates'
import { cycleBounds, daysLeftInCycle, isInCycle } from './cycle'
import { computePot } from './pot'
import { sumCents } from './money'
import type { CycleBounds, DayStatus, Expense, GaugeLevel, IsoDate, Settings } from './types'

const CLOSE_THRESHOLD = 0.2

export function expensesInCycle(
  expenses: readonly Expense[],
  bounds: CycleBounds,
  today: IsoDate,
): Expense[] {
  return expenses.filter(
    (expense) => isInCycle(expense.date, bounds) && compareIsoDates(expense.date, today) <= 0,
  )
}

export function totalOf(expenses: readonly Expense[]): number {
  return sumCents(expenses.map((expense) => expense.amountCents))
}

export function gaugeLevel(budgetTodayCents: number, remainingTodayCents: number): GaugeLevel {
  if (budgetTodayCents <= 0 || remainingTodayCents < 0) {
    return 'over'
  }
  return remainingTodayCents <= budgetTodayCents * CLOSE_THRESHOLD ? 'close' : 'comfortable'
}

export function gaugeFillRatio(status: DayStatus): number {
  if (status.budgetTodayCents <= 0) {
    return 0
  }
  const ratio = status.remainingTodayCents / status.budgetTodayCents
  return Math.min(1, Math.max(0, ratio))
}

export interface DayStatusInput {
  settings: Settings
  expenses: readonly Expense[]
  today: IsoDate
}

export function computeDayStatus(input: DayStatusInput): DayStatus {
  const { settings, expenses, today } = input
  const bounds = cycleBounds(today, settings.payday)
  const potCents = computePot(settings)
  const cycleExpenses = expensesInCycle(expenses, bounds, today)

  const spentTodayCents = totalOf(cycleExpenses.filter((expense) => expense.date === today))
  const spentCycleCents = totalOf(cycleExpenses)
  const spentBeforeTodayCents = spentCycleCents - spentTodayCents

