import { expect, it } from 'vitest'
import { formatDayMonth, formatLongDate } from './format'

it('writes a date with its weekday', () => {
  expect(formatLongDate('2026-01-05')).toBe('lundi 5 janvier')
})

