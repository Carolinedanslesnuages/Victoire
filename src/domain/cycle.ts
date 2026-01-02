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

