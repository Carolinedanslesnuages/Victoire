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

it('shows the amount left for today', () => {
  const wrapper = mount(TodayGauge, { props: { status: STATUS } })
  expect(wrapper.find('.gauge__amount').text().replace(/\s/g, ' ')).toBe('23,07 €')
})

it('fills the bar when nothing was spent', () => {
  const wrapper = mount(TodayGauge, { props: { status: STATUS } })
  expect(wrapper.find('[role="progressbar"]').attributes('aria-valuenow')).toBe('100')
  expect(wrapper.find('.gauge__message').text()).toBe('Vous êtes dans le rythme.')
})

it('warns when the day is almost used up', () => {
  const status = { ...STATUS, remainingTodayCents: 300, level: 'close' as const }
  const wrapper = mount(TodayGauge, { props: { status } })
  expect(wrapper.classes()).toContain('gauge--close')
  expect(wrapper.find('[role="progressbar"]').attributes('aria-valuenow')).toBe('13')
})

it('shows an empty bar and a negative amount when over', () => {
  const status = { ...STATUS, remainingTodayCents: -693, level: 'over' as const }
  const wrapper = mount(TodayGauge, { props: { status } })
  expect(wrapper.classes()).toContain('gauge--over')
  expect(wrapper.find('[role="progressbar"]').attributes('aria-valuenow')).toBe('0')
  expect(wrapper.find('.gauge__message').text()).toContain('dépassé')
})

it('says the cycle budget is exhausted when nothing is left to share', () => {
  const status = { ...STATUS, budgetTodayCents: 0, remainingTodayCents: 0, level: 'over' as const }
  const wrapper = mount(TodayGauge, { props: { status } })
  expect(wrapper.find('.gauge__message').text()).toBe('Le budget du cycle est épuisé.')
})

