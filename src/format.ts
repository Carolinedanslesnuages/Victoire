import { parseIsoDate } from './domain/dates'
import type { IsoDate } from './domain/types'

const longFormatter = new Intl.DateTimeFormat('fr-FR', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  timeZone: 'UTC',
})

const dayMonthFormatter = new Intl.DateTimeFormat('fr-FR', {
  day: 'numeric',
  month: 'long',
  timeZone: 'UTC',
})

function toUtcDate(value: IsoDate): Date {
  const parts = parseIsoDate(value)
  if (!parts) {
    throw new RangeError(`Invalid ISO date: ${value}`)
  }
  return new Date(Date.UTC(parts.year, parts.month - 1, parts.day))
}

export function formatLongDate(value: IsoDate): string {
  return longFormatter.format(toUtcDate(value))
}

export function formatDayMonth(value: IsoDate): string {
  return dayMonthFormatter.format(toUtcDate(value))
}
