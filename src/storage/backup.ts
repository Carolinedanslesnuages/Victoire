import type { BackupFile, ClosedCycle, Expense, Settings } from '../domain/types'
import { isClosedCycle, isExpense, isSettings, keepValid } from './guards'

export const BACKUP_VERSION = 1

