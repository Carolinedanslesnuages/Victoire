export const MAX_AMOUNT_CENTS = 100_000_000

export function sumCents(values: readonly number[]): number {
  return values.reduce((total, value) => total + value, 0)
}

export function normalizeAmountText(text: string): string {
  return text.replace(/\s/g, '').replace(',', '.')
}

const AMOUNT_PATTERN = /^\d+(\.\d{1,2})?$/

export function parseEuros(text: string): number | null {
  const normalized = normalizeAmountText(text)
  if (!AMOUNT_PATTERN.test(normalized)) {
    return null
  }
  const cents = Math.round(Number.parseFloat(normalized) * 100)
  return cents > MAX_AMOUNT_CENTS ? null : cents
}

