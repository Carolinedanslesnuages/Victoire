import { expect, it } from 'vitest'
import { reviewCycles, totalSaved } from './review'
import type { ClosedCycle, Expense, Settings } from './types'

const SETTINGS: Settings = {
  netIncomeCents: 300000,
  savingsCents: 50000,
  jointAccountCents: 150000,
  fixedCostsCents: 40000,
  payday: 5,
}

function expense(date: string, amountCents: number): Expense {
  return { identifier: `${date}-${amountCents}`, date, amountCents, label: '' }
}

const TODAY = '2026-01-10'

it('reviews nothing when no expense was tracked', () => {
  expect(reviewCycles({ settings: SETTINGS, expenses: [], closedCycles: [], today: TODAY })).toEqual([])
})

it('ignores the cycle that is still running', () => {
  const reviews = reviewCycles({
    settings: SETTINGS,
    expenses: [expense('2026-01-08', 1000)],
    closedCycles: [],
    today: TODAY,
  })
  expect(reviews).toEqual([])
})

it('summarizes a finished cycle', () => {
  const [review] = reviewCycles({
    settings: SETTINGS,
    expenses: [expense('2025-12-10', 30000), expense('2025-12-20', 15000), expense('2026-01-08', 1000)],
    closedCycles: [],
    today: TODAY,
  })
  expect(review).toMatchObject({
    start: '2025-12-05',
    end: '2026-01-05',
    potCents: 60000,
    spentCents: 45000,
    leftoverCents: 15000,
    decision: null,
    savedExtraCents: 0,
    savedCents: 50000,
  })
})

it('counts the days that went over the daily budget', () => {
  const [review] = reviewCycles({
    settings: SETTINGS,
    expenses: [expense('2025-12-10', 30000), expense('2025-12-20', 15000)],
    closedCycles: [],
    today: TODAY,
  })
  expect(review.overspentDays).toBe(2)
})

it('counts no overspent day when spending stays calm', () => {
  const [review] = reviewCycles({
    settings: SETTINGS,
    expenses: [expense('2025-12-10', 1000), expense('2025-12-20', 1000)],
    closedCycles: [],
    today: TODAY,
  })
  expect(review.overspentDays).toBe(0)
})

it('adds the leftover that was moved to savings', () => {
  const closedCycles: ClosedCycle[] = [{ startDate: '2025-12-05', leftoverCents: 15000, decision: 'saved' }]
  const [review] = reviewCycles({
    settings: SETTINGS,
    expenses: [expense('2025-12-10', 45000)],
    closedCycles,
    today: TODAY,
  })
  expect(review.decision).toBe('saved')
  expect(review.savedExtraCents).toBe(15000)
  expect(review.savedCents).toBe(65000)
})

it('does not count a leftover that was not moved', () => {
  const closedCycles: ClosedCycle[] = [{ startDate: '2025-12-05', leftoverCents: 15000, decision: 'ignored' }]
  const [review] = reviewCycles({
    settings: SETTINGS,
    expenses: [expense('2025-12-10', 45000)],
    closedCycles,
    today: TODAY,
  })
  expect(review.savedCents).toBe(50000)
})

it('keeps the planned savings when the cycle was overspent', () => {
  const [review] = reviewCycles({
    settings: SETTINGS,
    expenses: [expense('2025-12-10', 70000)],
    closedCycles: [{ startDate: '2025-12-05', leftoverCents: 0, decision: 'saved' }],
    today: TODAY,
  })
  expect(review.leftoverCents).toBe(-10000)
  expect(review.savedCents).toBe(50000)
})

it('lists several cycles, the most recent first', () => {
  const reviews = reviewCycles({
    settings: SETTINGS,
    expenses: [expense('2025-11-10', 20000), expense('2025-12-10', 30000)],
    closedCycles: [],
    today: TODAY,
  })
  expect(reviews.map((review) => review.start)).toEqual(['2025-12-05', '2025-11-05'])
})

it('adds up what was saved', () => {
  const reviews = reviewCycles({
    settings: SETTINGS,
    expenses: [expense('2025-11-10', 20000), expense('2025-12-10', 30000)],
    closedCycles: [{ startDate: '2025-11-05', leftoverCents: 40000, decision: 'saved' }],
    today: TODAY,
  })
  expect(totalSaved(reviews)).toBe(50000 + 50000 + 40000)
  expect(totalSaved([])).toBe(0)
})
