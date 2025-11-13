import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ZeroSpendingModal from '../ZeroSpendingModal';
import { ThemeProvider } from '../../contexts/ThemeContext';

// Mock i18n
jest.mock('../../utils/i18n', () => ({
  t: (key: string) => {
    const translations: { [key: string]: string } = {
      'dashboard.zeroSpending.modalTitle': 'Congratulations! 🎉',
      'dashboard.zeroSpending.todayBudget': 'Your daily budget was',
      'dashboard.zeroSpending.redistributed': 'By not spending today, this amount is redistributed across the',
      'dashboard.zeroSpending.remainingDays': 'remaining days',
      'dashboard.zeroSpending.remainingDay': 'remaining day',
      'dashboard.zeroSpending.newDailyBudget': 'Your new daily budget is now',
      'dashboard.zeroSpending.orSave': 'You can also choose to save this amount!',
      'dashboard.zeroSpending.potentialSavings': 'Potential savings',
      'dashboard.zeroSpending.close': 'Great!',
    };
    return translations[key] || key;
  },
}));

const formatCurrency = (amount: number) => `€${amount.toFixed(2)}`;

describe('ZeroSpendingModal', () => {
  const defaultProps = {
    visible: true,
    onClose: jest.fn(),
    currentDailyBudget: 25.50,
    newDailyBudget: 30.00,
    daysRemaining: 10,
    formatCurrency,
  };

  it('should render when visible', () => {
    const { getByText } = render(
      <ThemeProvider>
        <ZeroSpendingModal {...defaultProps} />
      </ThemeProvider>
    );

    expect(getByText('Congratulations! 🎉')).toBeTruthy();
  });

  it('should display the current daily budget', () => {
    const { getAllByText } = render(
      <ThemeProvider>
        <ZeroSpendingModal {...defaultProps} />
      </ThemeProvider>
    );

    // Current daily budget appears twice (once as today's budget, once as potential savings)
    const amounts = getAllByText('€25.50');
    expect(amounts.length).toBeGreaterThanOrEqual(1);
  });

  it('should display the new daily budget', () => {
    const { getByText } = render(
      <ThemeProvider>
        <ZeroSpendingModal {...defaultProps} />
      </ThemeProvider>
    );

    expect(getByText('€30.00')).toBeTruthy();
  });

  it('should display days remaining (plural)', () => {
    const { getByText } = render(
      <ThemeProvider>
        <ZeroSpendingModal {...defaultProps} daysRemaining={10} />
      </ThemeProvider>
    );

    expect(getByText(/10 remaining days/)).toBeTruthy();
  });

  it('should display day remaining (singular)', () => {
    const { getByText } = render(
      <ThemeProvider>
        <ZeroSpendingModal {...defaultProps} daysRemaining={1} />
      </ThemeProvider>
    );

    expect(getByText(/1 remaining day/)).toBeTruthy();
  });

  it('should display potential savings', () => {
    const { getAllByText } = render(
      <ThemeProvider>
        <ZeroSpendingModal {...defaultProps} />
      </ThemeProvider>
    );

    // Current daily budget appears twice: once as "today's budget" and once as "potential savings"
    const amounts = getAllByText('€25.50');
    expect(amounts.length).toBeGreaterThanOrEqual(2);
  });

  it('should call onClose when close button is pressed', () => {
    const onCloseMock = jest.fn();
    const { getByText } = render(
      <ThemeProvider>
        <ZeroSpendingModal {...defaultProps} onClose={onCloseMock} />
      </ThemeProvider>
    );

    const closeButton = getByText('Great!');
    fireEvent.press(closeButton);
    
    expect(onCloseMock).toHaveBeenCalled();
  });

  it('should not render when not visible', () => {
    const { queryByText } = render(
      <ThemeProvider>
        <ZeroSpendingModal {...defaultProps} visible={false} />
      </ThemeProvider>
    );

    expect(queryByText('Congratulations! 🎉')).toBeNull();
  });

  it('should display savings encouragement text', () => {
    const { getByText } = render(
      <ThemeProvider>
        <ZeroSpendingModal {...defaultProps} />
      </ThemeProvider>
    );

    expect(getByText('You can also choose to save this amount!')).toBeTruthy();
  });
});
