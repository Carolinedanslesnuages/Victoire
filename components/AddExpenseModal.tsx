import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Modal,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { Transaction } from '../types';
import { colors, typography, spacing, borderRadius } from '../constants/theme';
import i18n from '../utils/i18n';

interface AddExpenseModalProps {
  visible: boolean;
  onClose: () => void;
  onAddExpense: (expense: Omit<Transaction, 'id'>) => void;
  customCategories?: string[];
}

export default function AddExpenseModal({ visible, onClose, onAddExpense, customCategories = [] }: AddExpenseModalProps) {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleSubmit = () => {
    const expenseAmount = parseFloat(amount);

    if (isNaN(expenseAmount) || expenseAmount <= 0) {
      Alert.alert(i18n.t('addExpense.errors.title'), i18n.t('addExpense.errors.invalidAmount'));
      return;
    }

    if (!description.trim()) {
      Alert.alert(i18n.t('addExpense.errors.title'), i18n.t('addExpense.errors.missingDescription'));
      return;
    }

    onAddExpense({
      amount: expenseAmount,
      description: description.trim(),
      category: category.trim() || undefined,
      date: new Date().toISOString(),
    });

    // Reset form
    setAmount('');
    setDescription('');
    setCategory('');
    onClose();
  };

  const handleCancel = () => {
    setAmount('');
    setDescription('');
    setCategory('');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={handleCancel}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalContainer}
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{i18n.t('addExpense.title')}</Text>

          <View style={styles.formSection}>
            <Text style={styles.label}>{i18n.t('addExpense.amount')}</Text>
            <TextInput
              style={[
                styles.input,
                focusedField === 'amount' && styles.inputFocused,
              ]}
              placeholder={i18n.t('addExpense.amountPlaceholder')}
              placeholderTextColor={colors.textDisabled}
              keyboardType="decimal-pad"
              value={amount}
              onChangeText={setAmount}
              autoFocus
              onFocus={() => setFocusedField('amount')}
              onBlur={() => setFocusedField(null)}
            />
          </View>

          <View style={styles.formSection}>
            <Text style={styles.label}>{i18n.t('addExpense.description')}</Text>
            <TextInput
              style={[
                styles.input,
                focusedField === 'description' && styles.inputFocused,
              ]}
              placeholder={i18n.t('addExpense.descriptionPlaceholder')}
              placeholderTextColor={colors.textDisabled}
              value={description}
              onChangeText={setDescription}
              onFocus={() => setFocusedField('description')}
              onBlur={() => setFocusedField(null)}
            />
          </View>

          <View style={styles.formSection}>
            <Text style={styles.label}>{i18n.t('addExpense.category')}</Text>
            <TextInput
              style={[
                styles.input,
                focusedField === 'category' && styles.inputFocused,
              ]}
              placeholder={i18n.t('addExpense.categoryPlaceholder')}
              placeholderTextColor={colors.textDisabled}
              value={category}
              onChangeText={setCategory}
              onFocus={() => setFocusedField('category')}
              onBlur={() => setFocusedField(null)}
            />
            {customCategories.length > 0 && (
              <View style={styles.suggestedCategories}>
                {customCategories.map((cat, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.categoryChip}
                    onPress={() => setCategory(cat)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.categoryChipText}>{cat}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={handleCancel}
              activeOpacity={0.7}
            >
              <Text style={styles.cancelButtonText}>{i18n.t('addExpense.cancelButton')}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.submitButton]}
              onPress={handleSubmit}
              activeOpacity={0.7}
            >
              <Text style={styles.submitButtonText}>{i18n.t('addExpense.addButton')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    padding: spacing.lg,
    paddingBottom: 40,
  },
  modalTitle: {
    fontSize: typography.fontSize.h3,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: spacing.lg,
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
  input: {
    backgroundColor: colors.background,
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.md,
  },
  button: {
    flex: 1,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    marginHorizontal: 6,
  },
  cancelButton: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cancelButtonText: {
    color: colors.textSecondary,
    fontSize: typography.fontSize.body,
    fontWeight: typography.fontWeight.semibold,
  },
  submitButton: {
    backgroundColor: colors.primary,
  },
  submitButtonText: {
    color: colors.textInverse,
    fontSize: typography.fontSize.body,
    fontWeight: typography.fontWeight.semibold,
  },
  suggestedCategories: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: spacing.sm,
  },
  categoryChip: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.full,
    marginRight: spacing.xs,
    marginBottom: spacing.xs,
  },
  categoryChipText: {
    color: colors.textInverse,
    fontSize: typography.fontSize.bodySmall,
    fontWeight: typography.fontWeight.medium,
  },
});
