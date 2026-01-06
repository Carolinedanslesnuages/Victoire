import { mount } from '@vue/test-utils'
import { expect, it } from 'vitest'
import type { Expense } from '../domain/types'
import ExpenseList from './ExpenseList.vue'

const EXPENSES: Expense[] = [
  { identifier: 'third', date: '2026-01-06', amountCents: 800, label: 'livre' },
  { identifier: 'second', date: '2026-01-05', amountCents: 1250, label: 'déjeuner' },
  { identifier: 'first', date: '2026-01-05', amountCents: 300, label: '' },
]

