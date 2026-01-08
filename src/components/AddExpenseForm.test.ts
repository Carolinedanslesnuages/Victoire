import { mount } from '@vue/test-utils'
import { expect, it, vi } from 'vitest'
import AddExpenseForm from './AddExpenseForm.vue'

const DATES = { today: '2026-01-10', cycleStart: '2026-01-05' }

it('sends the typed amount, label and day', async () => {
  const submit = vi.fn(() => ({ ok: true as const }))
  const wrapper = mount(AddExpenseForm, { props: { submit, ...DATES } })
  await wrapper.find('input[name="amount"]').setValue('12,50')
  await wrapper.find('input[name="label"]').setValue('déjeuner')
  await wrapper.find('form').trigger('submit')
  expect(submit).toHaveBeenCalledWith('12,50', 'déjeuner', '2026-01-10')
})

it('lets the day be changed to forget nothing', async () => {
  const submit = vi.fn(() => ({ ok: true as const }))
  const wrapper = mount(AddExpenseForm, { props: { submit, ...DATES } })
  await wrapper.find('input[name="amount"]').setValue('4')
  await wrapper.find('input[name="date"]').setValue('2026-01-08')
  await wrapper.find('form').trigger('submit')
  expect(submit).toHaveBeenCalledWith('4', '', '2026-01-08')
})

it('limits the day to the current cycle', () => {
  const wrapper = mount(AddExpenseForm, {
    props: { submit: () => ({ ok: true as const }), ...DATES },
  })
  const input = wrapper.find('input[name="date"]')
  expect(input.attributes('min')).toBe('2026-01-05')
  expect(input.attributes('max')).toBe('2026-01-10')
})

it('clears the fields and goes back to today after a successful entry', async () => {
  const wrapper = mount(AddExpenseForm, {
    props: { submit: () => ({ ok: true as const }), ...DATES },
  })
  await wrapper.find('input[name="amount"]').setValue('5')
  await wrapper.find('input[name="date"]').setValue('2026-01-08')
  await wrapper.find('form').trigger('submit')
  expect(wrapper.find<HTMLInputElement>('input[name="amount"]').element.value).toBe('')
  expect(wrapper.find<HTMLInputElement>('input[name="date"]').element.value).toBe('2026-01-10')
  expect(wrapper.find('[role="alert"]').exists()).toBe(false)
})

it('follows the calendar when a new day starts', async () => {
  const wrapper = mount(AddExpenseForm, {
    props: { submit: () => ({ ok: true as const }), ...DATES },
  })
  await wrapper.setProps({ today: '2026-01-11' })
  expect(wrapper.find<HTMLInputElement>('input[name="date"]').element.value).toBe('2026-01-11')
})

it('explains an invalid amount and keeps what was typed', async () => {
  const submit = () => ({ ok: false as const, reason: 'invalidAmount' as const })
  const wrapper = mount(AddExpenseForm, { props: { submit, ...DATES } })
  await wrapper.find('input[name="amount"]').setValue('abc')
  await wrapper.find('form').trigger('submit')
  expect(wrapper.find('[role="alert"]').text()).toContain('n’est pas valide')
  expect(wrapper.find<HTMLInputElement>('input[name="amount"]').element.value).toBe('abc')
})

it('explains a null amount', async () => {
  const submit = () => ({ ok: false as const, reason: 'zeroAmount' as const })
  const wrapper = mount(AddExpenseForm, { props: { submit, ...DATES } })
  await wrapper.find('input[name="amount"]').setValue('0')
  await wrapper.find('form').trigger('submit')
  expect(wrapper.find('[role="alert"]').text()).toContain('supérieur à zéro')
})

it('explains a day before the start of the cycle', async () => {
  const submit = () => ({ ok: false as const, reason: 'outOfCycle' as const })
  const wrapper = mount(AddExpenseForm, { props: { submit, ...DATES } })
  await wrapper.find('input[name="amount"]').setValue('3')
  await wrapper.find('form').trigger('submit')
  expect(wrapper.find('[role="alert"]').text()).toContain('avant le début du cycle')
})
