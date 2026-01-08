import { expect, it } from 'vitest'
import {
  addDays,
  clampDayToMonth,
  compareIsoDates,
  dayOfWeek,
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

it('adds days across month and year boundaries', () => {
  expect(addDays('2026-01-31', 1)).toBe('2026-02-01')
  expect(addDays('2025-12-31', 1)).toBe('2026-01-01')
  expect(addDays('2026-01-01', -1)).toBe('2025-12-31')
})

it('counts the days between two dates', () => {
  expect(diffInDays('2026-01-10', '2026-02-05')).toBe(26)
  expect(diffInDays('2026-01-10', '2026-01-10')).toBe(0)
  expect(diffInDays('2026-02-05', '2026-01-10')).toBe(-26)
})

it('is not affected by daylight saving time', () => {
  expect(diffInDays('2026-03-28', '2026-03-30')).toBe(2)
  expect(diffInDays('2026-10-24', '2026-10-26')).toBe(2)
})

it('clamps a day to the end of a short month', () => {
  expect(clampDayToMonth(2026, 2, 31)).toBe(28)
  expect(clampDayToMonth(2028, 2, 31)).toBe(29)
  expect(clampDayToMonth(2026, 3, 31)).toBe(31)
})

it('shifts months across years', () => {
  expect(shiftMonth(2026, 1, -1)).toEqual({ year: 2025, month: 12 })
  expect(shiftMonth(2026, 12, 1)).toEqual({ year: 2027, month: 1 })
  expect(shiftMonth(2026, 6, 0)).toEqual({ year: 2026, month: 6 })
})

it('reads the local calendar date', () => {
  expect(localTodayIso(new Date(2026, 0, 5, 23, 59))).toBe('2026-01-05')
})

it('compares ISO dates', () => {
  expect(compareIsoDates('2026-01-05', '2026-01-06')).toBe(-1)
  expect(compareIsoDates('2026-01-06', '2026-01-05')).toBe(1)
  expect(compareIsoDates('2026-01-05', '2026-01-05')).toBe(0)
})

it('finds the day of the week', () => {
  expect(dayOfWeek('2026-01-05')).toBe(1)
  expect(dayOfWeek('2026-01-04')).toBe(0)
  expect(dayOfWeek('2026-01-10')).toBe(6)
})
