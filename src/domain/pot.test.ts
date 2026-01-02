import { expect, it } from 'vitest'
import { computePot, evenDailyBudget, findSettingsProblems, savingsShare } from './pot'
import type { Settings } from './types'

const SETTINGS: Settings = {
  netIncomeCents: 300000,
  savingsCents: 50000,
  jointAccountCents: 150000,
  fixedCostsCents: 40000,
  payday: 5,
}

it('leaves 600 euros after savings, joint account and fixed costs', () => {
  expect(computePot(SETTINGS)).toBe(60000)
})

it('keeps everything when nothing is set aside', () => {
  const settings = { ...SETTINGS, savingsCents: 0, jointAccountCents: 0, fixedCostsCents: 0 }
  expect(computePot(settings)).toBe(300000)
})

it('finds no problem in a valid configuration', () => {
  expect(findSettingsProblems(SETTINGS)).toEqual([])
})

it('flags a missing income', () => {
  expect(findSettingsProblems({ ...SETTINGS, netIncomeCents: 0 })).toContain('incomeMissing')
})

it('flags negative amounts', () => {
  expect(findSettingsProblems({ ...SETTINGS, savingsCents: -1 })).toContain('negativeAmount')
})

it('flags a payday out of range', () => {
  expect(findSettingsProblems({ ...SETTINGS, payday: 0 })).toContain('paydayOutOfRange')
  expect(findSettingsProblems({ ...SETTINGS, payday: 32 })).toContain('paydayOutOfRange')
  expect(findSettingsProblems({ ...SETTINGS, payday: 2.5 })).toContain('paydayOutOfRange')
})

it('flags a pot that is not positive', () => {
  const settings = { ...SETTINGS, savingsCents: 110000 }
  expect(findSettingsProblems(settings)).toContain('potNotPositive')
})

it('computes the share of income that is saved', () => {
  expect(savingsShare(SETTINGS)).toBeCloseTo(0.1667, 3)
  expect(savingsShare({ ...SETTINGS, netIncomeCents: 0 })).toBe(0)
})

it('divides the pot evenly over the days of the cycle', () => {
  expect(evenDailyBudget(SETTINGS, 30)).toBe(2000)
  expect(evenDailyBudget(SETTINGS, 31)).toBe(1935)
  expect(evenDailyBudget(SETTINGS, 0)).toBe(0)
})
