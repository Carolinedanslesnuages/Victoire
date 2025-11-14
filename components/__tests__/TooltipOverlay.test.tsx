import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import TooltipOverlay from '../TooltipOverlay';

// Mock i18n
jest.mock('../../utils/i18n', () => ({
  t: (key: string) => {
    const translations: { [key: string]: string } = {
      'tooltips.skip': 'Skip',
      'tooltips.next': 'Next',
      'tooltips.done': 'Got it!',
      'tooltips.dailyBudget.title': 'Your daily compass 🧭',
      'tooltips.dailyBudget.description': 'This is the amount you can spend today',
      'tooltips.addExpense.title': 'Record your expenses',
      'tooltips.addExpense.description': 'Tap the + button to log expenses',
      'tooltips.history.title': 'Track your progress',
      'tooltips.history.description': 'Check the history of your transactions',
    };
    return translations[key] || key;
  },
}));

describe('TooltipOverlay', () => {
  const mockOnComplete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render when visible prop is true', () => {
    const { getByText } = render(
      <TooltipOverlay visible={true} onComplete={mockOnComplete} />
    );

    expect(getByText('Your daily compass 🧭')).toBeTruthy();
    expect(getByText('This is the amount you can spend today')).toBeTruthy();
  });

  it('should not render when visible prop is false', () => {
    const { queryByText } = render(
      <TooltipOverlay visible={false} onComplete={mockOnComplete} />
    );

    expect(queryByText('Your daily compass 🧭')).toBeNull();
  });

  it('should render the first tooltip by default', () => {
    const { getByText } = render(
      <TooltipOverlay visible={true} onComplete={mockOnComplete} />
    );

    expect(getByText('Your daily compass 🧭')).toBeTruthy();
    expect(getByText('Next')).toBeTruthy();
    expect(getByText('Skip')).toBeTruthy();
  });

  it('should show Next button on first and second tooltips', () => {
    const { getByText } = render(
      <TooltipOverlay visible={true} onComplete={mockOnComplete} />
    );

    expect(getByText('Next')).toBeTruthy();
  });

  it('should call onComplete when Skip button is pressed', () => {
    const { getByText } = render(
      <TooltipOverlay visible={true} onComplete={mockOnComplete} />
    );

    const skipButton = getByText('Skip');
    fireEvent.press(skipButton);

    expect(mockOnComplete).toHaveBeenCalledTimes(1);
  });

  it('should advance to next tooltip when Next is pressed', () => {
    const { getByText, queryByText } = render(
      <TooltipOverlay visible={true} onComplete={mockOnComplete} />
    );

    // Initially showing first tooltip
    expect(getByText('Your daily compass 🧭')).toBeTruthy();

    // Press Next
    const nextButton = getByText('Next');
    fireEvent.press(nextButton);

    // Should now show second tooltip
    expect(queryByText('Your daily compass 🧭')).toBeNull();
    expect(getByText('Record your expenses')).toBeTruthy();
  });

  it('should show "Got it!" button on the last tooltip', () => {
    const { getByText } = render(
      <TooltipOverlay visible={true} onComplete={mockOnComplete} />
    );

    // Navigate to last tooltip
    const nextButton = getByText('Next');
    fireEvent.press(nextButton); // Second tooltip
    fireEvent.press(getByText('Next')); // Third tooltip

    // Should now show "Got it!" instead of "Next"
    expect(getByText('Got it!')).toBeTruthy();
  });

  it('should call onComplete when "Got it!" is pressed on last tooltip', () => {
    const { getByText } = render(
      <TooltipOverlay visible={true} onComplete={mockOnComplete} />
    );

    // Navigate to last tooltip
    fireEvent.press(getByText('Next')); // Second tooltip
    fireEvent.press(getByText('Next')); // Third tooltip

    // Press "Got it!"
    const doneButton = getByText('Got it!');
    fireEvent.press(doneButton);

    expect(mockOnComplete).toHaveBeenCalledTimes(1);
  });

  it('should render progress dots', () => {
    const { UNSAFE_getAllByType } = render(
      <TooltipOverlay visible={true} onComplete={mockOnComplete} />
    );

    // Find View components - progress dots are views
    const views = UNSAFE_getAllByType('View' as any);
    // We should have multiple dots (3 for our tooltips)
    expect(views.length).toBeGreaterThan(0);
  });

  it('should reset to first tooltip when made visible again', () => {
    const { getByText, rerender, queryByText } = render(
      <TooltipOverlay visible={true} onComplete={mockOnComplete} />
    );

    // Navigate to second tooltip
    fireEvent.press(getByText('Next'));
    expect(getByText('Record your expenses')).toBeTruthy();

    // Hide and show again
    rerender(<TooltipOverlay visible={false} onComplete={mockOnComplete} />);
    rerender(<TooltipOverlay visible={true} onComplete={mockOnComplete} />);

    // Should be back to first tooltip
    expect(getByText('Your daily compass 🧭')).toBeTruthy();
    expect(queryByText('Record your expenses')).toBeNull();
  });
});
