import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  ScrollView,
  Alert,
} from 'react-native';
import { BudgetProfile } from '../types';
import {
  loadBudgetProfiles,
  getActiveBudgetId,
  setActiveBudgetId,
  createBudgetProfile,
  updateBudgetProfile,
} from '../utils/storage';
import { lightColors, typography, spacing, borderRadius, elevation } from '../constants/theme';
import { useTheme } from '../contexts/ThemeContext';
import i18n from '../utils/i18n';

interface BudgetSwitcherProps {
  onBudgetChange: () => void;
}

export default function BudgetSwitcher({ onBudgetChange }: BudgetSwitcherProps) {
  const { colors: themeColors } = useTheme();
  const [profiles, setProfiles] = useState<BudgetProfile[]>([]);
  const [activeProfile, setActiveProfile] = useState<BudgetProfile | null>(null);
  const [showPicker, setShowPicker] = useState(false);

  useEffect(() => {
    loadProfiles();
  }, []);

  const loadProfiles = async () => {
    const allProfiles = await loadBudgetProfiles();
    setProfiles(allProfiles);
    
    const activeId = await getActiveBudgetId();
    if (activeId) {
      const active = allProfiles.find(p => p.id === activeId);
      setActiveProfile(active || null);
    }
  };

  const handleSelectBudget = async (profile: BudgetProfile) => {
    await setActiveBudgetId(profile.id);
    setActiveProfile(profile);
    setShowPicker(false);
    onBudgetChange();
  };

  const handleRenameBudget = (profile: BudgetProfile) => {
    Alert.prompt(
      i18n.t('budgetSwitcher.renameBudget'),
      i18n.t('budgetSwitcher.renameBudgetMessage'),
      [
        {
          text: i18n.t('common.cancel'),
          style: 'cancel',
        },
        {
          text: i18n.t('common.save'),
          onPress: async (newName?: string) => {
            if (newName && newName.trim()) {
              const success = await updateBudgetProfile(profile.id, {
                name: newName.trim(),
              });
              
              if (success) {
                await loadProfiles();
                Alert.alert(
                  i18n.t('budgetSwitcher.renamed'),
                  i18n.t('budgetSwitcher.budgetRenamed')
                );
              }
            }
          },
        },
      ],
      'plain-text',
      profile.name
    );
  };

  const handleCreateHouseholdBudget = async () => {
    // Check if household budget already exists
    const householdExists = profiles.some(p => p.type === 'household');
    if (householdExists) {
      Alert.alert(
        i18n.t('budgetSwitcher.householdExists'),
        i18n.t('budgetSwitcher.householdExistsMessage')
      );
      return;
    }

    Alert.alert(
      i18n.t('budgetSwitcher.createHousehold'),
      i18n.t('budgetSwitcher.createHouseholdMessage'),
      [
        {
          text: i18n.t('common.cancel'),
          style: 'cancel',
        },
        {
          text: i18n.t('common.create'),
          onPress: async () => {
            const newProfile = await createBudgetProfile({
              type: 'household',
              name: i18n.t('budgetSwitcher.household'),
              monthlyIncome: 0,
              fixedCharges: 0,
              savingsGoal: 0,
              cycleStartDay: activeProfile?.cycleStartDay || 1,
            });

            if (newProfile) {
              await loadProfiles();
              Alert.alert(
                i18n.t('budgetSwitcher.created'),
                i18n.t('budgetSwitcher.householdCreated')
              );
            }
          },
        },
      ]
    );
  };

  if (profiles.length <= 1) {
    return null; // Don't show switcher if only one budget exists
  }

  const getBudgetIcon = (type: 'personal' | 'household') => {
    return type === 'personal' ? '👤' : '👨‍👩‍👧‍👦';
  };

  return (
    <>
      <TouchableOpacity
        style={[styles.container, { backgroundColor: themeColors.surface }]}
        onPress={() => setShowPicker(true)}
        activeOpacity={0.7}
      >
        <Text style={styles.icon}>{activeProfile ? getBudgetIcon(activeProfile.type) : '📊'}</Text>
        <Text style={[styles.text, { color: themeColors.textPrimary }]} numberOfLines={1}>
          {activeProfile?.name || i18n.t('budgetSwitcher.selectBudget')}
        </Text>
        <Text style={[styles.arrow, { color: themeColors.textSecondary }]}>▼</Text>
      </TouchableOpacity>

      <Modal
        visible={showPicker}
        transparent
        animationType="fade"
        onRequestClose={() => setShowPicker(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowPicker(false)}
        >
          <View style={[styles.modalContent, { backgroundColor: themeColors.surface }]}>
            <Text style={[styles.modalTitle, { color: themeColors.textPrimary }]}>
              {i18n.t('budgetSwitcher.selectBudget')}
            </Text>

            <ScrollView style={styles.profilesList}>
              {profiles.map(profile => (
                <View
                  key={profile.id}
                  style={[
                    styles.profileItem,
                    profile.id === activeProfile?.id && {
                      backgroundColor: themeColors.primaryLight,
                    },
                  ]}
                >
                  <TouchableOpacity
                    style={styles.profileMainContent}
                    onPress={() => handleSelectBudget(profile)}
                  >
                    <Text style={styles.profileIcon}>{getBudgetIcon(profile.type)}</Text>
                    <View style={styles.profileInfo}>
                      <Text style={[styles.profileName, { color: themeColors.textPrimary }]}>
                        {profile.name}
                      </Text>
                      <Text style={[styles.profileType, { color: themeColors.textSecondary }]}>
                        {profile.type === 'personal'
                          ? i18n.t('budgetSwitcher.personal')
                          : i18n.t('budgetSwitcher.household')}
                      </Text>
                    </View>
                    {profile.id === activeProfile?.id && (
                      <Text style={[styles.checkmark, { color: themeColors.primary }]}>✓</Text>
                    )}
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => handleRenameBudget(profile)}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <Text style={styles.editIcon}>✏️</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>

            {!profiles.some(p => p.type === 'household') && (
              <TouchableOpacity
                style={[styles.createButton, { backgroundColor: themeColors.primary }]}
                onPress={handleCreateHouseholdBudget}
              >
                <Text style={styles.createButtonText}>
                  + {i18n.t('budgetSwitcher.createHousehold')}
                </Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[styles.closeButton, { borderColor: themeColors.border }]}
              onPress={() => setShowPicker(false)}
            >
              <Text style={[styles.closeButtonText, { color: themeColors.textPrimary }]}>
                {i18n.t('common.close')}
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.lg,
    ...elevation.low,
    maxWidth: 200,
  },
  icon: {
    fontSize: 18,
    marginRight: spacing.xs,
  },
  text: {
    fontSize: typography.fontSize.body,
    fontWeight: typography.fontWeight.medium,
    flex: 1,
  },
  arrow: {
    fontSize: 10,
    marginLeft: spacing.xs,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    maxWidth: 400,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    ...elevation.high,
  },
  modalTitle: {
    fontSize: typography.fontSize.h3,
    fontWeight: typography.fontWeight.bold,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  profilesList: {
    maxHeight: 300,
  },
  profileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
  },
  profileMainContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    flex: 1,
  },
  profileIcon: {
    fontSize: 24,
    marginRight: spacing.md,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: typography.fontSize.body,
    fontWeight: typography.fontWeight.semibold,
    marginBottom: 2,
  },
  profileType: {
    fontSize: typography.fontSize.caption,
  },
  checkmark: {
    fontSize: 24,
    fontWeight: typography.fontWeight.bold,
  },
  editButton: {
    padding: spacing.sm,
    paddingRight: spacing.md,
  },
  editIcon: {
    fontSize: 18,
  },
  createButton: {
    padding: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    marginTop: spacing.md,
  },
  createButtonText: {
    color: lightColors.textInverse,
    fontSize: typography.fontSize.body,
    fontWeight: typography.fontWeight.semibold,
  },
  closeButton: {
    padding: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    marginTop: spacing.sm,
    borderWidth: 1,
  },
  closeButtonText: {
    fontSize: typography.fontSize.body,
    fontWeight: typography.fontWeight.medium,
  },
});
