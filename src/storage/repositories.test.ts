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

