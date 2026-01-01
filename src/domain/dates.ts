import type { IsoDate } from './types'

const ISO_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/
const MILLISECONDS_PER_DAY = 86_400_000

function padNumber(value: number, length: number): string {
  return String(value).padStart(length, '0')
}

