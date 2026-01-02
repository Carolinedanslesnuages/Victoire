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

