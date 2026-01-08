<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import AddExpenseForm from './components/AddExpenseForm.vue'
import CycleClosing from './components/CycleClosing.vue'
import DataBackup from './components/DataBackup.vue'
import ExpenseList from './components/ExpenseList.vue'
import PaydayConfirmation from './components/PaydayConfirmation.vue'
import SettingsForm from './components/SettingsForm.vue'
import TabBar from './components/TabBar.vue'
import TodayGauge from './components/TodayGauge.vue'
import type { Settings } from './domain/types'
import { messages } from './messages.fr'
import { useAppState } from './state/use-app-state'
import type { TabName } from './tabs'

const {
  settings,
  today,
  status,
  closingProposal,
  paydayQuestion,
  recordPayday,
  startWithRemaining,
  cycleExpenses,
  refreshToday,
  saveSettings,
  addExpense,
  updateExpense,
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

function handleSave(next: Settings, remainingCents: number | null): void {
  saveSettings(next)
  if (remainingCents !== null) {
    startWithRemaining(remainingCents, messages.settings.openingLabel)
  }
  tab.value = 'today'
}
</script>

<template>
  <main v-if="settings === null" class="onboarding">
    <h1>{{ messages.appName }}</h1>
    <p>{{ messages.settings.intro }}</p>
    <SettingsForm
      :initial="null"
      :submit-label="messages.settings.start"
      ask-remaining
      @save="handleSave"
    />
  </main>

  <template v-else>
    <main>
      <template v-if="tab === 'today' && status">
        <PaydayConfirmation
          v-if="paydayQuestion"
          :nominal-date="paydayQuestion"
          :today="today"
          @confirm="recordPayday"
        />
        <CycleClosing v-if="closingProposal" :proposal="closingProposal" @decide="decideClosing" />
        <TodayGauge :status="status" />
        <AddExpenseForm :submit="addExpense" :today="today" :cycle-start="status.bounds.start" />
      </template>

      <ExpenseList
        v-else-if="tab === 'history' && status"
        :expenses="cycleExpenses"
        :today="today"
        :cycle-start="status.bounds.start"
        :update="updateExpense"
        @remove="removeExpense"
      />

      <template v-else-if="tab === 'settings'">
        <h1>{{ messages.settings.title }}</h1>
        <SettingsForm
          :initial="settings"
          :submit-label="messages.settings.save"
          :ask-remaining="cycleExpenses.length === 0"
          @save="handleSave"
        />
        <DataBackup :export-backup="exportBackup" :import-backup="importBackup" />
      </template>
    </main>
    <TabBar v-model="tab" />
  </template>
</template>
