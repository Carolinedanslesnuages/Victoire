import { computeDayStatus, totalOf } from './allowance'
import { cycleBounds, isInCycle, previousCycleBounds } from './cycle'
import { addDays, compareIsoDates } from './dates'
import { computePot } from './pot'
import type { ClosedCycle, ClosingDecision, CycleBounds, Expense, IsoDate, Settings } from './types'

const MAX_REVIEWED_CYCLES = 36

export interface CycleReview {
  start: IsoDate
  end: IsoDate
  potCents: number
  spentCents: number
  leftoverCents: number
  overspentDays: number
  decision: ClosingDecision | null
  savedExtraCents: number
  savedCents: number
}

export interface ReviewInput {
  settings: Settings
  expenses: readonly Expense[]
  closedCycles: readonly ClosedCycle[]
  today: IsoDate
  recordedPaydays?: readonly IsoDate[]
}

function countOverspentDays(input: ReviewInput, bounds: CycleBounds): number {
  let count = 0
  for (let day = bounds.start; compareIsoDates(day, bounds.nextStart) < 0; day = addDays(day, 1)) {
    const status = computeDayStatus({
      settings: input.settings,
      expenses: input.expenses,
      today: day,
      recordedPaydays: input.recordedPaydays,
    })
    if (status.remainingTodayCents < 0) {
      count += 1
    }
  }
  return count
}

function reviewOf(input: ReviewInput, bounds: CycleBounds, cycleExpenses: Expense[]): CycleReview {
  const potCents = computePot(input.settings)
  const spentCents = totalOf(cycleExpenses)
  const leftoverCents = potCents - spentCents
  const closed = input.closedCycles.find((cycle) => cycle.startDate === bounds.start)
  const decision = closed?.decision ?? null
  const savedExtraCents = decision === 'saved' ? Math.max(leftoverCents, 0) : 0
  return {
    start: bounds.start,
    end: bounds.nextStart,
    potCents,
    spentCents,
    leftoverCents,
    overspentDays: countOverspentDays(input, bounds),
    decision,
    savedExtraCents,
    savedCents: input.settings.savingsCents + savedExtraCents,
  }
}

export function reviewCycles(input: ReviewInput): CycleReview[] {
  if (input.expenses.length === 0) {
    return []
  }
  const recordedPaydays = input.recordedPaydays ?? []
  const earliest = input.expenses
    .map((expense) => expense.date)
    .reduce((first, date) => (compareIsoDates(date, first) < 0 ? date : first))
  const payday = input.settings.payday
  const reviews: CycleReview[] = []
  let bounds = previousCycleBounds(cycleBounds(input.today, payday, recordedPaydays), payday, recordedPaydays)
  for (let count = 0; count < MAX_REVIEWED_CYCLES; count += 1) {
    if (compareIsoDates(bounds.nextStart, earliest) <= 0) {
      break
    }
    const cycleExpenses = input.expenses.filter((expense) => isInCycle(expense.date, bounds))
    if (cycleExpenses.length > 0) {
      reviews.push(reviewOf(input, bounds, cycleExpenses))
    }
    bounds = previousCycleBounds(bounds, payday, recordedPaydays)
  }
  return reviews
}

export function totalSaved(reviews: readonly CycleReview[]): number {
  return reviews.reduce((total, review) => total + review.savedCents, 0)
}
