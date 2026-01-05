<script setup lang="ts">
import { computed } from 'vue'
import { gaugeFillRatio } from '../domain/allowance'
import { formatEuros } from '../domain/money'
import type { DayStatus } from '../domain/types'
import { messages } from '../messages.fr'

const props = defineProps<{ status: DayStatus }>()

const fillPercent = computed(() => Math.round(gaugeFillRatio(props.status) * 100))

