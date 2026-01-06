<script setup lang="ts">
import { ref } from 'vue'
import { messages } from '../messages.fr'
import type { AddExpenseResult } from '../state/app-state'

const props = defineProps<{ submit: (amountText: string, label: string) => AddExpenseResult }>()

