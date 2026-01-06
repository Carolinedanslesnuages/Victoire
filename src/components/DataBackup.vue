<script setup lang="ts">
import { ref } from 'vue'
import { messages } from '../messages.fr'
import type { ImportResult } from '../state/app-state'

const props = defineProps<{
  exportBackup: () => string
  importBackup: (text: string) => ImportResult
}>()

const feedback = ref('')

