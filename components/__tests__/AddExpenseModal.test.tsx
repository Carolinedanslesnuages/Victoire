/**
 * Component tests for AddExpenseModal
 * Testing form input, validation, and transaction submission
 */

import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import AddExpenseModal from '../AddExpenseModal';
import { Alert } from 'react-native';

// Mock Alert
jest.spyOn(Alert, 'alert');

describe('AddExpenseModal Component Tests', () => {
  const mockOnClose = jest.fn();
  const mockOnAddExpense = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Modal Visibility and Basic Rendering', () => {
    it('should render when visible prop is true', () => {
      const { getAllByText } = render(
        <AddExpenseModal
          visible={true}
          onClose={mockOnClose}
          onAddExpense={mockOnAddExpense}
        />
      );

      const title = getAllByText(/Ajouter une dépense|Nouvelle dépense|Add Expense/i);
      expect(title.length).toBeGreaterThan(0);
    });

    it('should render all required input fields', () => {
      const { getByPlaceholderText, getAllByText } = render(
        <AddExpenseModal
          visible={true}
          onClose={mockOnClose}
          onAddExpense={mockOnAddExpense}
        />
      );

      // Check for amount input with actual placeholder
      const amountInput = getByPlaceholderText(/Ex: 15\.50|Ex: 15.50/);
      expect(amountInput).toBeTruthy();

      // Check for description input with actual placeholder
      const descriptionInput = getByPlaceholderText(/Ex: Courses, Restaurant/i);
      expect(descriptionInput).toBeTruthy();

      // Check for category input with actual placeholder
      const categoryInput = getByPlaceholderText(/Ex: Alimentation, Transport/i);
      expect(categoryInput).toBeTruthy();
    });

    it('should render submit and cancel buttons', () => {
      const { getAllByText } = render(
        <AddExpenseModal
          visible={true}
          onClose={mockOnClose}
          onAddExpense={mockOnAddExpense}
        />
      );

      const submitButtons = getAllByText(/Ajouter/i);
      expect(submitButtons.length).toBeGreaterThan(0);

      const cancelButton = getAllByText(/Annuler/i);
      expect(cancelButton.length).toBeGreaterThan(0);
    });
  });

  describe('Form Input and Validation', () => {
    it('should update amount input when user types', () => {
      const { getByPlaceholderText, getAllByText } = render(
        <AddExpenseModal
          visible={true}
          onClose={mockOnClose}
          onAddExpense={mockOnAddExpense}
        />
      );

      const amountInput = getByPlaceholderText(/Ex: 15\.50|Ex: 15.50/);
      fireEvent.changeText(amountInput, '50.5');

      expect(amountInput.props.value).toBe('50.5');
    });

    it('should update description input when user types', () => {
      const { getByPlaceholderText, getAllByText } = render(
        <AddExpenseModal
          visible={true}
          onClose={mockOnClose}
          onAddExpense={mockOnAddExpense}
        />
      );

      const descriptionInput = getByPlaceholderText(/Ex: Courses, Restaurant/i);
      fireEvent.changeText(descriptionInput, 'Café du matin');

      expect(descriptionInput.props.value).toBe('Café du matin');
    });

    it('should update category input when user types', () => {
      const { getByPlaceholderText, getAllByText } = render(
        <AddExpenseModal
          visible={true}
          onClose={mockOnClose}
          onAddExpense={mockOnAddExpense}
        />
      );

      const categoryInput = getByPlaceholderText(/Ex: Alimentation, Transport/i);
      fireEvent.changeText(categoryInput, 'Alimentation');

      expect(categoryInput.props.value).toBe('Alimentation');
    });

    it('should show error alert when amount is invalid', async () => {
      const { getByPlaceholderText, getAllByText } = render(
        <AddExpenseModal
          visible={true}
          onClose={mockOnClose}
          onAddExpense={mockOnAddExpense}
        />
      );

      const amountInput = getByPlaceholderText(/Ex: 15\.50|Ex: 15.50/);
      const descriptionInput = getByPlaceholderText(/Ex: Courses, Restaurant/i);
      const submitButton = getAllByText(/Ajouter/i)[0];

      fireEvent.changeText(amountInput, 'invalid');
      fireEvent.changeText(descriptionInput, 'Test Description');
      fireEvent.press(submitButton);

      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalled();
      });
    });

    it('should show error alert when amount is zero', async () => {
      const { getByPlaceholderText, getAllByText } = render(
        <AddExpenseModal
          visible={true}
          onClose={mockOnClose}
          onAddExpense={mockOnAddExpense}
        />
      );

      const amountInput = getByPlaceholderText(/Ex: 15\.50|Ex: 15.50/);
      const descriptionInput = getByPlaceholderText(/Ex: Courses, Restaurant/i);
      const submitButton = getAllByText(/Ajouter/i)[0];

      fireEvent.changeText(amountInput, '0');
      fireEvent.changeText(descriptionInput, 'Test Description');
      fireEvent.press(submitButton);

      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalled();
      });
    });

    it('should show error alert when description is missing', async () => {
      const { getByPlaceholderText, getAllByText } = render(
        <AddExpenseModal
          visible={true}
          onClose={mockOnClose}
          onAddExpense={mockOnAddExpense}
        />
      );

      const amountInput = getByPlaceholderText(/Ex: 15\.50|Ex: 15.50/);
      const submitButton = getAllByText(/Ajouter/i)[0];

      fireEvent.changeText(amountInput, '50');
      fireEvent.press(submitButton);

      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalled();
      });
    });
  });

  describe('Expense Submission', () => {
    it('should call onAddExpense with correct data when form is valid', async () => {
      const { getByPlaceholderText, getAllByText } = render(
        <AddExpenseModal
          visible={true}
          onClose={mockOnClose}
          onAddExpense={mockOnAddExpense}
        />
      );

      const amountInput = getByPlaceholderText(/Ex: 15\.50|Ex: 15.50/);
      const descriptionInput = getByPlaceholderText(/Ex: Courses, Restaurant/i);
      const categoryInput = getByPlaceholderText(/Ex: Alimentation, Transport/i);
      const submitButton = getAllByText(/Ajouter/i)[0];

      fireEvent.changeText(amountInput, '75.50');
      fireEvent.changeText(descriptionInput, 'Restaurant');
      fireEvent.changeText(categoryInput, 'Loisirs');
      fireEvent.press(submitButton);

      await waitFor(() => {
        expect(mockOnAddExpense).toHaveBeenCalledWith({
          amount: 75.50,
          description: 'Restaurant',
          category: 'Loisirs',
          date: expect.any(String),
        });
      });
    });

    it('should call onClose after successful submission', async () => {
      const { getByPlaceholderText, getAllByText } = render(
        <AddExpenseModal
          visible={true}
          onClose={mockOnClose}
          onAddExpense={mockOnAddExpense}
        />
      );

      const amountInput = getByPlaceholderText(/Ex: 15\.50|Ex: 15.50/);
      const descriptionInput = getByPlaceholderText(/Ex: Courses, Restaurant/i);
      const submitButton = getAllByText(/Ajouter/i)[0];

      fireEvent.changeText(amountInput, '50');
      fireEvent.changeText(descriptionInput, 'Test');
      fireEvent.press(submitButton);

      await waitFor(() => {
        expect(mockOnClose).toHaveBeenCalled();
      });
    });

    it('should handle submission without category (optional field)', async () => {
      const { getByPlaceholderText, getAllByText } = render(
        <AddExpenseModal
          visible={true}
          onClose={mockOnClose}
          onAddExpense={mockOnAddExpense}
        />
      );

      const amountInput = getByPlaceholderText(/Ex: 15\.50|Ex: 15.50/);
      const descriptionInput = getByPlaceholderText(/Ex: Courses, Restaurant/i);
      const submitButton = getAllByText(/Ajouter/i)[0];

      fireEvent.changeText(amountInput, '25');
      fireEvent.changeText(descriptionInput, 'Sans catégorie');
      fireEvent.press(submitButton);

      await waitFor(() => {
        expect(mockOnAddExpense).toHaveBeenCalledWith({
          amount: 25,
          description: 'Sans catégorie',
          category: undefined,
          date: expect.any(String),
        });
      });
    });

    it('should reset form fields after successful submission', async () => {
      const { getByPlaceholderText, getAllByText } = render(
        <AddExpenseModal
          visible={true}
          onClose={mockOnClose}
          onAddExpense={mockOnAddExpense}
        />
      );

      const amountInput = getByPlaceholderText(/Ex: 15\.50|Ex: 15.50/);
      const descriptionInput = getByPlaceholderText(/Ex: Courses, Restaurant/i);
      const categoryInput = getByPlaceholderText(/Ex: Alimentation, Transport/i);
      const submitButton = getAllByText(/Ajouter/i)[0];

      fireEvent.changeText(amountInput, '100');
      fireEvent.changeText(descriptionInput, 'Test');
      fireEvent.changeText(categoryInput, 'Test Category');
      fireEvent.press(submitButton);

      await waitFor(() => {
        expect(mockOnAddExpense).toHaveBeenCalled();
      });

      // Fields should be reset
      expect(amountInput.props.value).toBe('');
      expect(descriptionInput.props.value).toBe('');
      expect(categoryInput.props.value).toBe('');
    });
  });

  describe('Cancel Functionality', () => {
    it('should call onClose when cancel button is pressed', () => {
      const { getAllByText } = render(
        <AddExpenseModal
          visible={true}
          onClose={mockOnClose}
          onAddExpense={mockOnAddExpense}
        />
      );

      const cancelButton = getAllByText(/Annuler/i)[0];
      fireEvent.press(cancelButton);

      expect(mockOnClose).toHaveBeenCalled();
    });

    it('should reset form fields when cancelled', () => {
      const { getByPlaceholderText, getAllByText } = render(
        <AddExpenseModal
          visible={true}
          onClose={mockOnClose}
          onAddExpense={mockOnAddExpense}
        />
      );

      const amountInput = getByPlaceholderText(/Ex: 15\.50|Ex: 15.50/);
      const descriptionInput = getByPlaceholderText(/Ex: Courses, Restaurant/i);
      const cancelButton = getAllByText(/Annuler/i)[0];

      fireEvent.changeText(amountInput, '50');
      fireEvent.changeText(descriptionInput, 'Test');
      fireEvent.press(cancelButton);

      expect(amountInput.props.value).toBe('');
      expect(descriptionInput.props.value).toBe('');
    });
  });

  describe('Custom Categories', () => {
    it('should display custom category chips when provided', () => {
      const customCategories = ['Alimentation', 'Transport', 'Loisirs'];

      const { getAllByText } = render(
        <AddExpenseModal
          visible={true}
          onClose={mockOnClose}
          onAddExpense={mockOnAddExpense}
          customCategories={customCategories}
        />
      );

      const alimentationChip = getByText('Alimentation');
      expect(alimentationChip).toBeTruthy();

      const transportChip = getByText('Transport');
      expect(transportChip).toBeTruthy();

      const loisirsChip = getByText('Loisirs');
      expect(loisirsChip).toBeTruthy();
    });

    it('should set category when custom category chip is pressed', () => {
      const customCategories = ['Alimentation'];

      const { getByText, getByPlaceholderText } = render(
        <AddExpenseModal
          visible={true}
          onClose={mockOnClose}
          onAddExpense={mockOnAddExpense}
          customCategories={customCategories}
        />
      );

      const categoryInput = getByPlaceholderText(/Ex: Alimentation, Transport/i);
      const alimentationChip = getByText('Alimentation');

      fireEvent.press(alimentationChip);

      expect(categoryInput.props.value).toBe('Alimentation');
    });
  });
});
