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

it('previews what is left each day', async () => {
  const wrapper = mount(SettingsForm, { props: { initial: null, submitLabel: 'Commencer' } })
  await fill(wrapper, {
    netIncome: '3000',
    savings: '500',
    jointAccount: '1500',
    fixedCosts: '400',
    payday: '5',
  })
  expect(wrapper.find('.settings-form__preview').text()).toContain('600,00')
})

it('emits the settings in cents when the form is valid', async () => {
  const wrapper = mount(SettingsForm, { props: { initial: null, submitLabel: 'Commencer' } })
  await fill(wrapper, {
    netIncome: '3 000',
    savings: '500',
    jointAccount: '1500',
    fixedCosts: '400,50',
    payday: '5',
  })
  await wrapper.find('form').trigger('submit')
  expect(wrapper.emitted('save')).toEqual([
    [
      {
        netIncomeCents: 300000,
        savingsCents: 50000,
        jointAccountCents: 150000,
        fixedCostsCents: 40050,
        payday: 5,
      },
      null,
    ],
  ])
})

it('refuses an unreadable amount', async () => {
  const wrapper = mount(SettingsForm, { props: { initial: null, submitLabel: 'Commencer' } })
  await fill(wrapper, { netIncome: 'beaucoup', payday: '5' })
  await wrapper.find('form').trigger('submit')
  expect(wrapper.emitted('save')).toBeUndefined()
  expect(wrapper.find('[role="alert"]').text()).toContain('n’est pas valide')
})

it('refuses a configuration that leaves nothing to spend', async () => {
  const wrapper = mount(SettingsForm, { props: { initial: null, submitLabel: 'Commencer' } })
  await fill(wrapper, { netIncome: '1000', savings: '1000', payday: '5' })
  await wrapper.find('form').trigger('submit')
  expect(wrapper.emitted('save')).toBeUndefined()
  expect(wrapper.find('[role="alert"]').text()).toContain('Il ne reste rien à dépenser')
})

const COMPLETE = { netIncome: '3000', savings: '500', jointAccount: '1500', fixedCosts: '400', payday: '25' }

it('does not ask for the remaining amount unless requested', () => {
  const wrapper = mount(SettingsForm, { props: { initial: null, submitLabel: 'Commencer' } })
  expect(wrapper.find('input[name="remaining"]').exists()).toBe(false)
})

it('emits the remaining amount when it is typed', async () => {
  const wrapper = mount(SettingsForm, {
    props: { initial: null, submitLabel: 'Commencer', askRemaining: true },
  })
  await fill(wrapper, { ...COMPLETE, remaining: '40' })
  await wrapper.find('form').trigger('submit')
  expect(wrapper.emitted('save')?.[0][1]).toBe(4000)
})

it('emits no remaining amount when the field is left empty', async () => {
  const wrapper = mount(SettingsForm, {
    props: { initial: null, submitLabel: 'Commencer', askRemaining: true },
  })
  await fill(wrapper, COMPLETE)
  await wrapper.find('form').trigger('submit')
  expect(wrapper.emitted('save')?.[0][1]).toBeNull()
})

it('refuses a remaining amount larger than the pot', async () => {
  const wrapper = mount(SettingsForm, {
    props: { initial: null, submitLabel: 'Commencer', askRemaining: true },
  })
  await fill(wrapper, { ...COMPLETE, remaining: '700' })
  await wrapper.find('form').trigger('submit')
  expect(wrapper.emitted('save')).toBeUndefined()
  expect(wrapper.find('[role="alert"]').text()).toContain('ne peut pas dépasser')
})
