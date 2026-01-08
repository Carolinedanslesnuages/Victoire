import { mount } from '@vue/test-utils'
import { expect, it, vi } from 'vitest'
import type { Expense } from '../domain/types'
import type { AddExpenseResult } from '../state/app-state'
import ExpenseList from './ExpenseList.vue'

const EXPENSES: Expense[] = [
  { identifier: 'third', date: '2026-01-06', amountCents: 800, label: 'livre' },
  { identifier: 'second', date: '2026-01-05', amountCents: 1250, label: 'déjeuner' },
  { identifier: 'first', date: '2026-01-05', amountCents: 300, label: '' },
]

function mountList(
  expenses: Expense[],
  update: (identifier: string, fields: unknown) => AddExpenseResult = vi.fn(() => ({ ok: true as const })),
) {
  const wrapper = mount(ExpenseList, {
    props: { expenses, today: '2026-01-10', cycleStart: '2026-01-05', update },
  })
  return { wrapper, update }
}

it('explains when there is no expense yet', () => {
  const { wrapper } = mountList([])
  expect(wrapper.find('.expense-list__empty').text()).toBe('Aucune dépense pour l’instant.')
})

it('groups the expenses by day', () => {
  const { wrapper } = mountList(EXPENSES)
  const dates = wrapper.findAll('.expense-list__date').map((heading) => heading.text())
  expect(dates).toEqual(['mardi 6 janvier', 'lundi 5 janvier'])
})

it('totals each day', () => {
  const { wrapper } = mountList(EXPENSES)
  const totals = wrapper
    .findAll('.expense-list__total')
    .map((total) => total.text().replace(/\s/g, ' '))
  expect(totals).toEqual(['Total : 8,00 €', 'Total : 15,50 €'])
})

it('names the expenses that have no label', () => {
  const { wrapper } = mountList(EXPENSES)
  expect(wrapper.text()).toContain('Sans libellé')
})

it('emits the identifier of the removed expense', async () => {
  const { wrapper } = mountList(EXPENSES)
  await wrapper.findAll('.expense-list__remove')[1].trigger('click')
  expect(wrapper.emitted('remove')).toEqual([['second']])
})

it('opens an editor filled with the current values', async () => {
  const { wrapper } = mountList(EXPENSES)
  await wrapper.findAll('.expense-list__edit-button')[1].trigger('click')
  expect(wrapper.find<HTMLInputElement>('input[name="amount"]').element.value).toBe('12,50')
  expect(wrapper.find<HTMLInputElement>('input[name="label"]').element.value).toBe('déjeuner')
  expect(wrapper.find<HTMLInputElement>('input[name="date"]').element.value).toBe('2026-01-05')
})

it('sends the edited values and closes the editor', async () => {
  const { wrapper, update } = mountList(EXPENSES)
  await wrapper.findAll('.expense-list__edit-button')[1].trigger('click')
  await wrapper.find('input[name="amount"]').setValue('14')
  await wrapper.find('input[name="date"]').setValue('2026-01-07')
  await wrapper.find('form').trigger('submit')
  expect(update).toHaveBeenCalledWith('second', {
    amountText: '14',
    label: 'déjeuner',
    date: '2026-01-07',
  })
  expect(wrapper.find('form').exists()).toBe(false)
})

it('keeps the editor open and explains a refused change', async () => {
  const update = vi.fn(() => ({ ok: false as const, reason: 'futureDate' as const }))
  const { wrapper } = mountList(EXPENSES, update)
  await wrapper.findAll('.expense-list__edit-button')[0].trigger('click')
  await wrapper.find('form').trigger('submit')
  expect(wrapper.find('[role="alert"]').text()).toContain('futur')
  expect(wrapper.find('form').exists()).toBe(true)
})

it('closes the editor without saving when cancelled', async () => {
  const { wrapper, update } = mountList(EXPENSES)
  await wrapper.findAll('.expense-list__edit-button')[0].trigger('click')
  await wrapper.find('button[type="button"]').trigger('click')
  expect(update).not.toHaveBeenCalled()
  expect(wrapper.find('form').exists()).toBe(false)
})
