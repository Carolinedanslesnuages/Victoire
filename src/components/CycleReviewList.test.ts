import { mount } from '@vue/test-utils'
import { expect, it } from 'vitest'
import type { CycleReview } from '../domain/review'
import CycleReviewList from './CycleReviewList.vue'

const REVIEW: CycleReview = {
  start: '2025-12-05',
  end: '2026-01-05',
  potCents: 60000,
  spentCents: 45000,
  leftoverCents: 15000,
  overspentDays: 2,
  decision: 'saved',
  savedExtraCents: 15000,
  savedCents: 65000,
}

function textOf(reviews: CycleReview[]): string {
  return mount(CycleReviewList, { props: { reviews } }).text().replace(/\s/g, ' ')
}

it('shows nothing when there is no finished cycle', () => {
  expect(mount(CycleReviewList, { props: { reviews: [] } }).find('section').exists()).toBe(false)
})

it('describes the period, the spending and the leftover', () => {
  const text = textOf([REVIEW])
  expect(text).toContain('Du 5 décembre au 5 janvier')
  expect(text).toContain('Dépensé : 450,00 € sur 600,00 €')
  expect(text).toContain('Reste : 150,00 €')
})

it('counts the overspent days and the saved amount', () => {
  const text = textOf([REVIEW])
  expect(text).toContain('2 jours dépassés')
  expect(text).toContain('Reste viré sur l’épargne')
  expect(text).toContain('Épargné sur ce cycle : 650,00 €')
})

it('shows an overshoot instead of a leftover', () => {
  const text = textOf([{ ...REVIEW, leftoverCents: -10000, decision: null, overspentDays: 0 }])
  expect(text).toContain('Dépassé de 100,00 €')
  expect(text).toContain('Aucun jour dépassé')
})

it('says when the leftover was not moved', () => {
  expect(textOf([{ ...REVIEW, decision: 'ignored' }])).toContain('Reste non viré')
})
