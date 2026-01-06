import { mount } from '@vue/test-utils'
import { expect, it } from 'vitest'
import CycleClosing from './CycleClosing.vue'

const PROPOSAL = {
  startDate: '2026-01-05',
  endDate: '2026-02-05',
  spentCents: 45000,
  leftoverCents: 15000,
}

