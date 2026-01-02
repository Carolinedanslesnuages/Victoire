import { expect, it } from 'vitest'
import {
  cycleBounds,
  cycleLength,
  daysLeftInCycle,
  isInCycle,
  paydayInMonth,
  previousCycleBounds,
} from './cycle'

it('finds the payday of a month', () => {
  expect(paydayInMonth(2026, 1, 5)).toBe('2026-01-05')
})

it('clamps a payday to the last day of a short month', () => {
  expect(paydayInMonth(2026, 2, 31)).toBe('2026-02-28')
  expect(paydayInMonth(2028, 2, 31)).toBe('2028-02-29')
})

it('finds the cycle in the middle of a month', () => {
  expect(cycleBounds('2026-01-10', 5)).toEqual({ start: '2026-01-05', nextStart: '2026-02-05' })
})

it('starts a new cycle on payday', () => {
  const bounds = cycleBounds('2026-01-05', 5)
  expect(bounds.start).toBe('2026-01-05')
  expect(daysLeftInCycle('2026-01-05', bounds)).toBe(31)
})

it('stays in the previous cycle the day before payday', () => {
  const bounds = cycleBounds('2026-02-04', 5)
  expect(bounds).toEqual({ start: '2026-01-05', nextStart: '2026-02-05' })
  expect(daysLeftInCycle('2026-02-04', bounds)).toBe(1)
})

it('reaches back into the previous year', () => {
  const bounds = cycleBounds('2026-01-03', 5)
  expect(bounds).toEqual({ start: '2025-12-05', nextStart: '2026-01-05' })
  expect(daysLeftInCycle('2026-01-03', bounds)).toBe(2)
})

it('reaches forward into the next year', () => {
  expect(cycleBounds('2026-12-20', 5)).toEqual({ start: '2026-12-05', nextStart: '2027-01-05' })
})

it('handles a payday on the 31st', () => {
  const bounds = cycleBounds('2026-02-10', 31)
  expect(bounds).toEqual({ start: '2026-01-31', nextStart: '2026-02-28' })
  expect(daysLeftInCycle('2026-02-10', bounds)).toBe(18)
  expect(cycleLength(bounds)).toBe(28)
})

it('handles a payday on the 30th in a leap year', () => {
  expect(cycleBounds('2028-02-15', 30)).toEqual({ start: '2028-01-30', nextStart: '2028-02-29' })
})

it('counts the length of a cycle', () => {
  expect(cycleLength({ start: '2026-01-05', nextStart: '2026-02-05' })).toBe(31)
})

it('includes the first day of a cycle and excludes the next payday', () => {
  const bounds = { start: '2026-01-05', nextStart: '2026-02-05' }
  expect(isInCycle('2026-01-05', bounds)).toBe(true)
  expect(isInCycle('2026-02-04', bounds)).toBe(true)
  expect(isInCycle('2026-02-05', bounds)).toBe(false)
  expect(isInCycle('2026-01-04', bounds)).toBe(false)
})

