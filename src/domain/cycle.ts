import {
  addDays,
  clampDayToMonth,
  compareIsoDates,
  diffInDays,
  parseIsoDate,
  shiftMonth,
  toIsoDate,
} from './dates'
import { firstBusinessDayOnOrAfter } from './holidays'
import type { CycleBounds, IsoDate } from './types'

const MATCH_WINDOW_DAYS = 10
const CONFIRMATION_DAYS_BEFORE = 3

export function paydayInMonth(year: number, month: number, payday: number): IsoDate {
  return toIsoDate(year, month, clampDayToMonth(year, month, payday))
}

function recordedNear(nominal: IsoDate, recordedPaydays: readonly IsoDate[]): IsoDate[] {
  return recordedPaydays.filter((recorded) => Math.abs(diffInDays(nominal, recorded)) <= MATCH_WINDOW_DAYS)
}

export function effectivePayday(
  year: number,
  month: number,
  payday: number,
  recordedPaydays: readonly IsoDate[],
): IsoDate {
  const nominal = paydayInMonth(year, month, payday)
  const matches = recordedNear(nominal, recordedPaydays)
  if (matches.length > 0) {
    return matches.reduce((latest, date) => (compareIsoDates(date, latest) > 0 ? date : latest))
  }
  return firstBusinessDayOnOrAfter(nominal)
}

export function cycleBounds(
  today: IsoDate,
  payday: number,
  recordedPaydays: readonly IsoDate[] = [],
): CycleBounds {
  const parts = parseIsoDate(today)
  if (!parts) {
    throw new RangeError(`Invalid ISO date: ${today}`)
  }
  const candidates = [-1, 0, 1, 2].map((delta) => {
    const shifted = shiftMonth(parts.year, parts.month, delta)
    return effectivePayday(shifted.year, shifted.month, payday, recordedPaydays)
  })
  const start = candidates.filter((candidate) => compareIsoDates(candidate, today) <= 0).pop()
  const nextStart = candidates.find((candidate) => compareIsoDates(candidate, today) > 0)
  if (start === undefined || nextStart === undefined) {
    throw new RangeError(`No pay cycle found around ${today}`)
  }
  return { start, nextStart }
}

export function paydayToConfirm(
  today: IsoDate,
  payday: number,
  recordedPaydays: readonly IsoDate[],
): IsoDate | null {
  const parts = parseIsoDate(today)
  if (!parts) {
    return null
  }
  for (const delta of [-1, 0, 1]) {
    const shifted = shiftMonth(parts.year, parts.month, delta)
    const nominal = paydayInMonth(shifted.year, shifted.month, payday)
    const offset = diffInDays(nominal, today)
    const inWindow = offset >= -CONFIRMATION_DAYS_BEFORE && offset <= MATCH_WINDOW_DAYS
    if (inWindow && recordedNear(nominal, recordedPaydays).length === 0) {
      return nominal
    }
  }
  return null
}

export function daysLeftInCycle(today: IsoDate, bounds: CycleBounds): number {
  return diffInDays(today, bounds.nextStart)
}

export function cycleLength(bounds: CycleBounds): number {
  return diffInDays(bounds.start, bounds.nextStart)
}

export function isInCycle(date: IsoDate, bounds: CycleBounds): boolean {
  return compareIsoDates(date, bounds.start) >= 0 && compareIsoDates(date, bounds.nextStart) < 0
}

export function previousCycleBounds(
  bounds: CycleBounds,
  payday: number,
  recordedPaydays: readonly IsoDate[] = [],
): CycleBounds {
  return cycleBounds(addDays(bounds.start, -1), payday, recordedPaydays)
}
