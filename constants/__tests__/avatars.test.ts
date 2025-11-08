import { AVATARS, DEFAULT_AVATAR, getAvatarById, getAvatarEmoji, AvatarId } from '../avatars';

describe('Avatar Constants', () => {
  it('has exactly 8 avatars defined', () => {
    expect(AVATARS).toHaveLength(8);
  });

  it('all avatars have required properties', () => {
    AVATARS.forEach(avatar => {
      expect(avatar).toHaveProperty('id');
      expect(avatar).toHaveProperty('emoji');
      expect(avatar).toHaveProperty('name');
      expect(typeof avatar.id).toBe('string');
      expect(typeof avatar.emoji).toBe('string');
      expect(typeof avatar.name).toBe('string');
    });
  });

  it('all avatar IDs are unique', () => {
    const ids = AVATARS.map(a => a.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it('default avatar is "fox"', () => {
    expect(DEFAULT_AVATAR).toBe('fox');
  });

  it('getAvatarById returns correct avatar', () => {
    const catAvatar = getAvatarById('cat');
    expect(catAvatar.id).toBe('cat');
    expect(catAvatar.emoji).toBe('🐱');
    expect(catAvatar.name).toBe('Cat');
  });

  it('getAvatarById returns default avatar for invalid ID', () => {
    const invalidAvatar = getAvatarById('invalid' as AvatarId);
    expect(invalidAvatar.id).toBe('fox'); // Should return default
  });

  it('getAvatarEmoji returns correct emoji for valid ID', () => {
    expect(getAvatarEmoji('dog')).toBe('🐶');
    expect(getAvatarEmoji('star')).toBe('⭐');
  });

  it('getAvatarEmoji returns default emoji when no ID provided', () => {
    expect(getAvatarEmoji()).toBe('🦊'); // Default fox emoji
  });

  it('contains expected avatars', () => {
    const expectedIds = ['fox', 'cat', 'dog', 'bear', 'piggy_bank', 'rocket', 'star', 'gem'];
    const actualIds = AVATARS.map(a => a.id);
    
    expectedIds.forEach(id => {
      expect(actualIds).toContain(id);
    });
  });

  it('all emojis are valid unicode characters', () => {
    AVATARS.forEach(avatar => {
      expect(avatar.emoji.length).toBeGreaterThan(0);
      expect(avatar.emoji.length).toBeLessThan(5); // Emojis are typically 1-4 characters
    });
  });
});
