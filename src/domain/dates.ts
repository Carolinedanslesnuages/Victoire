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

export function parseIsoDate(value: string): DateParts | null {
  const match = ISO_PATTERN.exec(value)
  if (!match) {
    return null
  }
  const parts = { year: Number(match[1]), month: Number(match[2]), day: Number(match[3]) }
  const rebuilt = new Date(Date.UTC(parts.year, parts.month - 1, parts.day))
  const sameDate =
    rebuilt.getUTCFullYear() === parts.year &&
    rebuilt.getUTCMonth() === parts.month - 1 &&
    rebuilt.getUTCDate() === parts.day
  return sameDate ? parts : null
}

export function isValidIsoDate(value: string): boolean {
  return parseIsoDate(value) !== null
}

export function daysInMonth(year: number, month: number): number {
  return new Date(Date.UTC(year, month, 0)).getUTCDate()
}

function toUtcTime(value: IsoDate): number {
  const parts = parseIsoDate(value)
  if (!parts) {
    throw new RangeError(`Invalid ISO date: ${value}`)
  }
  return Date.UTC(parts.year, parts.month - 1, parts.day)
}

export function addDays(value: IsoDate, count: number): IsoDate {
  const shifted = new Date(toUtcTime(value) + count * MILLISECONDS_PER_DAY)
  return toIsoDate(shifted.getUTCFullYear(), shifted.getUTCMonth() + 1, shifted.getUTCDate())
}

export function diffInDays(from: IsoDate, to: IsoDate): number {
  return Math.round((toUtcTime(to) - toUtcTime(from)) / MILLISECONDS_PER_DAY)
}

export function clampDayToMonth(year: number, month: number, day: number): number {
  return Math.min(day, daysInMonth(year, month))
}

export function shiftMonth(year: number, month: number, delta: number): { year: number; month: number } {
  const index = year * 12 + (month - 1) + delta
  return { year: Math.floor(index / 12), month: (((index % 12) + 12) % 12) + 1 }
}

export function localTodayIso(now: Date = new Date()): IsoDate {
  return toIsoDate(now.getFullYear(), now.getMonth() + 1, now.getDate())
}

