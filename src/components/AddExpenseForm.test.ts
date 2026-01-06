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

