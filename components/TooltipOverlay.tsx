import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  Dimensions,
} from 'react-native';
import { colors, typography, spacing, borderRadius } from '../constants/theme';
import i18n from '../utils/i18n';

interface TooltipStep {
  id: string;
  title: string;
  description: string;
  position: {
    top?: number;
    bottom?: number;
    left?: number;
    right?: number;
  };
  arrowDirection: 'top' | 'bottom' | 'left' | 'right';
}

interface TooltipOverlayProps {
  visible: boolean;
  onComplete: () => void;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function TooltipOverlay({ visible, onComplete }: TooltipOverlayProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const steps: TooltipStep[] = [
    {
      id: 'daily-budget',
      title: i18n.t('tooltips.dailyBudget.title'),
      description: i18n.t('tooltips.dailyBudget.description'),
      position: {
        top: 150,
        left: SCREEN_WIDTH / 2 - 150,
      },
      arrowDirection: 'top',
    },
    {
      id: 'add-expense',
      title: i18n.t('tooltips.addExpense.title'),
      description: i18n.t('tooltips.addExpense.description'),
      position: {
        bottom: 120,
        left: SCREEN_WIDTH / 2 - 150,
      },
      arrowDirection: 'bottom',
    },
    {
      id: 'history',
      title: i18n.t('tooltips.history.title'),
      description: i18n.t('tooltips.history.description'),
      position: {
        bottom: 100,
        left: 20,
      },
      arrowDirection: 'bottom',
    },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  useEffect(() => {
    if (visible) {
      setCurrentStep(0);
    }
  }, [visible]);

  if (!visible) {
    return null;
  }

  const currentTooltip = steps[currentStep];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleSkip}
    >
      <View style={styles.overlay}>
        {/* Semi-transparent background */}
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={handleSkip}
        />

        {/* Tooltip card */}
        <View style={[styles.tooltipCard, currentTooltip.position]}>
          {/* Arrow */}
          <View
            style={[
              styles.arrow,
              currentTooltip.arrowDirection === 'top' && styles.arrowTop,
              currentTooltip.arrowDirection === 'bottom' && styles.arrowBottom,
              currentTooltip.arrowDirection === 'left' && styles.arrowLeft,
              currentTooltip.arrowDirection === 'right' && styles.arrowRight,
            ]}
          />

          {/* Content */}
          <View style={styles.content}>
            <Text style={styles.title}>{currentTooltip.title}</Text>
            <Text style={styles.description}>{currentTooltip.description}</Text>

            {/* Progress indicator */}
            <View style={styles.progressContainer}>
              {steps.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.progressDot,
                    currentStep === index && styles.progressDotActive,
                  ]}
                />
              ))}
            </View>

            {/* Actions */}
            <View style={styles.actions}>
              <TouchableOpacity
                onPress={handleSkip}
                activeOpacity={0.7}
                style={styles.skipButton}
              >
                <Text style={styles.skipText}>{i18n.t('tooltips.skip')}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleNext}
                activeOpacity={0.7}
                style={styles.nextButton}
              >
                <Text style={styles.nextText}>
                  {currentStep === steps.length - 1
                    ? i18n.t('tooltips.done')
                    : i18n.t('tooltips.next')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    position: 'relative',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.textPrimary,
    opacity: 0.75,
  },
  tooltipCard: {
    position: 'absolute',
    width: 300,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    shadowColor: colors.textPrimary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  arrow: {
    position: 'absolute',
    width: 0,
    height: 0,
    borderStyle: 'solid',
  },
  arrowTop: {
    top: -10,
    left: '50%',
    marginLeft: -10,
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderBottomWidth: 10,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: colors.surface,
  },
  arrowBottom: {
    bottom: -10,
    left: '50%',
    marginLeft: -10,
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderTopWidth: 10,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: colors.surface,
  },
  arrowLeft: {
    left: -10,
    top: '50%',
    marginTop: -10,
    borderTopWidth: 10,
    borderBottomWidth: 10,
    borderRightWidth: 10,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderRightColor: colors.surface,
  },
  arrowRight: {
    right: -10,
    top: '50%',
    marginTop: -10,
    borderTopWidth: 10,
    borderBottomWidth: 10,
    borderLeftWidth: 10,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: colors.surface,
  },
  content: {
    padding: spacing.lg,
  },
  title: {
    fontSize: typography.fontSize.h3,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  description: {
    fontSize: typography.fontSize.body,
    color: colors.textSecondary,
    lineHeight: typography.fontSize.body * 1.4,
    marginBottom: spacing.md,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: spacing.md,
  },
  progressDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.textDisabled,
    marginHorizontal: 3,
  },
  progressDotActive: {
    width: 18,
    backgroundColor: colors.primary,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
  },
  skipButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  skipText: {
    fontSize: typography.fontSize.body,
    color: colors.textSecondary,
    fontWeight: typography.fontWeight.medium,
  },
  nextButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
  },
  nextText: {
    fontSize: typography.fontSize.body,
    color: colors.textInverse,
    fontWeight: typography.fontWeight.semibold,
  },
});
