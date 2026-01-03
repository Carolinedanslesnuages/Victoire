import { expect, it } from 'vitest'
import { proposeClosing } from './closing'
import type { Expense, Settings } from './types'

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

it('proposes to save what was left of the previous cycle', () => {
  const proposal = proposeClosing({
    settings: SETTINGS,
    expenses: [expense('2026-01-12', 30000), expense('2026-01-20', 15000)],
    closedCycles: [],
    today: '2026-02-10',
  })
  expect(proposal).toEqual({
    startDate: '2026-01-05',
    endDate: '2026-02-05',
    spentCents: 45000,
    leftoverCents: 15000,
  })
})

it('proposes nothing when no expense was tracked', () => {
  const proposal = proposeClosing({
    settings: SETTINGS,
    expenses: [],
    closedCycles: [],
    today: '2026-02-10',
  })
  expect(proposal).toBeNull()
})

it('proposes nothing once the cycle was closed', () => {
  const proposal = proposeClosing({
    settings: SETTINGS,
    expenses: [expense('2026-01-12', 30000)],
    closedCycles: [{ startDate: '2026-01-05', leftoverCents: 30000, decision: 'saved' }],
    today: '2026-02-10',
  })
  expect(proposal).toBeNull()
})

it('proposes nothing when the whole pot was spent', () => {
  const proposal = proposeClosing({
    settings: SETTINGS,
    expenses: [expense('2026-01-12', 60000)],
    closedCycles: [],
    today: '2026-02-10',
  })
  expect(proposal).toBeNull()
})

it('ignores expenses of the current cycle', () => {
  const proposal = proposeClosing({
    settings: SETTINGS,
    expenses: [expense('2026-02-07', 1000)],
    closedCycles: [],
    today: '2026-02-10',
  })
  expect(proposal).toBeNull()
})
