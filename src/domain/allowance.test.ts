import { expect, it } from 'vitest'
import {
  computeDayStatus,
  expensesInCycle,
  gaugeFillRatio,
  gaugeLevel,
  totalOf,
} from './allowance'
import type { Expense, Settings } from './types'

const SETTINGS: Settings = {
  netIncomeCents: 300000,
  savingsCents: 50000,
  jointAccountCents: 150000,
  fixedCostsCents: 40000,
  payday: 5,
}

function expense(date: string, amountCents: number, identifier = `${date}-${amountCents}`): Expense {
  return { identifier, date, amountCents, label: '' }
}

