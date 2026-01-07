import { mount } from '@vue/test-utils'
import { expect, it, vi } from 'vitest'
import App from './App.vue'
import { createAppState } from './state/app-state'
import type { AppState } from './state/app-state'
import { createMemoryBackend } from './storage/storage'
import type { StorageBackend } from './storage/storage'

const holder = vi.hoisted(() => ({ state: null as AppState | null }))

vi.mock('./state/use-app-state', () => ({
  useAppState: () => holder.state,
}))

function mountApp(backend: StorageBackend = createMemoryBackend()) {
  holder.state = createAppState(backend, () => new Date(2026, 0, 10, 12, 0))
  return mount(App)
}

it('asks for the settings on first use', () => {
  const wrapper = mountApp()
  expect(wrapper.find('.onboarding').exists()).toBe(true)
  expect(wrapper.find('input[name="netIncome"]').exists()).toBe(true)
})

async function completeOnboarding(wrapper: ReturnType<typeof mountApp>) {
  await wrapper.find('input[name="netIncome"]').setValue('3000')
  await wrapper.find('input[name="savings"]').setValue('500')
  await wrapper.find('input[name="jointAccount"]').setValue('1500')
  await wrapper.find('input[name="fixedCosts"]').setValue('400')
  await wrapper.find('input[name="payday"]').setValue('5')
  await wrapper.find('form').trigger('submit')
}

it('shows the daily amount once configured', async () => {
  const wrapper = mountApp()
  await completeOnboarding(wrapper)
  expect(wrapper.find('.gauge').exists()).toBe(true)
  expect(wrapper.find('.gauge__amount').text().replace(/\s/g, ' ')).toBe('23,07 €')
})

it('lowers the amount left after an expense', async () => {
  const wrapper = mountApp()
  await completeOnboarding(wrapper)
  await wrapper.find('input[name="amount"]').setValue('5')
  await wrapper.find('form').trigger('submit')
  expect(wrapper.find('.gauge__amount').text().replace(/\s/g, ' ')).toBe('18,07 €')
})

