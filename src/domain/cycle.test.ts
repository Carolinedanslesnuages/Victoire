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

