import { expect, it } from 'vitest'
import {
  cycleBounds,
  cycleLength,
  daysLeftInCycle,
  isInCycle,
  paydayInMonth,
  paydayToConfirm,
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
  expect(cycleBounds('2026-12-20', 5)).toEqual({ start: '2026-12-07', nextStart: '2027-01-05' })
})

it('handles a payday on the 31st', () => {
  const bounds = cycleBounds('2026-02-10', 31)
  expect(bounds).toEqual({ start: '2026-02-02', nextStart: '2026-03-02' })
  expect(daysLeftInCycle('2026-02-10', bounds)).toBe(20)
  expect(cycleLength(bounds)).toBe(28)
})

it('handles a payday on the 30th in a leap year', () => {
  expect(cycleBounds('2028-02-15', 30)).toEqual({ start: '2028-01-31', nextStart: '2028-02-29' })
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

it('finds the previous cycle', () => {
  const bounds = { start: '2026-01-05', nextStart: '2026-02-05' }
  expect(previousCycleBounds(bounds, 5)).toEqual({ start: '2025-12-05', nextStart: '2026-01-05' })
})

it('estimates the payday on the next business day when it falls on a weekend', () => {
  expect(cycleBounds('2026-11-23', 25)).toEqual({ start: '2026-10-26', nextStart: '2026-11-25' })
})

it('moves a payday that falls on a public holiday to the following business day', () => {
  expect(cycleBounds('2026-12-27', 25)).toEqual({ start: '2026-11-25', nextStart: '2026-12-28' })
  expect(cycleBounds('2026-12-28', 25).start).toBe('2026-12-28')
})

it('starts the cycle on a recorded payday that came earlier than estimated', () => {
  const recorded = ['2026-12-24']
  expect(cycleBounds('2026-12-23', 25, recorded)).toEqual({ start: '2026-11-25', nextStart: '2026-12-24' })
  expect(cycleBounds('2026-12-24', 25, recorded)).toEqual({ start: '2026-12-24', nextStart: '2027-01-25' })
})

it('starts the cycle on a recorded payday that came later than estimated', () => {
  const recorded = ['2026-12-29']
  expect(cycleBounds('2026-12-28', 25, recorded)).toEqual({ start: '2026-11-25', nextStart: '2026-12-29' })
})

it('asks for the real payday shortly before and after the expected date', () => {
  expect(paydayToConfirm('2026-11-23', 25, [])).toBe('2026-11-25')
  expect(paydayToConfirm('2026-12-05', 25, [])).toBe('2026-11-25')
  expect(paydayToConfirm('2026-12-06', 25, [])).toBeNull()
  expect(paydayToConfirm('2026-11-20', 25, [])).toBeNull()
})

it('stops asking once the payday is recorded', () => {
  expect(paydayToConfirm('2026-11-26', 25, ['2026-11-25'])).toBeNull()
})
