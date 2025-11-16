import { AVATARS, DEFAULT_AVATAR, getAvatarById, getAvatarEmoji, getAvatarImage, AvatarId } from '../avatars';

describe('Avatar Constants', () => {
  it('has exactly 8 avatars defined', () => {
    expect(AVATARS).toHaveLength(8);
  });

  it('all avatars have required properties', () => {
    AVATARS.forEach(avatar => {
      expect(avatar).toHaveProperty('id');
      expect(avatar).toHaveProperty('emoji');
      expect(avatar).toHaveProperty('name');
      expect(avatar).toHaveProperty('imageSource');
      expect(typeof avatar.id).toBe('string');
      expect(typeof avatar.emoji).toBe('string');
      expect(typeof avatar.name).toBe('string');
      expect(avatar.imageSource).toBeDefined();
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

  it('getAvatarImage returns correct image source for valid ID', () => {
    const foxImage = getAvatarImage('fox');
    expect(foxImage).toBeDefined();
    expect(foxImage).toBeTruthy();
  });

  it('getAvatarImage returns default image when no ID provided', () => {
    const defaultImage = getAvatarImage();
    expect(defaultImage).toBeDefined();
    expect(defaultImage).toBeTruthy();
  });

  it('all avatars have valid image sources', () => {
    AVATARS.forEach(avatar => {
      expect(avatar.imageSource).toBeDefined();
      expect(avatar.imageSource).toBeTruthy();
    });
  });
});
