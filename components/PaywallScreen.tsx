/**
 * Paywall Screen Component
 * Displays subscription options with pricing and terms
 */
import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Modal,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { colors, typography, spacing, borderRadius, elevation } from '../constants/theme';
import i18n from '../utils/i18n';
import { SubscriptionPlan } from '../types';
import { purchaseSubscription, restorePurchases } from '../utils/subscription';

interface PaywallScreenProps {
  visible: boolean;
  onClose: () => void;
  onPurchaseComplete?: () => void;
}

export default function PaywallScreen({ visible, onClose, onPurchaseComplete }: PaywallScreenProps) {
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan>('annual');
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePurchase = async () => {
    setIsProcessing(true);
    try {
      const success = await purchaseSubscription(selectedPlan);
      if (success) {
        Alert.alert(
          i18n.t('paywall.success.title'),
          i18n.t('paywall.success.message')
        );
        onPurchaseComplete?.();
        onClose();
      } else {
        Alert.alert(
          i18n.t('paywall.error.title'),
          i18n.t('paywall.error.message')
        );
      }
    } catch (error) {
      Alert.alert(
        i18n.t('paywall.error.title'),
        i18n.t('paywall.error.message')
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRestore = async () => {
    setIsProcessing(true);
    try {
      const success = await restorePurchases();
      if (success) {
        Alert.alert(
          i18n.t('paywall.restore.success'),
          i18n.t('paywall.restore.successMessage')
        );
        onPurchaseComplete?.();
        onClose();
      } else {
        Alert.alert(
          i18n.t('paywall.restore.notFound'),
          i18n.t('paywall.restore.notFoundMessage')
        );
      }
    } catch (error) {
      Alert.alert(
        i18n.t('paywall.error.title'),
        i18n.t('paywall.error.message')
      );
    } finally {
      setIsProcessing(false);
    }
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
          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
            activeOpacity={0.7}
          >
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          {/* Title Section */}
          <View style={styles.titleSection}>
            <Text style={styles.title}>{i18n.t('paywall.title')}</Text>
            <Text style={styles.subtitle}>{i18n.t('paywall.subtitle')}</Text>
          </View>

          {/* Features List */}
          <View style={styles.featuresSection}>
            <Text style={styles.featuresTitle}>{i18n.t('paywall.features.title')}</Text>
            {[
              'paywall.features.unlimitedCategories',
              'paywall.features.advancedAnalytics',
              'paywall.features.cloudBackup',
              'paywall.features.exportData',
              'paywall.features.prioritySupport',
            ].map((key, index) => (
              <View key={index} style={styles.featureItem}>
                <Text style={styles.featureIcon}>✓</Text>
                <Text style={styles.featureText}>{i18n.t(key)}</Text>
              </View>
            ))}
          </View>

          {/* Subscription Plans */}
          <View style={styles.plansSection}>
            {/* Annual Plan - Highlighted as Best Offer */}
            <TouchableOpacity
              style={[
                styles.planCard,
                selectedPlan === 'annual' && styles.planCardSelected,
                styles.planCardAnnual,
              ]}
              onPress={() => setSelectedPlan('annual')}
              activeOpacity={0.7}
            >
              <View style={styles.bestOfferBadge}>
                <Text style={styles.bestOfferText}>{i18n.t('paywall.plans.bestOffer')}</Text>
              </View>
              <View style={styles.planHeader}>
                <Text style={styles.planName}>{i18n.t('paywall.plans.annual.name')}</Text>
                <View style={styles.radioButton}>
                  {selectedPlan === 'annual' && <View style={styles.radioButtonSelected} />}
                </View>
              </View>
              <Text style={styles.planPrice}>{i18n.t('paywall.plans.annual.price')}</Text>
              <Text style={styles.planEquivalent}>{i18n.t('paywall.plans.annual.equivalent')}</Text>
              <Text style={styles.planSavings}>{i18n.t('paywall.plans.annual.savings')}</Text>
            </TouchableOpacity>

            {/* Monthly Plan */}
            <TouchableOpacity
              style={[
                styles.planCard,
                selectedPlan === 'monthly' && styles.planCardSelected,
              ]}
              onPress={() => setSelectedPlan('monthly')}
              activeOpacity={0.7}
            >
              <View style={styles.planHeader}>
                <Text style={styles.planName}>{i18n.t('paywall.plans.monthly.name')}</Text>
                <View style={styles.radioButton}>
                  {selectedPlan === 'monthly' && <View style={styles.radioButtonSelected} />}
                </View>
              </View>
              <Text style={styles.planPrice}>{i18n.t('paywall.plans.monthly.price')}</Text>
            </TouchableOpacity>
          </View>

          {/* Purchase Button */}
          <TouchableOpacity
            style={styles.purchaseButton}
            onPress={handlePurchase}
            disabled={isProcessing}
            activeOpacity={0.7}
          >
            {isProcessing ? (
              <ActivityIndicator color={colors.textInverse} />
            ) : (
              <Text style={styles.purchaseButtonText}>
                {i18n.t('paywall.subscribeButton')}
              </Text>
            )}
          </TouchableOpacity>

          {/* Restore Purchases Button */}
          <TouchableOpacity
            style={styles.restoreButton}
            onPress={handleRestore}
            disabled={isProcessing}
            activeOpacity={0.7}
          >
            <Text style={styles.restoreButtonText}>
              {i18n.t('paywall.restoreButton')}
            </Text>
          </TouchableOpacity>

          {/* Terms and Conditions */}
          <View style={styles.termsSection}>
            <Text style={styles.termsText}>
              {i18n.t('paywall.terms.autoRenew')}
            </Text>
            <Text style={styles.termsText}>
              {i18n.t('paywall.terms.cancellation')}
            </Text>
            <Text style={styles.termsText}>
              {i18n.t('paywall.terms.privacy')}
            </Text>
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
    paddingTop: 50,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm,
    alignItems: 'flex-end',
  },
  closeButton: {
    padding: spacing.sm,
  },
  closeButtonText: {
    fontSize: 28,
    color: colors.textPrimary,
    fontWeight: typography.fontWeight.regular,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  titleSection: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: typography.fontSize.h1,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: typography.fontSize.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  featuresSection: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    ...elevation.low,
  },
  featuresTitle: {
    fontSize: typography.fontSize.h4,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  featureIcon: {
    fontSize: 20,
    color: colors.success,
    fontWeight: typography.fontWeight.bold,
    marginRight: spacing.sm,
    width: 24,
  },
  featureText: {
    fontSize: typography.fontSize.body,
    color: colors.textPrimary,
    flex: 1,
  },
  plansSection: {
    marginBottom: spacing.lg,
  },
  planCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 2,
    borderColor: colors.border,
    ...elevation.low,
  },
  planCardSelected: {
    borderColor: colors.primary,
  },
  planCardAnnual: {
    position: 'relative',
  },
  bestOfferBadge: {
    position: 'absolute',
    top: -12,
    right: spacing.lg,
    backgroundColor: colors.warning,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  bestOfferText: {
    fontSize: typography.fontSize.caption,
    fontWeight: typography.fontWeight.bold,
    color: colors.textInverse,
    textTransform: 'uppercase',
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  planName: {
    fontSize: typography.fontSize.h4,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioButtonSelected: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary,
  },
  planPrice: {
    fontSize: typography.fontSize.h2,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  planEquivalent: {
    fontSize: typography.fontSize.body,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  planSavings: {
    fontSize: typography.fontSize.bodySmall,
    color: colors.success,
    fontWeight: typography.fontWeight.semibold,
  },
  purchaseButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    marginBottom: spacing.md,
    ...elevation.medium,
  },
  purchaseButtonText: {
    color: colors.textInverse,
    fontSize: typography.fontSize.h4,
    fontWeight: typography.fontWeight.bold,
  },
  restoreButton: {
    padding: spacing.md,
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  restoreButtonText: {
    color: colors.primary,
    fontSize: typography.fontSize.body,
    fontWeight: typography.fontWeight.semibold,
  },
  termsSection: {
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  termsText: {
    fontSize: typography.fontSize.caption,
    color: colors.textSecondary,
    lineHeight: 18,
    marginBottom: spacing.xs,
  },
});
