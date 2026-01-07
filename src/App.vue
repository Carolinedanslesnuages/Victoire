<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import AddExpenseForm from './components/AddExpenseForm.vue'
import CycleClosing from './components/CycleClosing.vue'
import DataBackup from './components/DataBackup.vue'
import ExpenseList from './components/ExpenseList.vue'
import SettingsForm from './components/SettingsForm.vue'
import TabBar from './components/TabBar.vue'
import TodayGauge from './components/TodayGauge.vue'
import type { Settings } from './domain/types'
import { messages } from './messages.fr'
import { useAppState } from './state/use-app-state'
import type { TabName } from './tabs'

const {
  settings,
  status,
  closingProposal,
  cycleExpenses,
  refreshToday,
  saveSettings,
  addExpense,
  removeExpense,
  decideClosing,
  exportBackup,
  importBackup,
} = useAppState()

const tab = ref<TabName>('today')

function handleVisibility(): void {
  if (document.visibilityState === 'visible') {
    refreshToday()
  }
}

onMounted(() => document.addEventListener('visibilitychange', handleVisibility))
onBeforeUnmount(() => document.removeEventListener('visibilitychange', handleVisibility))

function handleSave(next: Settings): void {
  saveSettings(next)
  tab.value = 'today'
}
</script>

<template>
  <main v-if="settings === null" class="onboarding">
    <h1>{{ messages.appName }}</h1>
    <p>{{ messages.settings.intro }}</p>
    <SettingsForm :initial="null" :submit-label="messages.settings.start" @save="handleSave" />
  </main>

