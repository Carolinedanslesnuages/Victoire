import type { IsoDate } from './types'

const ISO_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/
const MILLISECONDS_PER_DAY = 86_400_000

function padNumber(value: number, length: number): string {
  return String(value).padStart(length, '0')
}

export interface DateParts {
  year: number
  month: number
  day: number
}

export function toIsoDate(year: number, month: number, day: number): IsoDate {
  return `${padNumber(year, 4)}-${padNumber(month, 2)}-${padNumber(day, 2)}`
}

