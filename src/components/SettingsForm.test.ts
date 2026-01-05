import { mount } from '@vue/test-utils'
import { expect, it } from 'vitest'
import SettingsForm from './SettingsForm.vue'

async function fill(wrapper: ReturnType<typeof mount>, values: Record<string, string>) {
  for (const [name, value] of Object.entries(values)) {
    await wrapper.find(`input[name="${name}"]`).setValue(value)
  }
}

