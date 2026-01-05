import { mount } from '@vue/test-utils'
import { expect, it } from 'vitest'
import SettingsForm from './SettingsForm.vue'

async function fill(wrapper: ReturnType<typeof mount>, values: Record<string, string>) {
  for (const [name, value] of Object.entries(values)) {
    await wrapper.find(`input[name="${name}"]`).setValue(value)
  }
}

it('starts empty when nothing was saved', () => {
  const wrapper = mount(SettingsForm, { props: { initial: null, submitLabel: 'Commencer' } })
  expect(wrapper.find<HTMLInputElement>('input[name="netIncome"]').element.value).toBe('')
  expect(wrapper.find('button').text()).toBe('Commencer')
})

it('shows the saved values', () => {
  const wrapper = mount(SettingsForm, {
    props: {
      initial: {
        netIncomeCents: 300000,
        savingsCents: 50000,
        jointAccountCents: 150000,
        fixedCostsCents: 40000,
        payday: 5,
      },
      submitLabel: 'Enregistrer',
    },
  })
  expect(wrapper.find<HTMLInputElement>('input[name="netIncome"]').element.value).toBe('3000')
  expect(wrapper.find<HTMLInputElement>('input[name="payday"]').element.value).toBe('5')
})

