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

  if (compareIsoDates(thisMonth, today) <= 0) {
    const next = shiftMonth(parts.year, parts.month, 1)
    return { start: thisMonth, nextStart: paydayInMonth(next.year, next.month, payday) }
  }

  const previous = shiftMonth(parts.year, parts.month, -1)
  return { start: paydayInMonth(previous.year, previous.month, payday), nextStart: thisMonth }
}

export function daysLeftInCycle(today: IsoDate, bounds: CycleBounds): number {
  return diffInDays(today, bounds.nextStart)
}

export function cycleLength(bounds: CycleBounds): number {
  return diffInDays(bounds.start, bounds.nextStart)
}

