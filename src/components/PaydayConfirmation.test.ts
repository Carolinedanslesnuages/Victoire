import { mount } from '@vue/test-utils'
import { expect, it } from 'vitest'
import PaydayConfirmation from './PaydayConfirmation.vue'

const PROPS = { nominalDate: '2026-11-25', today: '2026-11-26' }

it('mentions the expected payday', () => {
  const wrapper = mount(PaydayConfirmation, { props: PROPS })
  expect(wrapper.text()).toContain('prévue vers le 25 novembre')
})

it('confirms today by default', async () => {
  const wrapper = mount(PaydayConfirmation, { props: PROPS })
  await wrapper.find('button').trigger('click')
  expect(wrapper.emitted('confirm')).toEqual([['2026-11-26']])
})

it('confirms the date that was chosen', async () => {
  const wrapper = mount(PaydayConfirmation, { props: PROPS })
  await wrapper.find('input[name="paydayDate"]').setValue('2026-11-24')
  await wrapper.find('button').trigger('click')
  expect(wrapper.emitted('confirm')).toEqual([['2026-11-24']])
})
