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
      Alert.alert('Erreur', 'Veuillez saisir un revenu mensuel valide');
      return;
    }

    if (isNaN(charges) || charges < 0) {
      Alert.alert('Erreur', 'Veuillez saisir un montant de charges valide');
      return;
    }

    if (isNaN(savings) || savings < 0) {
      Alert.alert('Erreur', 'Veuillez saisir un objectif d\'épargne valide');
      return;
    }

    if (isNaN(startDay) || startDay < 1 || startDay > 31) {
      Alert.alert('Erreur', 'Veuillez saisir un jour entre 1 et 31');
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
        <Text style={styles.title}>Configuration Budgétaire</Text>
        <Text style={styles.subtitle}>
          Définissez votre cadre budgétaire pour commencer
        </Text>

        <View style={styles.formSection}>
          <Text style={styles.label}>Revenus mensuels nets (€)</Text>
          <TextInput
            style={[
              styles.input,
              focusedField === 'income' && styles.inputFocused,
            ]}
            placeholder="Ex: 2500"
            placeholderTextColor={colors.textDisabled}
            keyboardType="decimal-pad"
            value={monthlyIncome}
            onChangeText={setMonthlyIncome}
            onFocus={() => setFocusedField('income')}
            onBlur={() => setFocusedField(null)}
          />
        </View>

        <View style={styles.formSection}>
          <Text style={styles.label}>Charges fixes totales (€)</Text>
          <TextInput
            style={[
              styles.input,
              focusedField === 'charges' && styles.inputFocused,
            ]}
            placeholder="Ex: 1200"
            placeholderTextColor={colors.textDisabled}
            keyboardType="decimal-pad"
            value={fixedCharges}
            onChangeText={setFixedCharges}
            onFocus={() => setFocusedField('charges')}
            onBlur={() => setFocusedField(null)}
          />
        </View>

        <View style={styles.formSection}>
          <Text style={styles.label}>Objectif d'épargne (€)</Text>
          <TextInput
            style={[
              styles.input,
              focusedField === 'savings' && styles.inputFocused,
            ]}
            placeholder="Ex: 300"
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
            Jour de début du cycle budgétaire (1-31)
          </Text>
          <Text style={styles.hint}>
            Le jour du mois où vous recevez votre salaire
          </Text>
          <TextInput
            style={[
              styles.input,
              focusedField === 'cycle' && styles.inputFocused,
            ]}
            placeholder="Ex: 5"
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
          <Text style={styles.buttonText}>Enregistrer</Text>
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
