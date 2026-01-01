export const MAX_AMOUNT_CENTS = 100_000_000

export function sumCents(values: readonly number[]): number {
  return values.reduce((total, value) => total + value, 0)
}

