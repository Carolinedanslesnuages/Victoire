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

