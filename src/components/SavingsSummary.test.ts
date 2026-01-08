import { mount } from '@vue/test-utils'
import { expect, it } from 'vitest'
import SavingsSummary from './SavingsSummary.vue'

it('shows the total saved and the number of cycles', () => {
  const text = mount(SavingsSummary, { props: { totalCents: 115000, cycles: 2 } })
    .text()
    .replace(/\s/g, ' ')
  expect(text).toContain('1 150,00 €')
  expect(text).toContain('Sur 2 cycles terminés')
})

it('uses the singular for one cycle', () => {
  const text = mount(SavingsSummary, { props: { totalCents: 50000, cycles: 1 } }).text()
  expect(text).toContain('Sur 1 cycle terminé')
})
