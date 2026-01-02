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

