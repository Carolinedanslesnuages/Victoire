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

it('removes an expense', () => {
  const state = stateOn(10)
  state.saveSettings(SETTINGS)
  state.addExpense('5', '')
  state.removeExpense(state.expenses.value[0].identifier)
  expect(state.expenses.value).toEqual([])
})

it('lists the newest expenses first', () => {
  const backend = createMemoryBackend()
  const first = stateOn(9, backend)
  first.saveSettings(SETTINGS)
  first.addExpense('3', 'yesterday')
  const second = stateOn(10, backend)
  second.addExpense('4', 'earlier today')
  second.addExpense('5', 'later today')
  expect(second.cycleExpenses.value.map((item) => item.label)).toEqual([
    'later today',
    'earlier today',
    'yesterday',
  ])
})

it('restores everything after a restart', () => {
  const backend = createMemoryBackend()
  const first = stateOn(10, backend)
  first.saveSettings(SETTINGS)
  first.addExpense('8', 'coffee')
  const restarted = stateOn(10, backend)
  expect(restarted.settings.value).toEqual(SETTINGS)
  expect(restarted.expenses.value).toHaveLength(1)
})

it('moves to the next day when the date is refreshed', () => {
  let day = 10
  const state = createAppState(createMemoryBackend(), () => new Date(2026, 0, day, 12, 0))
  state.saveSettings(SETTINGS)
  day = 11
  state.refreshToday()
  expect(state.today.value).toBe('2026-01-11')
})

it('proposes the leftover once a cycle is over, then remembers the decision', () => {
  const backend = createMemoryBackend()
  const january = stateOn(20, backend)
  january.saveSettings(SETTINGS)
  january.addExpense('450', 'month of spending')
  const february = createAppState(backend, () => new Date(2026, 1, 10, 12, 0))
  expect(february.closingProposal.value?.leftoverCents).toBe(15000)
  february.decideClosing('saved')
  expect(february.closingProposal.value).toBeNull()
  const restarted = createAppState(backend, () => new Date(2026, 1, 10, 12, 0))
  expect(restarted.closingProposal.value).toBeNull()
})

it('exports and imports a backup', () => {
  const source = stateOn(10)
  source.saveSettings(SETTINGS)
  source.addExpense('7', 'book')
  const target = stateOn(10)
  expect(target.importBackup(source.exportBackup())).toEqual({ ok: true })
  expect(target.settings.value).toEqual(SETTINGS)
  expect(target.expenses.value).toHaveLength(1)
})

it('refuses a broken backup and keeps the data', () => {
  const state = stateOn(10)
  state.saveSettings(SETTINGS)
  expect(state.importBackup('not json')).toEqual({ ok: false, reason: 'notJson' })
  expect(state.settings.value).toEqual(SETTINGS)
})

