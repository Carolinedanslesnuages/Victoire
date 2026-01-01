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

