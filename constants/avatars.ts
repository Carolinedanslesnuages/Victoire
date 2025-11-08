/**
 * Avatar configuration for user profile customization
 * Provides predefined avatar options using emoji for visual identity
 */

export type AvatarId = 
  | 'fox'
  | 'cat'
  | 'dog'
  | 'bear'
  | 'piggy_bank'
  | 'rocket'
  | 'star'
  | 'gem';

export interface Avatar {
  id: AvatarId;
  emoji: string;
  name: string;
}

/**
 * Predefined avatars available for user selection
 * Uses emoji for cross-platform compatibility and visual appeal
 */
export const AVATARS: Avatar[] = [
  {
    id: 'fox',
    emoji: '🦊',
    name: 'Fox',
  },
  {
    id: 'cat',
    emoji: '🐱',
    name: 'Cat',
  },
  {
    id: 'dog',
    emoji: '🐶',
    name: 'Dog',
  },
  {
    id: 'bear',
    emoji: '🐻',
    name: 'Bear',
  },
  {
    id: 'piggy_bank',
    emoji: '🐷',
    name: 'Piggy Bank',
  },
  {
    id: 'rocket',
    emoji: '🚀',
    name: 'Rocket',
  },
  {
    id: 'star',
    emoji: '⭐',
    name: 'Star',
  },
  {
    id: 'gem',
    emoji: '💎',
    name: 'Gem',
  },
];

/**
 * Default avatar for new users
 */
export const DEFAULT_AVATAR: AvatarId = 'fox';

/**
 * Get avatar by ID
 */
export function getAvatarById(id: AvatarId): Avatar {
  return AVATARS.find(avatar => avatar.id === id) || AVATARS[0];
}

/**
 * Get avatar emoji by ID
 */
export function getAvatarEmoji(id?: AvatarId): string {
  if (!id) return getAvatarById(DEFAULT_AVATAR).emoji;
  return getAvatarById(id).emoji;
}
