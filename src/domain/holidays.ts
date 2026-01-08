import { addDays, dayOfWeek, parseIsoDate, toIsoDate } from './dates'
import type { IsoDate } from './types'

const FIXED_HOLIDAYS = ['01-01', '05-01', '05-08', '07-14', '08-15', '11-01', '11-11', '12-25']

export function easterSunday(year: number): IsoDate {
  const goldenNumber = year % 19
  const century = Math.floor(year / 100)
  const yearInCentury = year % 100
  const centuryQuarter = Math.floor(century / 4)
  const centuryRemainder = century % 4
  const correction = Math.floor((century + 8) / 25)
  const moonShift = Math.floor((century - correction + 1) / 3)
  const epact = (19 * goldenNumber + century - centuryQuarter - moonShift + 15) % 30
  const leapQuarter = Math.floor(yearInCentury / 4)
  const leapRemainder = yearInCentury % 4
  const weekdayShift = (32 + 2 * centuryRemainder + 2 * leapQuarter - epact - leapRemainder) % 7
  const adjustment = Math.floor((goldenNumber + 11 * epact + 22 * weekdayShift) / 451)
  const total = epact + weekdayShift - 7 * adjustment + 114
  return toIsoDate(year, Math.floor(total / 31), (total % 31) + 1)
}

const holidaysByYear = new Map<number, Set<IsoDate>>()

export function frenchPublicHolidays(year: number): Set<IsoDate> {
  const known = holidaysByYear.get(year)
  if (known) {
    return known
  }
  const easter = easterSunday(year)
  const holidays = new Set<IsoDate>([
    ...FIXED_HOLIDAYS.map((monthAndDay) => `${String(year).padStart(4, '0')}-${monthAndDay}`),
    addDays(easter, 1),
    addDays(easter, 39),
    addDays(easter, 50),
  ])
  holidaysByYear.set(year, holidays)
  return holidays
}

export function isPublicHoliday(value: IsoDate): boolean {
  const parts = parseIsoDate(value)
  return parts !== null && frenchPublicHolidays(parts.year).has(value)
}

export function isBusinessDay(value: IsoDate): boolean {
  const weekday = dayOfWeek(value)
  return weekday !== 0 && weekday !== 6 && !isPublicHoliday(value)
}

export function firstBusinessDayOnOrAfter(value: IsoDate): IsoDate {
  let candidate = value
  while (!isBusinessDay(candidate)) {
    candidate = addDays(candidate, 1)
  }
  return candidate
}
