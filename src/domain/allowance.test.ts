import { expect, it } from 'vitest'
import {
  computeDayStatus,
  expensesInCycle,
  gaugeFillRatio,
  gaugeLevel,
  totalOf,
} from './allowance'
import type { Expense, Settings } from './types'

const SETTINGS: Settings = {
  netIncomeCents: 300000,
  savingsCents: 50000,
  jointAccountCents: 150000,
  fixedCostsCents: 40000,
  payday: 5,
}

function expense(date: string, amountCents: number, identifier = `${date}-${amountCents}`): Expense {
  return { identifier, date, amountCents, label: '' }
}

it('adds up expenses', () => {
  expect(totalOf([])).toBe(0)
  expect(totalOf([expense('2026-01-06', 1000), expense('2026-01-07', 250)])).toBe(1250)
})

it('keeps only the expenses of the current cycle', () => {
  const bounds = { start: '2026-01-05', nextStart: '2026-02-05' }
  const kept = expensesInCycle(
    [expense('2026-01-04', 100), expense('2026-01-05', 200), expense('2026-02-05', 300)],
    bounds,
    '2026-02-01',
  )
  expect(kept.map((item) => item.amountCents)).toEqual([200])
})

it('ignores expenses dated after today', () => {
  const bounds = { start: '2026-01-05', nextStart: '2026-02-05' }
  const kept = expensesInCycle([expense('2026-01-11', 500)], bounds, '2026-01-10')
  expect(kept).toEqual([])
})

it('gives an even budget when nothing was spent', () => {
  const status = computeDayStatus({ settings: SETTINGS, expenses: [], today: '2026-01-10' })
  expect(status.daysLeft).toBe(26)
  expect(status.budgetTodayCents).toBe(2307)
  expect(status.remainingTodayCents).toBe(2307)
  expect(status.level).toBe('comfortable')
})

it('subtracts what was spent today without changing the daily budget', () => {
  const status = computeDayStatus({
    settings: SETTINGS,
    expenses: [expense('2026-01-10', 1000)],
    today: '2026-01-10',
  })
  expect(status.budgetTodayCents).toBe(2307)
  expect(status.remainingTodayCents).toBe(1307)
  expect(status.spentTodayCents).toBe(1000)
})

it('lowers the budget of the following days after a heavy day', () => {
  const status = computeDayStatus({
    settings: SETTINGS,
    expenses: [expense('2026-01-09', 3000)],
    today: '2026-01-10',
  })
  expect(status.budgetTodayCents).toBe(2192)
  expect(status.remainingCycleCents).toBe(57000)
})

it('raises the daily budget when earlier days were left unspent', () => {
  const firstDay = computeDayStatus({ settings: SETTINGS, expenses: [], today: '2026-01-05' })
  const laterDay = computeDayStatus({ settings: SETTINGS, expenses: [], today: '2026-01-10' })
  expect(firstDay.budgetTodayCents).toBe(1935)
  expect(laterDay.budgetTodayCents).toBe(2307)
})

it('ignores spending from the previous cycle', () => {
  const status = computeDayStatus({
    settings: SETTINGS,
    expenses: [expense('2026-01-04', 20000)],
    today: '2026-01-10',
  })
  expect(status.spentCycleCents).toBe(0)
})

it('turns to close when less than a fifth of the day is left', () => {
  const status = computeDayStatus({
    settings: SETTINGS,
    expenses: [expense('2026-01-10', 2000)],
    today: '2026-01-10',
  })
  expect(status.remainingTodayCents).toBe(307)
  expect(status.level).toBe('close')
})

it('turns to over when the daily budget is exceeded', () => {
  const status = computeDayStatus({
    settings: SETTINGS,
    expenses: [expense('2026-01-10', 3000)],
    today: '2026-01-10',
  })
  expect(status.remainingTodayCents).toBe(-693)
  expect(status.level).toBe('over')
})

it('turns to over when the whole pot is spent', () => {
  const status = computeDayStatus({
    settings: SETTINGS,
    expenses: [expense('2026-01-09', 60000)],
    today: '2026-01-10',
  })
  expect(status.budgetTodayCents).toBe(0)
  expect(status.level).toBe('over')
})

it('gives the whole remainder on the last day', () => {
  const status = computeDayStatus({
    settings: SETTINGS,
    expenses: [expense('2026-02-03', 50000)],
    today: '2026-02-04',
  })
  expect(status.daysLeft).toBe(1)
  expect(status.budgetTodayCents).toBe(10000)
})

it('classifies gauge levels', () => {
  expect(gaugeLevel(2000, 2000)).toBe('comfortable')
  expect(gaugeLevel(2000, 400)).toBe('close')
  expect(gaugeLevel(2000, 0)).toBe('close')
  expect(gaugeLevel(2000, -1)).toBe('over')
  expect(gaugeLevel(0, 0)).toBe('over')
})

it('clamps the gauge fill between zero and one', () => {
  const base = computeDayStatus({ settings: SETTINGS, expenses: [], today: '2026-01-10' })
  expect(gaugeFillRatio(base)).toBe(1)
  expect(gaugeFillRatio({ ...base, remainingTodayCents: -500 })).toBe(0)
  expect(gaugeFillRatio({ ...base, remainingTodayCents: base.budgetTodayCents / 2 })).toBeCloseTo(0.5)
  expect(gaugeFillRatio({ ...base, budgetTodayCents: 0 })).toBe(0)
})
