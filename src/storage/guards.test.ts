import { expect, it } from 'vitest'
import { isClosedCycle, isExpense, isSettings, keepValid } from './guards'

const SETTINGS = {
  netIncomeCents: 300000,
  savingsCents: 50000,
  jointAccountCents: 150000,
  fixedCostsCents: 40000,
  payday: 5,
}

const EXPENSE = { identifier: 'abc', date: '2026-01-05', amountCents: 1250, label: 'resto' }

it('accepts valid settings', () => {
  expect(isSettings(SETTINGS)).toBe(true)
})

