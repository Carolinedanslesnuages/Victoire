import { isValidIsoDate } from '../domain/dates'
import type { ClosedCycle, Expense, Settings } from '../domain/types'

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isCents(value: unknown): value is number {
  return typeof value === 'number' && Number.isInteger(value) && value >= 0
}

