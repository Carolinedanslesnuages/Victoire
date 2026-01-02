import {
  addDays,
  clampDayToMonth,
  compareIsoDates,
  diffInDays,
  parseIsoDate,
  shiftMonth,
  toIsoDate,
} from './dates'
import type { CycleBounds, IsoDate } from './types'

export function paydayInMonth(year: number, month: number, payday: number): IsoDate {
  return toIsoDate(year, month, clampDayToMonth(year, month, payday))
}

export function cycleBounds(today: IsoDate, payday: number): CycleBounds {
  const parts = parseIsoDate(today)
  if (!parts) {
    throw new RangeError(`Invalid ISO date: ${today}`)
  }
  const thisMonth = paydayInMonth(parts.year, parts.month, payday)

