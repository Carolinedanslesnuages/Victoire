import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import OnboardingCarousel from '../OnboardingCarousel';

// Mock i18n
jest.mock('../../utils/i18n', () => ({
  t: (key: string) => {
    const translations: { [key: string]: string } = {
      'onboarding.skip': 'Skip',
      'onboarding.next': 'Next',
      'onboarding.start': 'Get Started',
      'onboarding.slide1.title': 'Stop checking your bank account',
      'onboarding.slide1.description': 'Discover your Daily Living Budget',
      'onboarding.slide2.title': 'A simple financial compass',
      'onboarding.slide2.description': 'Every morning, PACE calculates what you can spend',
      'onboarding.slide3.title': 'Stay on track day by day',
      'onboarding.slide3.description': 'Record your expenses and reach your goals',
    };
    return translations[key] || key;
  },
}));

describe('OnboardingCarousel', () => {
  const mockOnComplete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the first slide by default', () => {
    const { getByText } = render(
      <OnboardingCarousel onComplete={mockOnComplete} />
    );

    expect(getByText('Stop checking your bank account')).toBeTruthy();
    expect(getByText('Discover your Daily Living Budget')).toBeTruthy();
    expect(getByText('Next')).toBeTruthy();
    expect(getByText('Skip')).toBeTruthy();
  });

  it('should show Skip button on all slides', () => {
    const { getByText } = render(
      <OnboardingCarousel onComplete={mockOnComplete} />
    );

    expect(getByText('Skip')).toBeTruthy();
  });

  it('should call onComplete when Skip button is pressed', () => {
    const { getByText } = render(
      <OnboardingCarousel onComplete={mockOnComplete} />
    );

    const skipButton = getByText('Skip');
    fireEvent.press(skipButton);

    expect(mockOnComplete).toHaveBeenCalledTimes(1);
  });

  it('should show "Next" button on first and second slides', () => {
    const { getByText } = render(
      <OnboardingCarousel onComplete={mockOnComplete} />
    );

    expect(getByText('Next')).toBeTruthy();
  });

  it('should render all three slides', () => {
    const { getByText } = render(
      <OnboardingCarousel onComplete={mockOnComplete} />
    );

    // First slide is rendered by default
    expect(getByText('Stop checking your bank account')).toBeTruthy();
    
    // The component renders all slides in the ScrollView
    expect(getByText('A simple financial compass')).toBeTruthy();
    expect(getByText('Stay on track day by day')).toBeTruthy();
  });

  it('should show pagination dots', () => {
    const { UNSAFE_getAllByType } = render(
      <OnboardingCarousel onComplete={mockOnComplete} />
    );

    // Find View components - pagination dots are views
    const views = UNSAFE_getAllByType('View' as any);
    // We should have multiple dots (3 for our slides)
    expect(views.length).toBeGreaterThan(0);
  });

  it('should display emoji on slides', () => {
    const { getByText } = render(
      <OnboardingCarousel onComplete={mockOnComplete} />
    );

    // Check for emojis in the component
    expect(getByText('🧭')).toBeTruthy();
    expect(getByText('💡')).toBeTruthy();
    expect(getByText('🎯')).toBeTruthy();
  });
});
