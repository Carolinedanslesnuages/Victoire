/**
 * Avatar configuration for user profile customization
 * Provides predefined avatar options using local PNG illustrations
 */

import { ImageSourcePropType } from 'react-native';

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
  emoji: string; // Kept for backward compatibility
  name: string;
  imageSource: ImageSourcePropType;
}

/**
 * Avatar image sources - static mapping for require statements
 */
const AVATAR_IMAGES: Record<AvatarId, ImageSourcePropType> = {
  fox: require('../assets/avatars/fox.png'),
  cat: require('../assets/avatars/cat.png'),
  dog: require('../assets/avatars/dog.png'),
  bear: require('../assets/avatars/bear.png'),
  piggy_bank: require('../assets/avatars/pig.png'),
  rocket: require('../assets/avatars/rocket.png'),
  star: require('../assets/avatars/star.png'),
  gem: require('../assets/avatars/gem.png'),
};

/**
 * Predefined avatars available for user selection
 * Uses local PNG illustrations for consistent cross-platform appearance
 */
export const AVATARS: Avatar[] = [
  {
    id: 'fox',
    emoji: '🦊',
    name: 'Fox',
    imageSource: AVATAR_IMAGES.fox,
  },
  {
    id: 'cat',
    emoji: '🐱',
    name: 'Cat',
    imageSource: AVATAR_IMAGES.cat,
  },
  {
    id: 'dog',
    emoji: '🐶',
    name: 'Dog',
    imageSource: AVATAR_IMAGES.dog,
  },
  {
    id: 'bear',
    emoji: '🐻',
    name: 'Bear',
    imageSource: AVATAR_IMAGES.bear,
  },
  {
    id: 'piggy_bank',
    emoji: '🐷',
    name: 'Piggy Bank',
    imageSource: AVATAR_IMAGES.piggy_bank,
  },
  {
    id: 'rocket',
    emoji: '🚀',
    name: 'Rocket',
    imageSource: AVATAR_IMAGES.rocket,
  },
  {
    id: 'star',
    emoji: '⭐',
    name: 'Star',
    imageSource: AVATAR_IMAGES.star,
  },
  {
    id: 'gem',
    emoji: '💎',
    name: 'Gem',
    imageSource: AVATAR_IMAGES.gem,
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
 * @deprecated Use getAvatarImage instead for proper image rendering
 */
export function getAvatarEmoji(id?: AvatarId): string {
  if (!id) return getAvatarById(DEFAULT_AVATAR).emoji;
  return getAvatarById(id).emoji;
}

/**
 * Get avatar image source by ID
 */
export function getAvatarImage(id?: AvatarId): ImageSourcePropType {
  if (!id) return getAvatarById(DEFAULT_AVATAR).imageSource;
  return getAvatarById(id).imageSource;
}
