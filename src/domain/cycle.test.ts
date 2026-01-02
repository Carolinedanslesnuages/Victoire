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

