import React, { useState } from 'react';
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
import { BudgetConfig } from '../types';
import { colors, typography, spacing, borderRadius } from '../constants/theme';
import i18n from '../utils/i18n';

interface ConfigWizardProps {
  onComplete: (config: BudgetConfig) => void;
}

export default function ConfigWizard({ onComplete }: ConfigWizardProps) {
  const [monthlyIncome, setMonthlyIncome] = useState('');
  const [fixedCharges, setFixedCharges] = useState('');
  const [savingsGoal, setSavingsGoal] = useState('');
  const [cycleStartDay, setCycleStartDay] = useState('');
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleSubmit = () => {
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

    const config = {
      monthlyIncome: income,
      fixedCharges: charges,
      savingsGoal: savings,
      cycleStartDay: startDay,
    };

    onComplete(config);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
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
          onPress={handleSubmit}
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
