import { expect, it } from 'vitest'
import {
  easterSunday,
  firstBusinessDayOnOrAfter,
  frenchPublicHolidays,
  isBusinessDay,
  isPublicHoliday,
} from './holidays'

it('finds the date of Easter', () => {
  expect(easterSunday(2026)).toBe('2026-04-05')
  expect(easterSunday(2027)).toBe('2027-03-28')
  expect(easterSunday(2028)).toBe('2028-04-16')
})

it('lists the fixed and the movable public holidays', () => {
  const holidays = frenchPublicHolidays(2026)
  expect(holidays.has('2026-01-01')).toBe(true)
  expect(holidays.has('2026-12-25')).toBe(true)
  expect(holidays.has('2026-04-06')).toBe(true)
  expect(holidays.has('2026-05-14')).toBe(true)
  expect(holidays.has('2026-05-25')).toBe(true)
  expect(holidays.size).toBe(11)
})

it('recognizes a public holiday', () => {
  expect(isPublicHoliday('2026-07-14')).toBe(true)
  expect(isPublicHoliday('2026-07-15')).toBe(false)
})

it('treats weekends and holidays as non-business days', () => {
  expect(isBusinessDay('2026-11-21')).toBe(false)
  expect(isBusinessDay('2026-11-22')).toBe(false)
  expect(isBusinessDay('2026-12-25')).toBe(false)
  expect(isBusinessDay('2026-11-25')).toBe(true)
})

it('moves to the next business day only when needed', () => {
  expect(firstBusinessDayOnOrAfter('2026-11-25')).toBe('2026-11-25')
  expect(firstBusinessDayOnOrAfter('2026-12-25')).toBe('2026-12-28')
  expect(firstBusinessDayOnOrAfter('2026-10-25')).toBe('2026-10-26')
})
