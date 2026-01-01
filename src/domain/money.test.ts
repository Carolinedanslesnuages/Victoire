import { expect, it } from 'vitest'
import {
  MAX_AMOUNT_CENTS,
  formatEditableEuros,
  formatEuros,
  normalizeAmountText,
  parseEuros,
  sumCents,
} from './money'

it('keeps the upper bound at one million euros', () => {
  expect(MAX_AMOUNT_CENTS).toBe(100_000_000)
})

it('sums cents', () => {
  expect(sumCents([])).toBe(0)
  expect(sumCents([150, 250, 100])).toBe(500)
})

it('normalizes commas and spaces', () => {
  expect(normalizeAmountText(' 1 200,5 ')).toBe('1200.5')
})

