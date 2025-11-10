import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { BudgetConfig, BudgetProfile } from '../types';
import { colors, typography, spacing, borderRadius } from '../constants/theme';
import i18n from '../utils/i18n';
import AvatarSelector from './AvatarSelector';
import { AvatarId, DEFAULT_AVATAR } from '../constants/avatars';
import { saveUserPreferences, loadUserPreferences } from '../utils/storage';

interface ConfigWizardProps {
  onComplete: (config: BudgetConfig) => void;
  onCancel?: () => void;
  mode?: 'create' | 'edit';
  existingProfile?: BudgetProfile;
}

export default function ConfigWizard({ onComplete, onCancel, mode = 'create', existingProfile }: ConfigWizardProps) {
  const [monthlyIncome, setMonthlyIncome] = useState('');
  const [fixedCharges, setFixedCharges] = useState('');
  const [savingsGoal, setSavingsGoal] = useState('');
  const [cycleStartDay, setCycleStartDay] = useState('');
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [step, setStep] = useState<'budget' | 'avatar'>('budget');
  const [selectedAvatar, setSelectedAvatar] = useState<AvatarId>(DEFAULT_AVATAR);

  // Pre-populate form fields when in edit mode
  useEffect(() => {
    if (mode === 'edit' && existingProfile) {
      setMonthlyIncome(existingProfile.monthlyIncome.toString());
      setFixedCharges(existingProfile.fixedCharges.toString());
      setSavingsGoal(existingProfile.savingsGoal.toString());
      setCycleStartDay(existingProfile.cycleStartDay.toString());
    }
  }, [mode, existingProfile]);

  const handleBudgetSubmit = () => {
    // Validation
    const income = parseFloat(monthlyIncome);
    const charges = parseFloat(fixedCharges);
    const savings = parseFloat(savingsGoal);
    const startDay = parseInt(cycleStartDay);

    if (isNaN(income) || income <= 0) {
      Alert.alert(i18n.t('configWizard.errors.title'), i18n.t('configWizard.errors.invalidIncome'));
      return;
    }

    if (isNaN(charges) || charges < 0) {
      Alert.alert(i18n.t('configWizard.errors.title'), i18n.t('configWizard.errors.invalidCharges'));
      return;
    }

    if (isNaN(savings) || savings < 0) {
      Alert.alert(i18n.t('configWizard.errors.title'), i18n.t('configWizard.errors.invalidSavings'));
      return;
    }

    if (isNaN(startDay) || startDay < 1 || startDay > 31) {
      Alert.alert(i18n.t('configWizard.errors.title'), i18n.t('configWizard.errors.invalidCycleDay'));
      return;
    }

    // In edit mode, skip avatar selection and complete directly
    if (mode === 'edit') {
      handleComplete();
    } else {
      // Move to avatar selection for new profiles
      setStep('avatar');
    }
  };

  const handleComplete = async () => {
    // Save avatar to preferences only if in create mode
    if (mode === 'create') {
      const prefs = await loadUserPreferences();
      await saveUserPreferences({
        ...prefs,
        avatarId: selectedAvatar,
      });
    }

    // Complete configuration with budget data
    const config: BudgetConfig = {
      monthlyIncome: parseFloat(monthlyIncome),
      fixedCharges: parseFloat(fixedCharges),
      savingsGoal: parseFloat(savingsGoal),
      cycleStartDay: parseInt(cycleStartDay),
    };

    // Include profile ID if editing
    if (mode === 'edit' && existingProfile) {
      (config as any).profileId = existingProfile.id;
    }

    onComplete(config);
  };

  const handleAvatarComplete = async () => {
    await handleComplete();
  };

  if (step === 'avatar') {
    return (
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <AvatarSelector
            selectedAvatar={selectedAvatar}
            onSelectAvatar={setSelectedAvatar}
            title={i18n.t('avatarSelection.onboardingTitle')}
            subtitle={i18n.t('avatarSelection.onboardingSubtitle')}
          />
          <TouchableOpacity
            style={styles.button}
            onPress={handleAvatarComplete}
            activeOpacity={0.7}
          >
            <Text style={styles.buttonText}>{i18n.t('avatarSelection.continue')}</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Back/Cancel button for edit mode */}
        {mode === 'edit' && onCancel && (
          <TouchableOpacity
            style={styles.backButton}
            onPress={onCancel}
            activeOpacity={0.7}
          >
            <Text style={styles.backButtonText}>← {i18n.t('configWizard.cancel')}</Text>
          </TouchableOpacity>
        )}

        <Text style={styles.title}>{i18n.t('configWizard.title')}</Text>
        <Text style={styles.subtitle}>
          {i18n.t('configWizard.subtitle')}
        </Text>

        <View style={styles.formSection}>
          <Text style={styles.label}>{i18n.t('configWizard.monthlyIncome')}</Text>
          <TextInput
            style={[
              styles.input,
              focusedField === 'income' && styles.inputFocused,
            ]}
            placeholder={i18n.t('configWizard.monthlyIncomePlaceholder')}
            placeholderTextColor={colors.textDisabled}
            keyboardType="decimal-pad"
            value={monthlyIncome}
            onChangeText={setMonthlyIncome}
            onFocus={() => setFocusedField('income')}
            onBlur={() => setFocusedField(null)}
          />
        </View>

        <View style={styles.formSection}>
          <Text style={styles.label}>{i18n.t('configWizard.fixedCharges')}</Text>
          <TextInput
            style={[
              styles.input,
              focusedField === 'charges' && styles.inputFocused,
            ]}
            placeholder={i18n.t('configWizard.fixedChargesPlaceholder')}
            placeholderTextColor={colors.textDisabled}
            keyboardType="decimal-pad"
            value={fixedCharges}
            onChangeText={setFixedCharges}
            onFocus={() => setFocusedField('charges')}
            onBlur={() => setFocusedField(null)}
          />
        </View>

        <View style={styles.formSection}>
          <Text style={styles.label}>{i18n.t('configWizard.savingsGoal')}</Text>
          <TextInput
            style={[
              styles.input,
              focusedField === 'savings' && styles.inputFocused,
            ]}
            placeholder={i18n.t('configWizard.savingsGoalPlaceholder')}
            placeholderTextColor={colors.textDisabled}
            keyboardType="decimal-pad"
            value={savingsGoal}
            onChangeText={setSavingsGoal}
            onFocus={() => setFocusedField('savings')}
            onBlur={() => setFocusedField(null)}
          />
        </View>

        <View style={styles.formSection}>
          <Text style={styles.label}>
            {i18n.t('configWizard.cycleStartDay')}
          </Text>
          <Text style={styles.hint}>
            {i18n.t('configWizard.cycleStartDayHint')}
          </Text>
          <TextInput
            style={[
              styles.input,
              focusedField === 'cycle' && styles.inputFocused,
            ]}
            placeholder={i18n.t('configWizard.cycleStartDayPlaceholder')}
            placeholderTextColor={colors.textDisabled}
            keyboardType="number-pad"
            value={cycleStartDay}
            onChangeText={setCycleStartDay}
            maxLength={2}
            onFocus={() => setFocusedField('cycle')}
            onBlur={() => setFocusedField(null)}
          />
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={handleBudgetSubmit}
          activeOpacity={0.7}
        >
          <Text style={styles.buttonText}>{i18n.t('configWizard.saveButton')}</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingTop: 60,
  },
  backButton: {
    alignSelf: 'flex-start',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  backButtonText: {
    fontSize: typography.fontSize.body,
    color: colors.primary,
    fontWeight: typography.fontWeight.semibold,
  },
  title: {
    fontSize: typography.fontSize.h2,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: typography.fontSize.body,
    color: colors.textSecondary,
    marginBottom: spacing.xl,
    textAlign: 'center',
  },
  formSection: {
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: typography.fontSize.body,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  hint: {
    fontSize: typography.fontSize.bodySmall,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
    fontStyle: 'italic',
  },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    fontSize: typography.fontSize.body,
    color: colors.textPrimary,
  },
  inputFocused: {
    borderColor: colors.primary,
    borderWidth: 2,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: 'center',
    marginTop: spacing.md,
    marginBottom: spacing.xl,
  },
  buttonText: {
    color: colors.textInverse,
    fontSize: typography.fontSize.body,
    fontWeight: typography.fontWeight.semibold,
  },
});
