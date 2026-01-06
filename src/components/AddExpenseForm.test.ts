import { mount } from '@vue/test-utils'
import { expect, it, vi } from 'vitest'
import AddExpenseForm from './AddExpenseForm.vue'

it('sends the typed amount and label', async () => {
  const submit = vi.fn(() => ({ ok: true as const }))
  const wrapper = mount(AddExpenseForm, { props: { submit } })
  await wrapper.find('input[name="amount"]').setValue('12,50')
  await wrapper.find('input[name="label"]').setValue('déjeuner')
  await wrapper.find('form').trigger('submit')
  expect(submit).toHaveBeenCalledWith('12,50', 'déjeuner')
})

it('clears the fields after a successful entry', async () => {
  const wrapper = mount(AddExpenseForm, { props: { submit: () => ({ ok: true as const }) } })
  await wrapper.find('input[name="amount"]').setValue('5')
  await wrapper.find('form').trigger('submit')
  expect(wrapper.find<HTMLInputElement>('input[name="amount"]').element.value).toBe('')
  expect(wrapper.find('[role="alert"]').exists()).toBe(false)
})

it('explains an invalid amount and keeps what was typed', async () => {
  const submit = () => ({ ok: false as const, reason: 'invalidAmount' as const })
  const wrapper = mount(AddExpenseForm, { props: { submit } })
  await wrapper.find('input[name="amount"]').setValue('abc')
  await wrapper.find('form').trigger('submit')
  expect(wrapper.find('[role="alert"]').text()).toContain('n’est pas valide')
  expect(wrapper.find<HTMLInputElement>('input[name="amount"]').element.value).toBe('abc')
})

it('explains a null amount', async () => {
  const submit = () => ({ ok: false as const, reason: 'zeroAmount' as const })
  const wrapper = mount(AddExpenseForm, { props: { submit } })
  await wrapper.find('input[name="amount"]').setValue('0')
  await wrapper.find('form').trigger('submit')
  expect(wrapper.find('[role="alert"]').text()).toContain('supérieur à zéro')
})
