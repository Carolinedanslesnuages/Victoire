import { totalOf } from './allowance'
import { cycleBounds, isInCycle, previousCycleBounds } from './cycle'
import { computePot } from './pot'
import type { ClosedCycle, ClosingProposal, Expense, IsoDate, Settings } from './types'

export interface ClosingInput {
  settings: Settings
  expenses: readonly Expense[]
  closedCycles: readonly ClosedCycle[]
  today: IsoDate
}

export function proposeClosing(input: ClosingInput): ClosingProposal | null {
  const { settings, expenses, closedCycles, today } = input
  const current = cycleBounds(today, settings.payday)
  const previous = previousCycleBounds(current, settings.payday)

  if (closedCycles.some((cycle) => cycle.startDate === previous.start)) {
    return null
  }

  const previousExpenses = expenses.filter((expense) => isInCycle(expense.date, previous))
  if (previousExpenses.length === 0) {
    return null
  }

  const spentCents = totalOf(previousExpenses)
  const leftoverCents = computePot(settings) - spentCents
  if (leftoverCents <= 0) {
    return null
  }
  return { startDate: previous.start, endDate: previous.nextStart, spentCents, leftoverCents }
}
