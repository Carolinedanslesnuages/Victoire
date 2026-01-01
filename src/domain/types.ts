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

