import { expect, it } from 'vitest'
import { BACKUP_VERSION, createBackup, parseBackup } from './backup'

const CONTENT = {
  settings: {
    netIncomeCents: 300000,
    savingsCents: 50000,
    jointAccountCents: 150000,
    fixedCostsCents: 40000,
    payday: 5,
  },
  expenses: [{ identifier: 'abc', date: '2026-01-05', amountCents: 1250, label: 'resto' }],
  closedCycles: [{ startDate: '2025-12-05', leftoverCents: 9000, decision: 'saved' as const }],
  paydays: ['2025-12-26'],
}

it('writes the version and the export date', () => {
  const text = createBackup(CONTENT, new Date('2026-01-05T10:00:00Z'))
  const parsed = JSON.parse(text)
  expect(parsed.version).toBe(BACKUP_VERSION)
  expect(parsed.exportedAt).toBe('2026-01-05T10:00:00.000Z')
})

it('restores what was exported', () => {
  const result = parseBackup(createBackup(CONTENT))
  expect(result.ok).toBe(true)
  if (result.ok) {
    expect(result.backup.settings).toEqual(CONTENT.settings)
    expect(result.backup.expenses).toEqual(CONTENT.expenses)
    expect(result.backup.closedCycles).toEqual(CONTENT.closedCycles)
    expect(result.backup.paydays).toEqual(CONTENT.paydays)
  }
})

it('refuses text that is not JSON', () => {
  expect(parseBackup('hello')).toEqual({ ok: false, reason: 'notJson' })
})

it('refuses JSON that is not an object', () => {
  expect(parseBackup('42')).toEqual({ ok: false, reason: 'invalidContent' })
  expect(parseBackup('null')).toEqual({ ok: false, reason: 'invalidContent' })
})

it('refuses an unknown version', () => {
  expect(parseBackup('{"version": 2}')).toEqual({ ok: false, reason: 'wrongVersion' })
})

it('refuses invalid settings', () => {
  const text = JSON.stringify({ version: 1, settings: { payday: 99 } })
  expect(parseBackup(text)).toEqual({ ok: false, reason: 'invalidContent' })
})

it('drops invalid entries and keeps the valid ones', () => {
  const text = JSON.stringify({
    version: 1,
    settings: null,
    expenses: [CONTENT.expenses[0], { identifier: '' }],
    closedCycles: 'broken',
  })
  const result = parseBackup(text)
  expect(result.ok).toBe(true)
  if (result.ok) {
    expect(result.backup.expenses).toEqual(CONTENT.expenses)
    expect(result.backup.closedCycles).toEqual([])
    expect(result.backup.settings).toBeNull()
  }
})
