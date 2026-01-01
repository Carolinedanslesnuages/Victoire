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

