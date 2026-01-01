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

it('parses whole euros', () => {
  expect(parseEuros('12')).toBe(1200)
  expect(parseEuros('0')).toBe(0)
})

it('parses decimals with a comma or a dot', () => {
  expect(parseEuros('12,50')).toBe(1250)
  expect(parseEuros('12.5')).toBe(1250)
  expect(parseEuros('0,05')).toBe(5)
})

it('ignores spaces used as thousand separators', () => {
  expect(parseEuros('1 500')).toBe(150000)
})

it('rejects empty text, letters and negatives', () => {
  expect(parseEuros('')).toBeNull()
  expect(parseEuros('abc')).toBeNull()
  expect(parseEuros('-5')).toBeNull()
  expect(parseEuros('12€')).toBeNull()
})

it('rejects more than two decimals', () => {
  expect(parseEuros('1,234')).toBeNull()
})

