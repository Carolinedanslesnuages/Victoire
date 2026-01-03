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

