import type { Settings } from './types'

export function computePot(settings: Settings): number {
  return (
    settings.netIncomeCents -
    settings.savingsCents -
    settings.jointAccountCents -
    settings.fixedCostsCents
  )
}

export type SettingsProblem =
  | 'incomeMissing'
  | 'negativeAmount'
  | 'paydayOutOfRange'
  | 'potNotPositive'

export function findSettingsProblems(settings: Settings): SettingsProblem[] {
  const problems: SettingsProblem[] = []
  if (settings.netIncomeCents <= 0) {
    problems.push('incomeMissing')
  }
  const amounts = [settings.savingsCents, settings.jointAccountCents, settings.fixedCostsCents]
  if (amounts.some((amount) => amount < 0)) {
    problems.push('negativeAmount')
  }

  if (!Number.isInteger(settings.payday) || settings.payday < 1 || settings.payday > 31) {
    problems.push('paydayOutOfRange')
  }
  if (computePot(settings) <= 0) {
    problems.push('potNotPositive')
  }
  return problems
}

export function savingsShare(settings: Settings): number {
  if (settings.netIncomeCents <= 0) {
    return 0
  }
  return settings.savingsCents / settings.netIncomeCents
}

export function evenDailyBudget(settings: Settings, cycleDays: number): number {
  if (cycleDays <= 0) {
    return 0
  }
  return Math.floor(computePot(settings) / cycleDays)
}
