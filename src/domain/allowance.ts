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

