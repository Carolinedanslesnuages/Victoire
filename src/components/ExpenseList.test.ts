import { mount } from '@vue/test-utils'
import { expect, it } from 'vitest'
import type { Expense } from '../domain/types'
import ExpenseList from './ExpenseList.vue'

const EXPENSES: Expense[] = [
  { identifier: 'third', date: '2026-01-06', amountCents: 800, label: 'livre' },
  { identifier: 'second', date: '2026-01-05', amountCents: 1250, label: 'déjeuner' },
  { identifier: 'first', date: '2026-01-05', amountCents: 300, label: '' },
]

it('explains when there is no expense yet', () => {
  const wrapper = mount(ExpenseList, { props: { expenses: [] } })
  expect(wrapper.find('.expense-list__empty').text()).toBe('Aucune dépense pour l’instant.')
})

it('groups the expenses by day', () => {
  const wrapper = mount(ExpenseList, { props: { expenses: EXPENSES } })
  const dates = wrapper.findAll('.expense-list__date').map((heading) => heading.text())
  expect(dates).toEqual(['mardi 6 janvier', 'lundi 5 janvier'])
})

it('totals each day', () => {
  const wrapper = mount(ExpenseList, { props: { expenses: EXPENSES } })
  const totals = wrapper.findAll('.expense-list__total').map((total) => total.text().replace(/\s/g, ' '))
  expect(totals).toEqual(['Total : 8,00 €', 'Total : 15,50 €'])
})

it('names the expenses that have no label', () => {
  const wrapper = mount(ExpenseList, { props: { expenses: EXPENSES } })
  expect(wrapper.text()).toContain('Sans libellé')
})

