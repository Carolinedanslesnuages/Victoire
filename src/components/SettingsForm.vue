<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { cycleBounds, cycleLength } from '../domain/cycle'
import { localTodayIso } from '../domain/dates'
import { formatEditableEuros, formatEuros, parseEuros } from '../domain/money'
import { computePot, evenDailyBudget, findSettingsProblems } from '../domain/pot'
import type { Settings } from '../domain/types'
import { messages } from '../messages.fr'

const props = defineProps<{ initial: Settings | null; submitLabel: string }>()
const emit = defineEmits<{ save: [settings: Settings] }>()

type AmountField = 'netIncome' | 'savings' | 'jointAccount' | 'fixedCosts'

const amountFields: { key: AmountField; label: string; hint: string }[] = [
  { key: 'netIncome', label: messages.settings.netIncome, hint: messages.settings.netIncomeHint },
  { key: 'savings', label: messages.settings.savings, hint: messages.settings.savingsHint },
  {
    key: 'jointAccount',
    label: messages.settings.jointAccount,
    hint: messages.settings.jointAccountHint,
  },
  { key: 'fixedCosts', label: messages.settings.fixedCosts, hint: messages.settings.fixedCostsHint },
]

function fieldFrom(cents: number | undefined): string {
  return cents === undefined ? '' : formatEditableEuros(cents)
}

const form = reactive({
  netIncome: fieldFrom(props.initial?.netIncomeCents),
  savings: fieldFrom(props.initial?.savingsCents),
  jointAccount: fieldFrom(props.initial?.jointAccountCents),
  fixedCosts: fieldFrom(props.initial?.fixedCostsCents),
  payday: String(props.initial?.payday ?? 1),
})

function parseField(text: string): number | null {
  return text.trim() === '' ? 0 : parseEuros(text)
}

const draft = computed<Settings | null>(() => {
  const netIncomeCents = parseField(form.netIncome)
  const savingsCents = parseField(form.savings)
  const jointAccountCents = parseField(form.jointAccount)
  const fixedCostsCents = parseField(form.fixedCosts)
  if (
    netIncomeCents === null ||
    savingsCents === null ||
    jointAccountCents === null ||
    fixedCostsCents === null
  ) {
    return null
  }
  return {
    netIncomeCents,
    savingsCents,
    jointAccountCents,
    fixedCostsCents,
    payday: Number(form.payday),
  }
})

const problems = computed(() => (draft.value === null ? [] : findSettingsProblems(draft.value)))

const preview = computed(() => {
  if (draft.value === null || problems.value.length > 0) {
    return null
  }
  const bounds = cycleBounds(localTodayIso(), draft.value.payday)
  return {
    pot: computePot(draft.value),
    daily: evenDailyBudget(draft.value, cycleLength(bounds)),
  }
})

const errors = ref<string[]>([])

function submit(): void {
  errors.value = []
  if (draft.value === null) {
    errors.value = [messages.settings.invalidAmount]
    return
  }
  if (problems.value.length > 0) {
    errors.value = problems.value.map((problem) => messages.settings.problems[problem])
    return
  }
  emit('save', draft.value)
}
</script>

<template>
  <form class="settings-form" novalidate @submit.prevent="submit">
    <label v-for="field in amountFields" :key="field.key" class="field">
      <span class="field__label">{{ field.label }}</span>
      <span class="field__hint">{{ field.hint }}</span>
      <input
        v-model="form[field.key]"
        class="field__input"
        type="text"
        inputmode="decimal"
        autocomplete="off"
        :name="field.key"
      />
    </label>

    <label class="field">
      <span class="field__label">{{ messages.settings.payday }}</span>
      <span class="field__hint">{{ messages.settings.paydayHint }}</span>
      <input
        v-model="form.payday"
        class="field__input"
        type="number"
        inputmode="numeric"
        min="1"
        max="31"
        name="payday"
      />
    </label>

    <p v-if="preview" class="settings-form__preview">
      {{ messages.settings.preview(formatEuros(preview.pot), formatEuros(preview.daily)) }}
    </p>
    <p class="settings-form__reminder">{{ messages.settings.reminder }}</p>

