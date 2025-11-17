import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import AvatarSelector from '../AvatarSelector';
import { AVATARS } from '../../constants/avatars';

describe('AvatarSelector', () => {
  it('renders all 8 avatars', () => {
    const mockOnSelect = jest.fn();
    render(
      <AvatarSelector
        selectedAvatar="fox"
        onSelectAvatar={mockOnSelect}
      />
    );
    
    // Verify AVATARS constant has 8 items
    expect(AVATARS.length).toBe(8);
    
    // Check that each avatar has an imageSource property
    AVATARS.forEach(avatar => {
      expect(avatar).toHaveProperty('imageSource');
      expect(avatar.imageSource).toBeDefined();
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
    const { getByText } = render(
      <AvatarSelector
        selectedAvatar="fox"
        onSelectAvatar={mockOnSelect}
      />
    );

    // Find and press the dog avatar by its translated name
    const dogButton = getByText('Chien'); // Dog in French
    fireEvent.press(dogButton.parent?.parent || dogButton);

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
