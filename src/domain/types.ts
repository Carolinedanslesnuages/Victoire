export type IsoDate = string
export type Cents = number

export interface Settings {
  netIncomeCents: Cents
  savingsCents: Cents
  jointAccountCents: Cents
  fixedCostsCents: Cents
  payday: number
}

export interface Expense {
  identifier: string
  date: IsoDate
  amountCents: Cents
  label: string
}

export type ClosingDecision = 'saved' | 'ignored'

export interface ClosedCycle {
  startDate: IsoDate
  leftoverCents: Cents
  decision: ClosingDecision
}

export interface CycleBounds {
  start: IsoDate
  nextStart: IsoDate
}

export type GaugeLevel = 'comfortable' | 'close' | 'over'

export interface DayStatus {
  bounds: CycleBounds
  potCents: Cents
  spentCycleCents: Cents
  spentTodayCents: Cents
  daysLeft: number
  budgetTodayCents: Cents
  remainingTodayCents: Cents
  remainingCycleCents: Cents
  level: GaugeLevel
}

export interface ClosingProposal {
  startDate: IsoDate
  endDate: IsoDate
  spentCents: Cents
  leftoverCents: Cents
}

export interface BackupFile {
  version: 1
  exportedAt: string
  settings: Settings | null
  expenses: Expense[]
  closedCycles: ClosedCycle[]
}
