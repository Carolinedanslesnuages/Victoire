import { expect, it } from 'vitest'
import { createMemoryBackend } from '../storage/storage'
import { createAppState } from './app-state'

const SETTINGS = {
  netIncomeCents: 300000,
  savingsCents: 50000,
  jointAccountCents: 150000,
  fixedCostsCents: 40000,
  payday: 5,
}

function stateOn(day: number, backend = createMemoryBackend()) {
  return createAppState(backend, () => new Date(2026, 0, day, 12, 0))
}

it('starts without settings and without status', () => {
  const state = stateOn(10)
  expect(state.settings.value).toBeNull()
  expect(state.status.value).toBeNull()
})

it('computes the status once the settings are saved', () => {
  const state = stateOn(10)
  state.saveSettings(SETTINGS)
  expect(state.status.value?.remainingTodayCents).toBe(2307)
})

it('adds an expense dated today', () => {
  const state = stateOn(10)
  state.saveSettings(SETTINGS)
  expect(state.addExpense('12,50', ' resto ')).toEqual({ ok: true })
  expect(state.expenses.value[0]).toMatchObject({ date: '2026-01-10', amountCents: 1250, label: 'resto' })
  expect(state.status.value?.remainingTodayCents).toBe(1057)
})

it('refuses an invalid or null amount', () => {
  const state = stateOn(10)
  state.saveSettings(SETTINGS)
  expect(state.addExpense('abc', '')).toEqual({ ok: false, reason: 'invalidAmount' })
  expect(state.addExpense('0', '')).toEqual({ ok: false, reason: 'zeroAmount' })
  expect(state.expenses.value).toHaveLength(0)
})

