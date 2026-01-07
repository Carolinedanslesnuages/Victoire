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

