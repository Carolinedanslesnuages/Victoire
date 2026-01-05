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

