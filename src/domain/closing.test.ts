import { expect, it } from 'vitest'
import { proposeClosing } from './closing'
import type { Expense, Settings } from './types'

const SETTINGS: Settings = {
  netIncomeCents: 300000,
  savingsCents: 50000,
  jointAccountCents: 150000,
  fixedCostsCents: 40000,
  payday: 5,
}

function expense(date: string, amountCents: number): Expense {
  return { identifier: `${date}-${amountCents}`, date, amountCents, label: '' }
}

