import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import FAQScreen from '../FAQScreen';

// Mock i18n
jest.mock('../../utils/i18n', () => ({
  t: (key: string) => {
    const translations: { [key: string]: string } = {
      'faq.title': 'Frequently Asked Questions',
      'faq.subtitle': 'Quickly find answers to common questions about PACE',
      'faq.needMoreHelp': 'Need More Help?',
      'faq.contactMessage': 'Contact us via the Send Feedback button',
      'faq.items.budgetCalculation.question': 'How is my daily budget calculated?',
      'faq.items.budgetCalculation.answer': 'Your budget is calculated based on your monthly income...',
      'faq.items.cycleStartDay.question': 'What is the cycle start day?',
      'faq.items.cycleStartDay.answer': 'The day your budget cycle begins...',
      'faq.items.categories.question': 'How do I use custom categories?',
      'faq.items.categories.answer': 'You can add custom categories in Settings...',
      'faq.items.negativebudget.question': 'What should I do if my budget goes negative?',
      'faq.items.negativebudget.answer': 'Try to reduce your expenses...',
      'faq.items.dataExport.question': 'How do I export my data?',
      'faq.items.dataExport.answer': 'Go to Settings > Data Export...',
      'faq.items.notifications.question': 'How do notifications work?',
      'faq.items.notifications.answer': 'PACE can send three types of notifications...',
    };
    return translations[key] || key;
  },
}));

describe('FAQScreen', () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render when visible prop is true', () => {
    const { getByText } = render(
      <FAQScreen visible={true} onClose={mockOnClose} />
    );

    expect(getByText('Frequently Asked Questions')).toBeTruthy();
    expect(getByText('Quickly find answers to common questions about PACE')).toBeTruthy();
  });

  it('should not render when visible prop is false', () => {
    const { queryByText } = render(
      <FAQScreen visible={false} onClose={mockOnClose} />
    );

    // Modal won't render its content when not visible
    expect(queryByText('Frequently Asked Questions')).toBeNull();
  });

  it('should render all FAQ items', () => {
    const { getByText } = render(
      <FAQScreen visible={true} onClose={mockOnClose} />
    );

    expect(getByText('How is my daily budget calculated?')).toBeTruthy();
    expect(getByText('What is the cycle start day?')).toBeTruthy();
    expect(getByText('How do I use custom categories?')).toBeTruthy();
    expect(getByText('What should I do if my budget goes negative?')).toBeTruthy();
    expect(getByText('How do I export my data?')).toBeTruthy();
    expect(getByText('How do notifications work?')).toBeTruthy();
  });

  it('should expand FAQ item when clicked', () => {
    const { getByText, queryByText } = render(
      <FAQScreen visible={true} onClose={mockOnClose} />
    );

    const question = getByText('How is my daily budget calculated?');
    
    // Answer should not be visible initially
    expect(queryByText('Your budget is calculated based on your monthly income...')).toBeNull();

    // Click to expand
    fireEvent.press(question);

    // Answer should now be visible
    expect(getByText('Your budget is calculated based on your monthly income...')).toBeTruthy();
  });

  it('should collapse FAQ item when clicked again', () => {
    const { getByText, queryByText } = render(
      <FAQScreen visible={true} onClose={mockOnClose} />
    );

    const question = getByText('How is my daily budget calculated?');
    
    // Click to expand
    fireEvent.press(question);
    expect(getByText('Your budget is calculated based on your monthly income...')).toBeTruthy();

    // Click again to collapse
    fireEvent.press(question);
    expect(queryByText('Your budget is calculated based on your monthly income...')).toBeNull();
  });

  it('should call onClose when close button is pressed', () => {
    const { getByText } = render(
      <FAQScreen visible={true} onClose={mockOnClose} />
    );

    const closeButton = getByText('✕');
    fireEvent.press(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('should render help section', () => {
    const { getByText } = render(
      <FAQScreen visible={true} onClose={mockOnClose} />
    );

    expect(getByText('Need More Help?')).toBeTruthy();
    expect(getByText('Contact us via the Send Feedback button')).toBeTruthy();
  });

  it('should only show one expanded item at a time', () => {
    const { getByText, queryByText } = render(
      <FAQScreen visible={true} onClose={mockOnClose} />
    );

    const question1 = getByText('How is my daily budget calculated?');
    const question2 = getByText('What is the cycle start day?');

    // Expand first item
    fireEvent.press(question1);
    expect(getByText('Your budget is calculated based on your monthly income...')).toBeTruthy();

    // Expand second item - first should collapse
    fireEvent.press(question2);
    expect(getByText('The day your budget cycle begins...')).toBeTruthy();
    expect(queryByText('Your budget is calculated based on your monthly income...')).toBeNull();
  });
});
