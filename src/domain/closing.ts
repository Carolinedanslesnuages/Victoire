import { totalOf } from './allowance'
import { cycleBounds, isInCycle, previousCycleBounds } from './cycle'
import { computePot } from './pot'
import type { ClosedCycle, ClosingProposal, Expense, IsoDate, Settings } from './types'

export interface ClosingInput {
  settings: Settings
  expenses: readonly Expense[]
  closedCycles: readonly ClosedCycle[]
  today: IsoDate
}

