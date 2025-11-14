import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import ConfigWizard from '../ConfigWizard';
import { BudgetProfile } from '../../types';

// Mock the storage module
jest.mock('../../utils/storage', () => ({
  saveUserPreferences: jest.fn(),
  loadUserPreferences: jest.fn().mockResolvedValue({ currency: 'EUR', customCategories: [] }),
}));

describe('ConfigWizard', () => {
  const mockOnComplete = jest.fn();
  const mockOnCancel = jest.fn();

  const mockExistingProfile: BudgetProfile = {
    id: 'test-profile-1',
    type: 'personal',
    name: 'Test Budget',
    monthlyIncome: 3000,
    fixedCharges: 1500,
    savingsGoal: 500,
    cycleStartDay: 15,
    createdAt: '2024-01-01T00:00:00.000Z',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Create Mode', () => {
    it('should render in create mode by default', () => {
      const { getByText, queryByText } = render(
        <ConfigWizard onComplete={mockOnComplete} />
      );

      expect(getByText('Configuration Budgétaire')).toBeTruthy();
      // No back button in create mode
      expect(queryByText(/Retour/)).toBeNull();
    });

    it('should have empty form fields in create mode', () => {
      const { getByPlaceholderText } = render(
        <ConfigWizard onComplete={mockOnComplete} />
      );

      const incomeInput = getByPlaceholderText('Ex: 2500');
      const chargesInput = getByPlaceholderText('Ex: 1200');
      const savingsInput = getByPlaceholderText('Ex: 300');
      const cycleInput = getByPlaceholderText('Ex: 5');

      expect(incomeInput.props.value).toBe('');
      expect(chargesInput.props.value).toBe('');
      expect(savingsInput.props.value).toBe('');
      expect(cycleInput.props.value).toBe('');
    });
  });

  describe('Edit Mode', () => {
    it('should render back button in edit mode', () => {
      const { getByText } = render(
        <ConfigWizard
          onComplete={mockOnComplete}
          onCancel={mockOnCancel}
          mode="edit"
          existingProfile={mockExistingProfile}
        />
      );

      expect(getByText(/Retour/)).toBeTruthy();
    });

    it('should pre-populate form fields with existing profile data', () => {
      const { getByDisplayValue } = render(
        <ConfigWizard
          onComplete={mockOnComplete}
          onCancel={mockOnCancel}
          mode="edit"
          existingProfile={mockExistingProfile}
        />
      );

      expect(getByDisplayValue('3000')).toBeTruthy();
      expect(getByDisplayValue('1500')).toBeTruthy();
      expect(getByDisplayValue('500')).toBeTruthy();
      expect(getByDisplayValue('15')).toBeTruthy();
    });

    it('should call onCancel when back button is pressed', () => {
      const { getByText } = render(
        <ConfigWizard
          onComplete={mockOnComplete}
          onCancel={mockOnCancel}
          mode="edit"
          existingProfile={mockExistingProfile}
        />
      );

      const backButton = getByText(/Retour/);
      fireEvent.press(backButton);

      expect(mockOnCancel).toHaveBeenCalled();
    });

    it('should call onComplete with profileId when submitting in edit mode', async () => {
      const { getByText } = render(
        <ConfigWizard
          onComplete={mockOnComplete}
          onCancel={mockOnCancel}
          mode="edit"
          existingProfile={mockExistingProfile}
        />
      );

      const saveButton = getByText('Enregistrer');
      fireEvent.press(saveButton);

      await waitFor(() => {
        expect(mockOnComplete).toHaveBeenCalledWith(
          expect.objectContaining({
            monthlyIncome: 3000,
            fixedCharges: 1500,
            savingsGoal: 500,
            cycleStartDay: 15,
            profileId: 'test-profile-1',
          })
        );
      });
    });

    it('should allow editing values in edit mode', () => {
      const { getByDisplayValue } = render(
        <ConfigWizard
          onComplete={mockOnComplete}
          onCancel={mockOnCancel}
          mode="edit"
          existingProfile={mockExistingProfile}
        />
      );

      const incomeInput = getByDisplayValue('3000');
      fireEvent.changeText(incomeInput, '3500');

      expect(getByDisplayValue('3500')).toBeTruthy();
    });

    it('should not show avatar selection step in edit mode', async () => {
      const { getByText, queryByText } = render(
        <ConfigWizard
          onComplete={mockOnComplete}
          onCancel={mockOnCancel}
          mode="edit"
          existingProfile={mockExistingProfile}
        />
      );

      const saveButton = getByText('Enregistrer');
      fireEvent.press(saveButton);

      // Should complete directly without avatar selection
      await waitFor(() => {
        expect(mockOnComplete).toHaveBeenCalled();
      });

      // Avatar selection title should not appear (checking for multiple possible strings)
      expect(queryByText(/Choisissez votre avatar|Personnalisez votre profil/i)).toBeNull();
    });
  });

  describe('Mid-Cycle Onboarding', () => {
    beforeEach(() => {
      // Mock the current date to be mid-cycle (e.g., day 20 of the month)
      jest.useFakeTimers();
      jest.setSystemTime(new Date(2024, 0, 20)); // January 20, 2024
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should show mid-cycle screen when cycle start day is before current day', async () => {
      const { getByText, getByPlaceholderText } = render(
        <ConfigWizard onComplete={mockOnComplete} />
      );

      // Fill in budget config with cycle start day = 5 (before current day 20)
      fireEvent.changeText(getByPlaceholderText('Ex: 2500'), '2500');
      fireEvent.changeText(getByPlaceholderText('Ex: 1200'), '1000');
      fireEvent.changeText(getByPlaceholderText('Ex: 300'), '200');
      fireEvent.changeText(getByPlaceholderText('Ex: 5'), '5'); // Cycle starts on day 5

      const saveButton = getByText('Enregistrer');
      fireEvent.press(saveButton);

      // Should show mid-cycle screen
      await waitFor(() => {
        expect(getByText('Rattrapage du Cycle en Cours')).toBeTruthy();
      });
    });

    it('should not show mid-cycle screen when cycle start day is after current day', async () => {
      const { getByText, getByPlaceholderText, queryByText } = render(
        <ConfigWizard onComplete={mockOnComplete} />
      );

      // Fill in budget config with cycle start day = 25 (after current day 20)
      fireEvent.changeText(getByPlaceholderText('Ex: 2500'), '2500');
      fireEvent.changeText(getByPlaceholderText('Ex: 1200'), '1000');
      fireEvent.changeText(getByPlaceholderText('Ex: 300'), '200');
      fireEvent.changeText(getByPlaceholderText('Ex: 5'), '25'); // Cycle starts on day 25

      const saveButton = getByText('Enregistrer');
      fireEvent.press(saveButton);

      // Should NOT show mid-cycle screen, should go to avatar selection
      await waitFor(() => {
        expect(queryByText('Rattrapage du Cycle en Cours')).toBeNull();
      });
    });

    it('should accept remaining amount in mid-cycle screen', async () => {
      const { getByText, getByPlaceholderText } = render(
        <ConfigWizard onComplete={mockOnComplete} />
      );

      // First step: Fill in budget config
      fireEvent.changeText(getByPlaceholderText('Ex: 2500'), '2500');
      fireEvent.changeText(getByPlaceholderText('Ex: 1200'), '1000');
      fireEvent.changeText(getByPlaceholderText('Ex: 300'), '200');
      fireEvent.changeText(getByPlaceholderText('Ex: 5'), '5');

      fireEvent.press(getByText('Enregistrer'));

      // Second step: Fill in remaining amount
      await waitFor(() => {
        expect(getByText('Rattrapage du Cycle en Cours')).toBeTruthy();
      });

      const remainingAmountInput = getByPlaceholderText('Ex: 450');
      fireEvent.changeText(remainingAmountInput, '450');

      fireEvent.press(getByText('Enregistrer'));

      // Should proceed to avatar selection
      await waitFor(() => {
        expect(getByText(/Personnalisez votre profil/i)).toBeTruthy();
      });
    });

    it('should validate remaining amount in mid-cycle screen', async () => {
      const { getByText, getByPlaceholderText } = render(
        <ConfigWizard onComplete={mockOnComplete} />
      );

      // First step: Fill in budget config
      fireEvent.changeText(getByPlaceholderText('Ex: 2500'), '2500');
      fireEvent.changeText(getByPlaceholderText('Ex: 1200'), '1000');
      fireEvent.changeText(getByPlaceholderText('Ex: 300'), '200');
      fireEvent.changeText(getByPlaceholderText('Ex: 5'), '5');

      fireEvent.press(getByText('Enregistrer'));

      await waitFor(() => {
        expect(getByText('Rattrapage du Cycle en Cours')).toBeTruthy();
      });

      // Try to submit with invalid remaining amount
      const remainingAmountInput = getByPlaceholderText('Ex: 450');
      fireEvent.changeText(remainingAmountInput, '-50'); // Invalid: negative

      fireEvent.press(getByText('Enregistrer'));

      // Should not proceed
      await waitFor(() => {
        expect(mockOnComplete).not.toHaveBeenCalled();
      });
    });

    it('should show informational message about next cycle in mid-cycle screen', async () => {
      const { getByText, getByPlaceholderText } = render(
        <ConfigWizard onComplete={mockOnComplete} />
      );

      // Fill in budget config
      fireEvent.changeText(getByPlaceholderText('Ex: 2500'), '2500');
      fireEvent.changeText(getByPlaceholderText('Ex: 1200'), '1000');
      fireEvent.changeText(getByPlaceholderText('Ex: 300'), '200');
      fireEvent.changeText(getByPlaceholderText('Ex: 5'), '5');

      fireEvent.press(getByText('Enregistrer'));

      // Should show informational message
      await waitFor(() => {
        expect(getByText(/Votre budget complet.*démarrera automatiquement/)).toBeTruthy();
      });
    });

    it('should include midCycleOnboarding data when completing wizard', async () => {
      const { getByText, getByPlaceholderText } = render(
        <ConfigWizard onComplete={mockOnComplete} />
      );

      // First step: Fill in budget config
      fireEvent.changeText(getByPlaceholderText('Ex: 2500'), '2500');
      fireEvent.changeText(getByPlaceholderText('Ex: 1200'), '1000');
      fireEvent.changeText(getByPlaceholderText('Ex: 300'), '200');
      fireEvent.changeText(getByPlaceholderText('Ex: 5'), '5');
      fireEvent.press(getByText('Enregistrer'));

      // Second step: Fill in remaining amount
      await waitFor(() => {
        expect(getByText('Rattrapage du Cycle en Cours')).toBeTruthy();
      });
      fireEvent.changeText(getByPlaceholderText('Ex: 450'), '450');
      fireEvent.press(getByText('Enregistrer'));

      // Third step: Avatar selection - skip to complete
      await waitFor(() => {
        expect(getByText(/Continuer/i)).toBeTruthy();
      });
      fireEvent.press(getByText(/Continuer/i));

      // Should call onComplete with midCycleOnboarding data
      await waitFor(() => {
        expect(mockOnComplete).toHaveBeenCalledWith(
          expect.objectContaining({
            monthlyIncome: 2500,
            fixedCharges: 1000,
            savingsGoal: 200,
            cycleStartDay: 5,
            midCycleOnboarding: expect.objectContaining({
              remainingAmount: 450,
              cycleEndDate: expect.any(String),
            }),
          })
        );
      });
    });
  });

  describe('Form Validation', () => {
    it('should validate monthly income', async () => {
      const { getByText, getByPlaceholderText } = render(
        <ConfigWizard onComplete={mockOnComplete} />
      );

      // Fill in other fields but leave income invalid
      fireEvent.changeText(getByPlaceholderText('Ex: 2500'), '-100');
      fireEvent.changeText(getByPlaceholderText('Ex: 1200'), '1000');
      fireEvent.changeText(getByPlaceholderText('Ex: 300'), '200');
      fireEvent.changeText(getByPlaceholderText('Ex: 5'), '10');

      const saveButton = getByText('Enregistrer');
      fireEvent.press(saveButton);

      // onComplete should not be called due to validation error
      await waitFor(() => {
        expect(mockOnComplete).not.toHaveBeenCalled();
      });
    });

    it('should validate cycle start day range', async () => {
      const { getByText, getByPlaceholderText } = render(
        <ConfigWizard onComplete={mockOnComplete} />
      );

      fireEvent.changeText(getByPlaceholderText('Ex: 2500'), '2500');
      fireEvent.changeText(getByPlaceholderText('Ex: 1200'), '1000');
      fireEvent.changeText(getByPlaceholderText('Ex: 300'), '200');
      fireEvent.changeText(getByPlaceholderText('Ex: 5'), '35'); // Invalid: > 31

      const saveButton = getByText('Enregistrer');
      fireEvent.press(saveButton);

      await waitFor(() => {
        expect(mockOnComplete).not.toHaveBeenCalled();
      });
    });
  });
});
