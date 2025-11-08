import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  Modal,
  Linking,
  Switch,
} from 'react-native';
import { UserPreferences, NotificationSettings } from '../types';
import { colors, typography, spacing, borderRadius, elevation } from '../constants/theme';
import i18n from '../utils/i18n';
import { CURRENCY_OPTIONS } from '../utils/currency';
import { loadUserPreferences, saveUserPreferences, resetAllData, loadTransactions } from '../utils/storage';
import { useSubscription } from '../contexts/SubscriptionContext';
import PaywallScreen from './PaywallScreen';
import { 
  requestNotificationPermissions, 
  scheduleEveningReminder, 
  scheduleMorningBudgetNotification,
  getDefaultNotificationSettings
} from '../utils/notifications';
import { exportTransactionsToCSV } from '../utils/export';

interface SettingsScreenProps {
  visible: boolean;
  onClose: () => void;
  onResetComplete: () => void;
}

const FREE_CATEGORY_LIMIT = 3;

export default function SettingsScreen({ visible, onClose, onResetComplete }: SettingsScreenProps) {
  const [preferences, setPreferences] = useState<UserPreferences>({
    currency: 'EUR',
    customCategories: [],
    notificationSettings: getDefaultNotificationSettings(),
  });
  const [newCategory, setNewCategory] = useState('');
  const [showCurrencyPicker, setShowCurrencyPicker] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState<{
    type: 'evening' | 'morning';
    show: boolean;
  }>({ type: 'evening', show: false });
  const { isPremium, refreshSubscription } = useSubscription();

  useEffect(() => {
    if (visible) {
      loadPreferences();
    }
  }, [visible]);

  const loadPreferences = async () => {
    const prefs = await loadUserPreferences();
    setPreferences(prefs);
  };

  const handleCurrencyChange = async (currencyCode: string) => {
    const updatedPreferences = { ...preferences, currency: currencyCode };
    const success = await saveUserPreferences(updatedPreferences);
    if (success) {
      setPreferences(updatedPreferences);
      setShowCurrencyPicker(false);
      Alert.alert(i18n.t('settings.success'), i18n.t('settings.currencyUpdated'));
    }
  };

  const handleNotificationToggle = async (
    setting: 'eveningReminderEnabled' | 'morningBudgetEnabled' | 'budgetAlertEnabled',
    value: boolean
  ) => {
    if (value) {
      const hasPermission = await requestNotificationPermissions();
      if (!hasPermission) {
        Alert.alert(
          i18n.t('settings.notifications.permissionRequired'),
          i18n.t('settings.notifications.permissionMessage')
        );
        return;
      }
    }

    const updatedSettings: NotificationSettings = {
      ...preferences.notificationSettings!,
      [setting]: value,
    };

    const updatedPreferences = {
      ...preferences,
      notificationSettings: updatedSettings,
    };

    const success = await saveUserPreferences(updatedPreferences);
    if (success) {
      setPreferences(updatedPreferences);

      // Update scheduled notifications
      if (setting === 'eveningReminderEnabled') {
        await scheduleEveningReminder(updatedSettings);
      } else if (setting === 'morningBudgetEnabled') {
        await scheduleMorningBudgetNotification(updatedSettings);
      }
    }
  };

  const handleTimeChange = (type: 'evening' | 'morning', time: string) => {
    const setting = type === 'evening' ? 'eveningReminderTime' : 'morningBudgetTime';
    
    const updatedSettings: NotificationSettings = {
      ...preferences.notificationSettings!,
      [setting]: time,
    };

    const updatedPreferences = {
      ...preferences,
      notificationSettings: updatedSettings,
    };

    saveUserPreferences(updatedPreferences).then((success) => {
      if (success) {
        setPreferences(updatedPreferences);
        
        // Re-schedule notifications with new time
        if (type === 'evening') {
          scheduleEveningReminder(updatedSettings);
        } else {
          scheduleMorningBudgetNotification(updatedSettings);
        }

        Alert.alert(i18n.t('settings.success'), i18n.t('settings.notifications.updated'));
      }
    });

    setShowTimePicker({ type: 'evening', show: false });
  };

  const parseTimeInput = (input: string): string | null => {
    // Simple validation for HH:mm format
    const match = input.match(/^([0-1]?[0-9]|2[0-3]):([0-5][0-9])$/);
    if (!match) {
      return null;
    }
    const hours = match[1].padStart(2, '0');
    const minutes = match[2];
    return `${hours}:${minutes}`;
  };

  const handleAddCategory = async () => {
    if (!newCategory.trim()) {
      Alert.alert(i18n.t('settings.errors.title'), i18n.t('settings.errors.emptyCategoryName'));
      return;
    }

    if (preferences.customCategories.includes(newCategory.trim())) {
      Alert.alert(i18n.t('settings.errors.title'), i18n.t('settings.errors.duplicateCategory'));
      return;
    }

    // Check if user has reached the free tier limit
    if (!isPremium && preferences.customCategories.length >= FREE_CATEGORY_LIMIT) {
      Alert.alert(
        i18n.t('settings.categoryLimit.title'),
        i18n.t('settings.categoryLimit.message'),
        [
          {
            text: i18n.t('settings.categoryLimit.cancel'),
            style: 'cancel',
          },
          {
            text: i18n.t('settings.categoryLimit.upgrade'),
            onPress: () => setShowPaywall(true),
          },
        ]
      );
      return;
    }

    const updatedCategories = [...preferences.customCategories, newCategory.trim()];
    const updatedPreferences = { ...preferences, customCategories: updatedCategories };
    const success = await saveUserPreferences(updatedPreferences);
    
    if (success) {
      setPreferences(updatedPreferences);
      setNewCategory('');
      Alert.alert(i18n.t('settings.success'), i18n.t('settings.categoryAdded'));
    }
  };

  const handleDeleteCategory = async (category: string) => {
    Alert.alert(
      i18n.t('settings.deleteCategory.title'),
      i18n.t('settings.deleteCategory.message', { category }),
      [
        {
          text: i18n.t('settings.deleteCategory.cancel'),
          style: 'cancel',
        },
        {
          text: i18n.t('settings.deleteCategory.confirm'),
          style: 'destructive',
          onPress: async () => {
            const updatedCategories = preferences.customCategories.filter(c => c !== category);
            const updatedPreferences = { ...preferences, customCategories: updatedCategories };
            const success = await saveUserPreferences(updatedPreferences);
            if (success) {
              setPreferences(updatedPreferences);
            }
          },
        },
      ]
    );
  };

  const handleResetApp = () => {
    Alert.alert(
      i18n.t('settings.resetApp.title'),
      i18n.t('settings.resetApp.message'),
      [
        {
          text: i18n.t('settings.resetApp.cancel'),
          style: 'cancel',
        },
        {
          text: i18n.t('settings.resetApp.confirm'),
          style: 'destructive',
          onPress: () => {
            // Second confirmation
            Alert.alert(
              i18n.t('settings.resetApp.confirmTitle'),
              i18n.t('settings.resetApp.confirmMessage'),
              [
                {
                  text: i18n.t('settings.resetApp.cancel'),
                  style: 'cancel',
                },
                {
                  text: i18n.t('settings.resetApp.confirmFinal'),
                  style: 'destructive',
                  onPress: async () => {
                    const success = await resetAllData();
                    if (success) {
                      onClose();
                      onResetComplete();
                    }
                  },
                },
              ]
            );
          },
        },
      ]
    );
  };

  const handleOpenLegalDocument = async (documentType: 'privacy' | 'terms') => {
    const baseUrl = 'https://github.com/Carolinedanslesnuages/PACE/blob/main/';
    const url = documentType === 'privacy' 
      ? `${baseUrl}PRIVACY_POLICY.md`
      : `${baseUrl}TERMS_OF_SERVICE.md`;
    
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert(i18n.t('settings.errors.title'), `Cannot open URL: ${url}`);
    }
  };

  const handleExportData = async () => {
    try {
      // Load all transactions
      const transactions = await loadTransactions();
      
      // Check if there are transactions to export
      if (transactions.length === 0) {
        Alert.alert(
          i18n.t('settings.export.noData'),
          i18n.t('settings.export.noDataMessage')
        );
        return;
      }
      
      // Export to CSV
      const success = await exportTransactionsToCSV(transactions);
      
      if (success) {
        Alert.alert(
          i18n.t('settings.export.success'),
          i18n.t('settings.export.successMessage')
        );
      } else {
        Alert.alert(
          i18n.t('settings.export.error'),
          i18n.t('settings.export.errorMessage')
        );
      }
    } catch (error) {
      console.error('Error exporting data:', error);
      Alert.alert(
        i18n.t('settings.export.error'),
        i18n.t('settings.export.errorMessage')
      );
    }
  };

  const selectedCurrency = CURRENCY_OPTIONS.find(c => c.code === preferences.currency);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{i18n.t('settings.title')}</Text>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
            activeOpacity={0.7}
          >
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollView}>
          {/* Subscription Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{i18n.t('settings.subscription.title')}</Text>
            
            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>{i18n.t('settings.subscription.status')}</Text>
              <View style={styles.subscriptionStatus}>
                <Text style={[
                  styles.subscriptionStatusText,
                  isPremium && styles.subscriptionStatusPremium
                ]}>
                  {isPremium 
                    ? i18n.t('settings.subscription.premium') 
                    : i18n.t('settings.subscription.free')}
                </Text>
              </View>
            </View>

            {!isPremium && (
              <TouchableOpacity
                style={styles.upgradeButton}
                onPress={() => setShowPaywall(true)}
                activeOpacity={0.7}
              >
                <Text style={styles.upgradeButtonText}>
                  {i18n.t('settings.subscription.upgradeToPremium')}
                </Text>
              </TouchableOpacity>
            )}

            {!isPremium && preferences.customCategories.length > 0 && (
              <Text style={styles.limitText}>
                🔒 {preferences.customCategories.length}/{FREE_CATEGORY_LIMIT} {i18n.t('settings.customCategories')}
              </Text>
            )}
          </View>

          {/* Currency Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{i18n.t('settings.personalization')}</Text>
            
            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>{i18n.t('settings.currency')}</Text>
              <TouchableOpacity
                style={styles.currencyButton}
                onPress={() => setShowCurrencyPicker(true)}
                activeOpacity={0.7}
              >
                <Text style={styles.currencyButtonText}>
                  {selectedCurrency?.symbol} {selectedCurrency?.name}
                </Text>
                <Text style={styles.currencyButtonArrow}>›</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Notification Settings Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{i18n.t('settings.notifications.title')}</Text>
            
            {/* Evening Reminder */}
            <View style={styles.notificationItem}>
              <View style={styles.notificationHeader}>
                <Text style={styles.notificationLabel}>
                  📝 {i18n.t('settings.notifications.eveningReminder.label')}
                </Text>
                <Switch
                  value={preferences.notificationSettings?.eveningReminderEnabled ?? true}
                  onValueChange={(value) => handleNotificationToggle('eveningReminderEnabled', value)}
                  trackColor={{ false: colors.border, true: colors.primary }}
                  thumbColor={colors.surface}
                />
              </View>
              <Text style={styles.notificationDescription}>
                {i18n.t('settings.notifications.eveningReminder.description')}
              </Text>
              {preferences.notificationSettings?.eveningReminderEnabled && (
                <TouchableOpacity
                  style={styles.timeButton}
                  onPress={() => setShowTimePicker({ type: 'evening', show: true })}
                  activeOpacity={0.7}
                >
                  <Text style={styles.timeButtonLabel}>
                    {i18n.t('settings.notifications.eveningReminder.time')}
                  </Text>
                  <Text style={styles.timeButtonValue}>
                    {preferences.notificationSettings?.eveningReminderTime || '20:00'}
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Morning Budget */}
            <View style={styles.notificationItem}>
              <View style={styles.notificationHeader}>
                <Text style={styles.notificationLabel}>
                  💰 {i18n.t('settings.notifications.morningBudget.label')}
                </Text>
                <Switch
                  value={preferences.notificationSettings?.morningBudgetEnabled ?? true}
                  onValueChange={(value) => handleNotificationToggle('morningBudgetEnabled', value)}
                  trackColor={{ false: colors.border, true: colors.primary }}
                  thumbColor={colors.surface}
                />
              </View>
              <Text style={styles.notificationDescription}>
                {i18n.t('settings.notifications.morningBudget.description')}
              </Text>
              {preferences.notificationSettings?.morningBudgetEnabled && (
                <TouchableOpacity
                  style={styles.timeButton}
                  onPress={() => setShowTimePicker({ type: 'morning', show: true })}
                  activeOpacity={0.7}
                >
                  <Text style={styles.timeButtonLabel}>
                    {i18n.t('settings.notifications.morningBudget.time')}
                  </Text>
                  <Text style={styles.timeButtonValue}>
                    {preferences.notificationSettings?.morningBudgetTime || '08:00'}
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Budget Alert */}
            <View style={styles.notificationItem}>
              <View style={styles.notificationHeader}>
                <Text style={styles.notificationLabel}>
                  ⚠️ {i18n.t('settings.notifications.budgetAlert.label')}
                </Text>
                <Switch
                  value={preferences.notificationSettings?.budgetAlertEnabled ?? true}
                  onValueChange={(value) => handleNotificationToggle('budgetAlertEnabled', value)}
                  trackColor={{ false: colors.border, true: colors.primary }}
                  thumbColor={colors.surface}
                />
              </View>
              <Text style={styles.notificationDescription}>
                {i18n.t('settings.notifications.budgetAlert.description')}
              </Text>
            </View>
          </View>

          {/* Custom Categories Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{i18n.t('settings.customCategories')}</Text>
              {!isPremium && (
                <Text style={styles.premiumBadge}>🔒</Text>
              )}
            </View>
            
            <View style={styles.addCategoryContainer}>
              <TextInput
                style={styles.categoryInput}
                placeholder={i18n.t('settings.categoryPlaceholder')}
                placeholderTextColor={colors.textDisabled}
                value={newCategory}
                onChangeText={setNewCategory}
              />
              <TouchableOpacity
                style={styles.addCategoryButton}
                onPress={handleAddCategory}
                activeOpacity={0.7}
              >
                <Text style={styles.addCategoryButtonText}>+</Text>
              </TouchableOpacity>
            </View>

            {preferences.customCategories.length === 0 ? (
              <Text style={styles.noCategoriesText}>
                {i18n.t('settings.noCustomCategories')}
              </Text>
            ) : (
              <View style={styles.categoriesList}>
                {preferences.customCategories.map((category, index) => (
                  <View key={index} style={styles.categoryItem}>
                    <Text style={styles.categoryName}>{category}</Text>
                    <TouchableOpacity
                      style={styles.deleteCategoryButton}
                      onPress={() => handleDeleteCategory(category)}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.deleteCategoryButtonText}>✕</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* Data Export Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{i18n.t('settings.export.title')}</Text>
            <Text style={styles.exportDescription}>
              {i18n.t('settings.export.description')}
            </Text>
            
            <TouchableOpacity
              style={styles.exportButton}
              onPress={handleExportData}
              activeOpacity={0.7}
            >
              <Text style={styles.exportButtonText}>
                {i18n.t('settings.export.button')}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Legal Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{i18n.t('settings.legal.title')}</Text>
            
            <TouchableOpacity
              style={styles.legalButton}
              onPress={() => handleOpenLegalDocument('privacy')}
              activeOpacity={0.7}
            >
              <Text style={styles.legalButtonText}>
                📄 {i18n.t('settings.legal.privacyPolicy')}
              </Text>
              <Text style={styles.legalButtonArrow}>›</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.legalButton}
              onPress={() => handleOpenLegalDocument('terms')}
              activeOpacity={0.7}
            >
              <Text style={styles.legalButtonText}>
                📄 {i18n.t('settings.legal.termsOfService')}
              </Text>
              <Text style={styles.legalButtonArrow}>›</Text>
            </TouchableOpacity>
          </View>

          {/* Danger Zone Section */}
          <View style={[styles.section, styles.dangerZone]}>
            <Text style={[styles.sectionTitle, styles.dangerZoneTitle]}>
              {i18n.t('settings.dangerZone')}
            </Text>
            <Text style={styles.dangerZoneDescription}>
              {i18n.t('settings.dangerZoneDescription')}
            </Text>
            <TouchableOpacity
              style={styles.resetButton}
              onPress={handleResetApp}
              activeOpacity={0.7}
            >
              <Text style={styles.resetButtonText}>
                {i18n.t('settings.resetApp.button')}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Currency Picker Modal */}
        <Modal
          visible={showCurrencyPicker}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowCurrencyPicker(false)}
        >
          <TouchableOpacity
            style={styles.currencyPickerOverlay}
            activeOpacity={1}
            onPress={() => setShowCurrencyPicker(false)}
          >
            <View style={styles.currencyPickerContent}>
              <Text style={styles.currencyPickerTitle}>
                {i18n.t('settings.selectCurrency')}
              </Text>
              {CURRENCY_OPTIONS.map((currency) => (
                <TouchableOpacity
                  key={currency.code}
                  style={[
                    styles.currencyOption,
                    preferences.currency === currency.code && styles.currencyOptionSelected,
                  ]}
                  onPress={() => handleCurrencyChange(currency.code)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.currencyOptionText}>
                    {currency.symbol} {currency.name}
                  </Text>
                  {preferences.currency === currency.code && (
                    <Text style={styles.currencyOptionCheck}>✓</Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </TouchableOpacity>
        </Modal>

        {/* Time Picker Modal */}
        <Modal
          visible={showTimePicker.show}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowTimePicker({ type: 'evening', show: false })}
        >
          <TouchableOpacity
            style={styles.currencyPickerOverlay}
            activeOpacity={1}
            onPress={() => setShowTimePicker({ type: 'evening', show: false })}
          >
            <View style={styles.currencyPickerContent}>
              <Text style={styles.currencyPickerTitle}>
                {showTimePicker.type === 'evening'
                  ? i18n.t('settings.notifications.eveningReminder.time')
                  : i18n.t('settings.notifications.morningBudget.time')}
              </Text>
              <TextInput
                style={styles.timeInput}
                placeholder="HH:mm (e.g., 20:00)"
                placeholderTextColor={colors.textDisabled}
                defaultValue={
                  showTimePicker.type === 'evening'
                    ? preferences.notificationSettings?.eveningReminderTime || '20:00'
                    : preferences.notificationSettings?.morningBudgetTime || '08:00'
                }
                onSubmitEditing={(e) => {
                  const time = parseTimeInput(e.nativeEvent.text);
                  if (time) {
                    handleTimeChange(showTimePicker.type, time);
                  } else {
                    Alert.alert(
                      i18n.t('settings.errors.title'),
                      'Please enter a valid time in HH:mm format (e.g., 20:00)'
                    );
                  }
                }}
                keyboardType="numbers-and-punctuation"
                maxLength={5}
                autoFocus
              />
              <TouchableOpacity
                style={styles.timePickerCloseButton}
                onPress={() => setShowTimePicker({ type: 'evening', show: false })}
                activeOpacity={0.7}
              >
                <Text style={styles.timePickerCloseButtonText}>
                  {i18n.t('addExpense.cancelButton')}
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>

        {/* Paywall Screen */}
        <PaywallScreen
          visible={showPaywall}
          onClose={() => setShowPaywall(false)}
          onPurchaseComplete={async () => {
            await refreshSubscription();
            setShowPaywall(false);
          }}
        />
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
  section: {
    backgroundColor: colors.surface,
    margin: spacing.md,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    ...elevation.low,
  },
  sectionTitle: {
    fontSize: typography.fontSize.h4,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  settingItem: {
    marginBottom: spacing.md,
  },
  settingLabel: {
    fontSize: typography.fontSize.body,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  currencyButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding: spacing.md,
  },
  currencyButtonText: {
    fontSize: typography.fontSize.body,
    color: colors.textPrimary,
    fontWeight: typography.fontWeight.medium,
  },
  currencyButtonArrow: {
    fontSize: 24,
    color: colors.textSecondary,
  },
  addCategoryContainer: {
    flexDirection: 'row',
    marginBottom: spacing.md,
  },
  categoryInput: {
    flex: 1,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    fontSize: typography.fontSize.body,
    color: colors.textPrimary,
    marginRight: spacing.sm,
  },
  addCategoryButton: {
    width: 48,
    height: 48,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addCategoryButtonText: {
    fontSize: 28,
    color: colors.textInverse,
    fontWeight: typography.fontWeight.regular,
  },
  noCategoriesText: {
    fontSize: typography.fontSize.bodySmall,
    color: colors.textSecondary,
    textAlign: 'center',
    paddingVertical: spacing.md,
    fontStyle: 'italic',
  },
  categoriesList: {
    marginTop: spacing.sm,
  },
  categoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  categoryName: {
    fontSize: typography.fontSize.body,
    color: colors.textPrimary,
    fontWeight: typography.fontWeight.medium,
  },
  deleteCategoryButton: {
    padding: spacing.xs,
  },
  deleteCategoryButtonText: {
    fontSize: 20,
    color: colors.error,
    fontWeight: typography.fontWeight.bold,
  },
  dangerZone: {
    borderWidth: 2,
    borderColor: colors.error,
  },
  dangerZoneTitle: {
    color: colors.error,
  },
  dangerZoneDescription: {
    fontSize: typography.fontSize.bodySmall,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  resetButton: {
    backgroundColor: colors.error,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: 'center',
  },
  resetButtonText: {
    color: colors.textInverse,
    fontSize: typography.fontSize.body,
    fontWeight: typography.fontWeight.bold,
  },
  currencyPickerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  currencyPickerContent: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    width: '100%',
    maxWidth: 400,
  },
  currencyPickerTitle: {
    fontSize: typography.fontSize.h4,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  currencyOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.xs,
  },
  currencyOptionSelected: {
    backgroundColor: colors.background,
  },
  currencyOptionText: {
    fontSize: typography.fontSize.body,
    color: colors.textPrimary,
  },
  currencyOptionCheck: {
    fontSize: 20,
    color: colors.primary,
    fontWeight: typography.fontWeight.bold,
  },
  // Subscription section styles
  subscriptionStatus: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding: spacing.md,
  },
  subscriptionStatusText: {
    fontSize: typography.fontSize.body,
    color: colors.textPrimary,
    fontWeight: typography.fontWeight.medium,
  },
  subscriptionStatusPremium: {
    color: colors.warning,
    fontWeight: typography.fontWeight.bold,
  },
  upgradeButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: 'center',
    marginTop: spacing.md,
  },
  upgradeButtonText: {
    color: colors.textInverse,
    fontSize: typography.fontSize.body,
    fontWeight: typography.fontWeight.bold,
  },
  limitText: {
    fontSize: typography.fontSize.bodySmall,
    color: colors.textSecondary,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  premiumBadge: {
    fontSize: 20,
  },
  // Legal section styles
  legalButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  legalButtonText: {
    fontSize: typography.fontSize.body,
    color: colors.textPrimary,
    fontWeight: typography.fontWeight.medium,
  },
  legalButtonArrow: {
    fontSize: 24,
    color: colors.textSecondary,
  },
  // Notification settings styles
  notificationItem: {
    marginBottom: spacing.lg,
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  notificationLabel: {
    fontSize: typography.fontSize.body,
    color: colors.textPrimary,
    fontWeight: typography.fontWeight.medium,
    flex: 1,
  },
  notificationDescription: {
    fontSize: typography.fontSize.bodySmall,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  timeButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginTop: spacing.sm,
  },
  timeButtonLabel: {
    fontSize: typography.fontSize.bodySmall,
    color: colors.textSecondary,
  },
  timeButtonValue: {
    fontSize: typography.fontSize.body,
    color: colors.textPrimary,
    fontWeight: typography.fontWeight.bold,
  },
  timeInput: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    fontSize: typography.fontSize.body,
    color: colors.textPrimary,
    marginVertical: spacing.md,
    textAlign: 'center',
  },
  timePickerCloseButton: {
    backgroundColor: colors.border,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  timePickerCloseButtonText: {
    color: colors.textPrimary,
    fontSize: typography.fontSize.body,
    fontWeight: typography.fontWeight.medium,
  },
  // Export section styles
  exportDescription: {
    fontSize: typography.fontSize.bodySmall,
    color: colors.textSecondary,
    marginBottom: spacing.md,
    lineHeight: 20,
  },
  exportButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  exportButtonText: {
    color: colors.textInverse,
    fontSize: typography.fontSize.body,
    fontWeight: typography.fontWeight.bold,
  },
});
