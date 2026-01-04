import { expect, it } from 'vitest'
import { createRepositories } from './repositories'
import { STORAGE_PREFIX, createMemoryBackend } from './storage'

const SETTINGS = {
  netIncomeCents: 300000,
  savingsCents: 50000,
  jointAccountCents: 150000,
  fixedCostsCents: 40000,
  payday: 5,
}

const EXPENSE = { identifier: 'abc', date: '2026-01-05', amountCents: 1250, label: 'resto' }

it('starts without settings and without expenses', () => {
  const repositories = createRepositories(createMemoryBackend())
  expect(repositories.settings.load()).toBeNull()
  expect(repositories.expenses.list()).toEqual([])
  expect(repositories.closedCycles.list()).toEqual([])
})

it('persists the settings', () => {
  const backend = createMemoryBackend()
  createRepositories(backend).settings.save(SETTINGS)
  expect(createRepositories(backend).settings.load()).toEqual(SETTINGS)
})

it('persists the expenses', () => {
  const backend = createMemoryBackend()
  createRepositories(backend).expenses.saveAll([EXPENSE])
  expect(createRepositories(backend).expenses.list()).toEqual([EXPENSE])
})

it('persists the closed cycles', () => {
  const backend = createMemoryBackend()
  const cycle = { startDate: '2025-12-05', leftoverCents: 9000, decision: 'saved' as const }
  createRepositories(backend).closedCycles.saveAll([cycle])
  expect(createRepositories(backend).closedCycles.list()).toEqual([cycle])
})

