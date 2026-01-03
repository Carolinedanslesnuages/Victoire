import { isValidIsoDate } from '../domain/dates'
import type { ClosedCycle, Expense, Settings } from '../domain/types'

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isCents(value: unknown): value is number {
  return typeof value === 'number' && Number.isInteger(value) && value >= 0
}

export function isSettings(value: unknown): value is Settings {
  return (
    isRecord(value) &&
    isCents(value.netIncomeCents) &&
    isCents(value.savingsCents) &&
    isCents(value.jointAccountCents) &&
    isCents(value.fixedCostsCents) &&
    typeof value.payday === 'number' &&
    Number.isInteger(value.payday) &&
    value.payday >= 1 &&
    value.payday <= 31
  )
}

export function isExpense(value: unknown): value is Expense {
  return (
    isRecord(value) &&
    typeof value.identifier === 'string' &&
    value.identifier.length > 0 &&
    typeof value.date === 'string' &&
    isValidIsoDate(value.date) &&
    isCents(value.amountCents) &&
    typeof value.label === 'string'
  )
}

