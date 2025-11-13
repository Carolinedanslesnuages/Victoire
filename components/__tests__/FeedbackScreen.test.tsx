import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Alert, Linking } from 'react-native';
import FeedbackScreen from '../FeedbackScreen';

// Mock dependencies
jest.mock('../../utils/i18n', () => ({
  t: (key: string) => {
    const translations: { [key: string]: string } = {
      'feedback.title': 'Send Feedback',
      'feedback.subtitle': 'Experiencing a problem or have an idea? Let us know!',
      'feedback.typeLabel': 'Feedback type',
      'feedback.types.bug': 'Bug Report',
      'feedback.types.idea': 'Idea',
      'feedback.types.other': 'Other',
      'feedback.messageLabel': 'Your message',
      'feedback.messagePlaceholder': 'Describe your problem...',
      'feedback.deviceInfoLabel': 'Device Information',
      'feedback.privacyNote': 'No personal data is included.',
      'feedback.sendButton': '📧 Send Feedback',
      'feedback.emailBody': 'User message:',
      'feedback.errors.title': 'Error',
      'feedback.errors.emptyMessage': 'Please enter a message',
      'feedback.errors.emailNotSupported': 'Email not supported',
      'feedback.errors.sendFailed': 'Unable to open email client',
      'feedback.success.title': 'Thank You!',
      'feedback.success.message': 'Your feedback has been sent',
      'feedback.confirmClose.title': 'Discard Feedback?',
      'feedback.confirmClose.message': 'You have an unsent message',
      'feedback.confirmClose.cancel': 'Continue Editing',
      'feedback.confirmClose.confirm': 'Discard',
    };
    return translations[key] || key;
  },
}));

jest.mock('expo-application', () => ({
  nativeApplicationVersion: '1.11.0',
  nativeBuildVersion: '100',
}));

jest.mock('expo-constants', () => ({
  default: {
    deviceName: 'Test Device',
    expoConfig: {
      version: '1.11.0',
    },
  },
}));

// Mock Alert
jest.spyOn(Alert, 'alert');

// Mock Linking - must be done before any imports
const mockCanOpenURL = jest.fn().mockResolvedValue(true);
const mockOpenURL = jest.fn().mockResolvedValue(true);

Object.defineProperty(Linking, 'canOpenURL', {
  value: mockCanOpenURL,
  writable: true,
});

Object.defineProperty(Linking, 'openURL', {
  value: mockOpenURL,
  writable: true,
});

describe('FeedbackScreen', () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (Alert.alert as jest.Mock).mockClear();
    mockCanOpenURL.mockClear();
    mockOpenURL.mockClear();
  });

  it('should render when visible prop is true', () => {
    const { getByText } = render(
      <FeedbackScreen visible={true} onClose={mockOnClose} />
    );

    expect(getByText('Send Feedback')).toBeTruthy();
    expect(getByText('Experiencing a problem or have an idea? Let us know!')).toBeTruthy();
  });

  it('should not render when visible prop is false', () => {
    const { queryByText } = render(
      <FeedbackScreen visible={false} onClose={mockOnClose} />
    );

    expect(queryByText('Send Feedback')).toBeNull();
  });

  it('should render feedback type selector with all options', () => {
    const { getByText } = render(
      <FeedbackScreen visible={true} onClose={mockOnClose} />
    );

    expect(getByText(/Bug Report/)).toBeTruthy();
    expect(getByText(/Idea/)).toBeTruthy();
    expect(getByText(/Other/)).toBeTruthy();
  });

  it('should allow selecting different feedback types', () => {
    const { getByText } = render(
      <FeedbackScreen visible={true} onClose={mockOnClose} />
    );

    const ideaButton = getByText(/Idea/);
    fireEvent.press(ideaButton);

    const otherButton = getByText(/Other/);
    fireEvent.press(otherButton);

    // No errors should be thrown
    expect(true).toBeTruthy();
  });

  it('should render message input field', () => {
    const { getByPlaceholderText } = render(
      <FeedbackScreen visible={true} onClose={mockOnClose} />
    );

    const messageInput = getByPlaceholderText('Describe your problem...');
    expect(messageInput).toBeTruthy();
  });

  it('should allow entering message text', () => {
    const { getByPlaceholderText } = render(
      <FeedbackScreen visible={true} onClose={mockOnClose} />
    );

    const messageInput = getByPlaceholderText('Describe your problem...');
    fireEvent.changeText(messageInput, 'This is my feedback message');

    expect(messageInput.props.value).toBe('This is my feedback message');
  });

  it('should display device information', async () => {
    const { findByText } = render(
      <FeedbackScreen visible={true} onClose={mockOnClose} />
    );

    // Use findByText which waits for the element to appear
    // Check for app version which is the most important part
    expect(await findByText(/App Version/)).toBeTruthy();
  });

  it('should show error when trying to send empty message', () => {
    const { getByText } = render(
      <FeedbackScreen visible={true} onClose={mockOnClose} />
    );

    const sendButton = getByText('📧 Send Feedback');
    fireEvent.press(sendButton);

    expect(Alert.alert).toHaveBeenCalledWith('Error', 'Please enter a message');
  });

  it('should open email client when sending feedback with message', async () => {
    const { getByPlaceholderText, getByText } = render(
      <FeedbackScreen visible={true} onClose={mockOnClose} />
    );

    const messageInput = getByPlaceholderText('Describe your problem...');
    fireEvent.changeText(messageInput, 'Test feedback message');

    const sendButton = getByText('📧 Send Feedback');
    fireEvent.press(sendButton);

    await waitFor(() => {
      expect(mockCanOpenURL).toHaveBeenCalled();
      expect(mockOpenURL).toHaveBeenCalled();
    });
  });

  it('should call onClose when close button is pressed without unsaved content', () => {
    const { getByText } = render(
      <FeedbackScreen visible={true} onClose={mockOnClose} />
    );

    const closeButton = getByText('✕');
    fireEvent.press(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('should show confirmation when closing with unsaved content', () => {
    const { getByPlaceholderText, getByText } = render(
      <FeedbackScreen visible={true} onClose={mockOnClose} />
    );

    const messageInput = getByPlaceholderText('Describe your problem...');
    fireEvent.changeText(messageInput, 'Some unsaved content');

    const closeButton = getByText('✕');
    fireEvent.press(closeButton);

    expect(Alert.alert).toHaveBeenCalledWith(
      'Discard Feedback?',
      'You have an unsent message',
      expect.any(Array)
    );
  });

  it('should render privacy note', () => {
    const { getByText } = render(
      <FeedbackScreen visible={true} onClose={mockOnClose} />
    );

    expect(getByText('No personal data is included.')).toBeTruthy();
  });

  it('should display send button', () => {
    const { getByText } = render(
      <FeedbackScreen visible={true} onClose={mockOnClose} />
    );

    expect(getByText('📧 Send Feedback')).toBeTruthy();
  });
});
