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

