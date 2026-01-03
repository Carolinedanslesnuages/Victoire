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

it('rejects incomplete or malformed settings', () => {
  expect(isSettings(null)).toBe(false)
  expect(isSettings({})).toBe(false)
  expect(isSettings({ ...SETTINGS, payday: 40 })).toBe(false)
  expect(isSettings({ ...SETTINGS, savingsCents: 1.5 })).toBe(false)
  expect(isSettings({ ...SETTINGS, netIncomeCents: '3000' })).toBe(false)
})

it('accepts valid expenses', () => {
  expect(isExpense(EXPENSE)).toBe(true)
})

it('rejects malformed expenses', () => {
  expect(isExpense({ ...EXPENSE, date: '2026-02-30' })).toBe(false)
  expect(isExpense({ ...EXPENSE, identifier: '' })).toBe(false)
  expect(isExpense({ ...EXPENSE, amountCents: -5 })).toBe(false)
  expect(isExpense('expense')).toBe(false)
})

