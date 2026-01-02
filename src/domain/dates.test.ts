import { expect, it } from 'vitest'
import {
  addDays,
  clampDayToMonth,
  compareIsoDates,
  daysInMonth,
  diffInDays,
  isValidIsoDate,
  localTodayIso,
  parseIsoDate,
  shiftMonth,
  toIsoDate,
} from './dates'

it('builds padded ISO dates', () => {
  expect(toIsoDate(2026, 1, 5)).toBe('2026-01-05')
})

it('parses valid dates', () => {
  expect(parseIsoDate('2026-01-05')).toEqual({ year: 2026, month: 1, day: 5 })
})

it('rejects malformed text', () => {
  expect(parseIsoDate('2026-1-5')).toBeNull()
  expect(parseIsoDate('hello')).toBeNull()
})

