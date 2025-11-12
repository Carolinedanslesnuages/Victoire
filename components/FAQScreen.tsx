import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Modal,
} from 'react-native';
import { colors, typography, spacing, borderRadius, elevation } from '../constants/theme';
import i18n from '../utils/i18n';

interface FAQScreenProps {
  visible: boolean;
  onClose: () => void;
}

interface FAQItem {
  question: string;
  answer: string;
}

export default function FAQScreen({ visible, onClose }: FAQScreenProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const faqItems: FAQItem[] = [
    {
      question: i18n.t('faq.items.budgetCalculation.question'),
      answer: i18n.t('faq.items.budgetCalculation.answer'),
    },
    {
      question: i18n.t('faq.items.cycleStartDay.question'),
      answer: i18n.t('faq.items.cycleStartDay.answer'),
    },
    {
      question: i18n.t('faq.items.categories.question'),
      answer: i18n.t('faq.items.categories.answer'),
    },
    {
      question: i18n.t('faq.items.negativebudget.question'),
      answer: i18n.t('faq.items.negativebudget.answer'),
    },
    {
      question: i18n.t('faq.items.dataExport.question'),
      answer: i18n.t('faq.items.dataExport.answer'),
    },
    {
      question: i18n.t('faq.items.notifications.question'),
      answer: i18n.t('faq.items.notifications.answer'),
    },
  ];

  const toggleItem = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{i18n.t('faq.title')}</Text>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
            activeOpacity={0.7}
          >
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollView}>
          <View style={styles.content}>
            <Text style={styles.subtitle}>{i18n.t('faq.subtitle')}</Text>

            {faqItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.faqItem,
                  expandedIndex === index && styles.faqItemExpanded,
                ]}
                onPress={() => toggleItem(index)}
                activeOpacity={0.7}
              >
                <View style={styles.questionContainer}>
                  <Text style={styles.questionText}>{item.question}</Text>
                  <Text style={styles.expandIcon}>
                    {expandedIndex === index ? '−' : '+'}
                  </Text>
                </View>
                {expandedIndex === index && (
                  <View style={styles.answerContainer}>
                    <Text style={styles.answerText}>{item.answer}</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}

            <View style={styles.helpSection}>
              <Text style={styles.helpTitle}>{i18n.t('faq.needMoreHelp')}</Text>
              <Text style={styles.helpText}>{i18n.t('faq.contactMessage')}</Text>
            </View>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    paddingTop: 60,
    backgroundColor: colors.primary,
  },
  headerTitle: {
    fontSize: typography.fontSize.h2,
    fontWeight: typography.fontWeight.bold,
    color: colors.textInverse,
  },
  closeButton: {
    padding: spacing.sm,
  },
  closeButtonText: {
    fontSize: 28,
    color: colors.textInverse,
    fontWeight: typography.fontWeight.regular,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: spacing.lg,
  },
  subtitle: {
    fontSize: typography.fontSize.body,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
    lineHeight: 22,
  },
  faqItem: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...elevation.low,
  },
  faqItemExpanded: {
    ...elevation.medium,
  },
  questionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  questionText: {
    flex: 1,
    fontSize: typography.fontSize.body,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textPrimary,
    marginRight: spacing.md,
  },
  expandIcon: {
    fontSize: 24,
    color: colors.primary,
    fontWeight: typography.fontWeight.bold,
    width: 24,
    textAlign: 'center',
  },
  answerContainer: {
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  answerText: {
    fontSize: typography.fontSize.bodySmall,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  helpSection: {
    marginTop: spacing.xl,
    padding: spacing.lg,
    backgroundColor: colors.primaryLight,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  helpTitle: {
    fontSize: typography.fontSize.h4,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
    marginBottom: spacing.sm,
  },
  helpText: {
    fontSize: typography.fontSize.bodySmall,
    color: colors.textSecondary,
    lineHeight: 20,
  },
});
