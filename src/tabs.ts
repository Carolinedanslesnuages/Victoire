export const TAB_NAMES = ['today', 'history', 'settings'] as const

export type TabName = (typeof TAB_NAMES)[number]
