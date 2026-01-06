import { mount } from '@vue/test-utils'
import { expect, it } from 'vitest'
import CycleClosing from './CycleClosing.vue'

const PROPOSAL = {
  startDate: '2026-01-05',
  endDate: '2026-02-05',
  spentCents: 45000,
  leftoverCents: 15000,
}

it('describes the leftover and the period', () => {
  const text = mount(CycleClosing, { props: { proposal: PROPOSAL } }).text().replace(/\s/g, ' ')
  expect(text).toContain('Du 5 janvier au 5 février')
  expect(text).toContain('150,00 €')
})

