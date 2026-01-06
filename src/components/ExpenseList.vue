<script setup lang="ts">
import { computed } from 'vue'
import { totalOf } from '../domain/allowance'
import { formatEuros } from '../domain/money'
import type { Expense } from '../domain/types'
import { formatLongDate } from '../format'
import { messages } from '../messages.fr'

const props = defineProps<{ expenses: Expense[] }>()
const emit = defineEmits<{ remove: [identifier: string] }>()

