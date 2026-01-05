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

