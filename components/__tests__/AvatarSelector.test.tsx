import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import AvatarSelector from '../AvatarSelector';

describe('AvatarSelector', () => {
  it('renders all 8 avatars', () => {
    const mockOnSelect = jest.fn();
    const { getAllByText } = render(
      <AvatarSelector
        selectedAvatar="fox"
        onSelectAvatar={mockOnSelect}
      />
    );

    // Check that all avatar emojis are rendered
    const avatarEmojis = ['🦊', '🐱', '🐶', '🐻', '🐷', '🚀', '⭐', '💎'];
    avatarEmojis.forEach(emoji => {
      const elements = getAllByText(emoji);
      expect(elements.length).toBeGreaterThan(0);
    });
  });

  it('shows selected state for the chosen avatar', () => {
    const mockOnSelect = jest.fn();
    const { getByText } = render(
      <AvatarSelector
        selectedAvatar="cat"
        onSelectAvatar={mockOnSelect}
      />
    );

    // Check that the checkmark is shown for selected avatar
    const checkmark = getByText('✓');
    expect(checkmark).toBeTruthy();
  });

  it('calls onSelectAvatar when an avatar is pressed', () => {
    const mockOnSelect = jest.fn();
    const { getAllByText } = render(
      <AvatarSelector
        selectedAvatar="fox"
        onSelectAvatar={mockOnSelect}
      />
    );

    // Find and press the dog avatar
    const dogEmojis = getAllByText('🐶');
    fireEvent.press(dogEmojis[0]);

    expect(mockOnSelect).toHaveBeenCalledWith('dog');
  });

  it('renders custom title and subtitle when provided', () => {
    const mockOnSelect = jest.fn();
    const { getByText } = render(
      <AvatarSelector
        selectedAvatar="fox"
        onSelectAvatar={mockOnSelect}
        title="Choose Your Avatar"
        subtitle="Pick one that represents you"
      />
    );

    expect(getByText('Choose Your Avatar')).toBeTruthy();
    expect(getByText('Pick one that represents you')).toBeTruthy();
  });

  it('handles no selection gracefully', () => {
    const mockOnSelect = jest.fn();
    const { queryByText } = render(
      <AvatarSelector
        onSelectAvatar={mockOnSelect}
      />
    );

    // No checkmark should be visible when no avatar is selected
    const checkmark = queryByText('✓');
    expect(checkmark).toBeNull();
  });
});
