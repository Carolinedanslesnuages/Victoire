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

it('rejects impossible dates', () => {
  expect(isValidIsoDate('2026-02-30')).toBe(false)
  expect(isValidIsoDate('2026-13-01')).toBe(false)
  expect(isValidIsoDate('2026-02-28')).toBe(true)
})

it('counts days in a month', () => {
  expect(daysInMonth(2026, 1)).toBe(31)
  expect(daysInMonth(2026, 2)).toBe(28)
  expect(daysInMonth(2028, 2)).toBe(29)
  expect(daysInMonth(2026, 4)).toBe(30)
})

it('adds days inside a month', () => {
  expect(addDays('2026-01-05', 3)).toBe('2026-01-08')
})

