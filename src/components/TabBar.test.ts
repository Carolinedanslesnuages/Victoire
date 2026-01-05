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

