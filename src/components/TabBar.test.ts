import { mount } from '@vue/test-utils'
import { expect, it } from 'vitest'
import TabBar from './TabBar.vue'

it('shows one button per screen', () => {
  const wrapper = mount(TabBar, { props: { modelValue: 'today' } })
  expect(wrapper.findAll('button').map((button) => button.text())).toEqual([
    'Aujourd’hui',
    'Historique',
    'Réglages',
  ])
})

it('marks the current screen', () => {
  const wrapper = mount(TabBar, { props: { modelValue: 'history' } })
  const current = wrapper.findAll('button').filter((button) => button.attributes('aria-current'))
  expect(current).toHaveLength(1)
  expect(current[0].text()).toBe('Historique')
})

