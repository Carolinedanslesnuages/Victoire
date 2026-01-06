import { mount } from '@vue/test-utils'
import { expect, it } from 'vitest'
import type { DayStatus } from '../domain/types'
import TodayGauge from './TodayGauge.vue'

const STATUS: DayStatus = {
  bounds: { start: '2026-01-05', nextStart: '2026-02-05' },
  potCents: 60000,
  spentCycleCents: 0,
  spentTodayCents: 0,
  daysLeft: 26,
  budgetTodayCents: 2307,
  remainingTodayCents: 2307,
  remainingCycleCents: 60000,
  level: 'comfortable',
}

