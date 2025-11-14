import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  ScrollView,
  Alert,
  TextInput,
  Platform,
} from 'react-native';
import { BudgetProfile } from '../types';
import {
  loadBudgetProfiles,
  getActiveBudgetId,
  setActiveBudgetId,
  createBudgetProfile,
  updateBudgetProfile,
  deleteBudgetProfile,
} from '../utils/storage';
import { lightColors, typography, spacing, borderRadius, elevation } from '../constants/theme';
import { useTheme } from '../contexts/ThemeContext';
import { useSubscription } from '../contexts/SubscriptionContext';
import i18n from '../utils/i18n';

interface BudgetSwitcherProps {
  onBudgetChange: () => void;
  navigation?: any; // Navigation object (not used in current implementation)
  visible?: boolean; // Optional: Control modal visibility externally
  onClose?: () => void; // Optional: Called when modal should close
}

export default function BudgetSwitcher({ onBudgetChange, visible: externalVisible, onClose }: BudgetSwitcherProps) {
  const { colors: themeColors } = useTheme();
  const { isPremium } = useSubscription();
  const [profiles, setProfiles] = useState<BudgetProfile[]>([]);
  const [activeProfile, setActiveProfile] = useState<BudgetProfile | null>(null);
  const [showPicker, setShowPicker] = useState(false);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [renamingProfile, setRenamingProfile] = useState<BudgetProfile | null>(null);
  const [newName, setNewName] = useState('');

  // Sync external visible prop with internal state
  useEffect(() => {
    if (externalVisible !== undefined) {
      setShowPicker(externalVisible);
    }
  }, [externalVisible]);

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

  const handleClosePicker = () => {
    setShowPicker(false);
    if (onClose) {
      onClose();
    }
  };

  const handleSelectBudget = async (profile: BudgetProfile) => {
    await setActiveBudgetId(profile.id);
    setActiveProfile(profile);
    handleClosePicker();
    onBudgetChange();
  };

  const handleRenameBudget = (profile: BudgetProfile) => {
    if (Platform.OS === 'ios') {
      // Use native iOS prompt
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
            onPress: async (inputName?: string) => {
              if (inputName && inputName.trim()) {
                await performRename(profile.id, inputName.trim());
              }
            },
          },
        ],
        'plain-text',
        profile.name
      );
    } else {
      // Use custom modal for Android
      setRenamingProfile(profile);
      setNewName(profile.name);
      setShowRenameModal(true);
    }
  };

  const performRename = async (profileId: string, name: string) => {
    const success = await updateBudgetProfile(profileId, { name });
    
    if (success) {
      await loadProfiles();
      Alert.alert(
        i18n.t('budgetSwitcher.renamed'),
        i18n.t('budgetSwitcher.budgetRenamed')
      );
    }
  };

  const handleSaveRename = async () => {
    if (renamingProfile && newName.trim()) {
      await performRename(renamingProfile.id, newName.trim());
      setShowRenameModal(false);
      setRenamingProfile(null);
      setNewName('');
    }
  };

  const handleCancelRename = () => {
    setShowRenameModal(false);
    setRenamingProfile(null);
    setNewName('');
  };

  const handleDeleteBudget = async (profile: BudgetProfile) => {
    // Check if this is the last budget profile
    if (profiles.length <= 1) {
      Alert.alert(
        i18n.t('budgetSwitcher.cannotDeleteLast'),
        i18n.t('budgetSwitcher.cannotDeleteLastMessage')
      );
      return;
    }

    Alert.alert(
      i18n.t('budgetSwitcher.deleteBudget'),
      i18n.t('budgetSwitcher.deleteBudgetMessage'),
      [
        {
          text: i18n.t('common.cancel'),
          style: 'cancel',
        },
        {
          text: i18n.t('common.delete'),
          style: 'destructive',
          onPress: async () => {
            const success = await deleteBudgetProfile(profile.id);
            
            if (success) {
              await loadProfiles();
              handleClosePicker();
              onBudgetChange();
              Alert.alert(
                i18n.t('budgetSwitcher.deleted'),
                i18n.t('budgetSwitcher.budgetDeleted')
              );
            }
          },
        },
      ]
    );
  };

  const handleCreateNewBudget = async () => {
    // Check budget limit for freemium users
    if (!isPremium && profiles.length >= 1) {
      Alert.alert(
        i18n.t('budgetSwitcher.budgetLimitReached'),
        i18n.t('budgetSwitcher.budgetLimitFreemium')
      );
      return;
    }

    // Generate the next budget name
    const budgetNumber = profiles.length + 1;
    const budgetName = `Mon budget ${budgetNumber}`;

    Alert.alert(
      i18n.t('budgetSwitcher.createNewBudget'),
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
              type: 'personal',
              name: budgetName,
              monthlyIncome: 0,
              fixedCharges: 0,
              savingsGoal: 0,
              cycleStartDay: activeProfile?.cycleStartDay || 1,
            });

            if (newProfile) {
              await loadProfiles();
              Alert.alert(
                i18n.t('budgetSwitcher.created'),
                i18n.t('budgetSwitcher.budgetCreated')
              );
            }
          },
        },
      ]
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

  const getBudgetIcon = (type: 'personal' | 'household') => {
    return type === 'personal' ? '👤' : '👨‍👩‍👧‍👦';
  };

  const handleAvatarClick = () => {
    // Always show the picker modal
    setShowPicker(true);
  };

  // When used externally with visible prop, only render modals, not the avatar
  const isExternallyControlled = externalVisible !== undefined;

  if (profiles.length <= 1) {
    // Always show avatar, even with single budget
    // Clicking opens the modal to create or switch budgets
    const icon = activeProfile ? getBudgetIcon(activeProfile.type) : '📊';
    
    return (
      <>
        {!isExternallyControlled && (
          <TouchableOpacity
            style={styles.avatarContainer}
            onPress={handleAvatarClick}
            activeOpacity={0.7}
          >
            <Text style={styles.avatarIcon}>{icon}</Text>
          </TouchableOpacity>
        )}

        {/* Modal for single budget - still shows option to create new budget */}
        <Modal
          visible={showPicker}
          transparent
          animationType="fade"
          onRequestClose={handleClosePicker}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={handleClosePicker}
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
                    <View style={styles.actionButtons}>
                      <TouchableOpacity
                        style={styles.editButton}
                        onPress={() => handleRenameBudget(profile)}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                      >
                        <Text style={styles.editIcon}>✏️</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={() => handleDeleteBudget(profile)}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                      >
                        <Text style={styles.deleteIcon}>🗑️</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </ScrollView>

              {/* Always show create new budget button */}
              <TouchableOpacity
                style={[styles.createButton, { backgroundColor: themeColors.primary }]}
                onPress={handleCreateNewBudget}
              >
                <Text style={styles.createButtonText}>
                  + {i18n.t('budgetSwitcher.createNewBudget')}
                </Text>
              </TouchableOpacity>

              {!profiles.some(p => p.type === 'household') && (
                <TouchableOpacity
                  style={[styles.createButton, { backgroundColor: themeColors.primary, marginTop: spacing.sm }]}
                  onPress={handleCreateHouseholdBudget}
                >
                  <Text style={styles.createButtonText}>
                    + {i18n.t('budgetSwitcher.createHousehold')}
                  </Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={[styles.closeButton, { borderColor: themeColors.border }]}
                onPress={handleClosePicker}
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

  return (
    <>
      {!isExternallyControlled && (
        <TouchableOpacity
          style={styles.avatarContainer}
          onPress={handleAvatarClick}
          activeOpacity={0.7}
        >
          <Text style={styles.avatarIcon}>{activeProfile ? getBudgetIcon(activeProfile.type) : '📊'}</Text>
        </TouchableOpacity>
      )}

      <Modal
        visible={showPicker}
        transparent
        animationType="fade"
        onRequestClose={handleClosePicker}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={handleClosePicker}
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
                  <View style={styles.actionButtons}>
                    <TouchableOpacity
                      style={styles.editButton}
                      onPress={() => handleRenameBudget(profile)}
                      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                      <Text style={styles.editIcon}>✏️</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => handleDeleteBudget(profile)}
                      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                      <Text style={styles.deleteIcon}>🗑️</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </ScrollView>

            {/* Always show create new budget button */}
            <TouchableOpacity
              style={[styles.createButton, { backgroundColor: themeColors.primary }]}
              onPress={handleCreateNewBudget}
            >
              <Text style={styles.createButtonText}>
                + {i18n.t('budgetSwitcher.createNewBudget')}
              </Text>
            </TouchableOpacity>

            {!profiles.some(p => p.type === 'household') && (
              <TouchableOpacity
                style={[styles.createButton, { backgroundColor: themeColors.primary, marginTop: spacing.sm }]}
                onPress={handleCreateHouseholdBudget}
              >
                <Text style={styles.createButtonText}>
                  + {i18n.t('budgetSwitcher.createHousehold')}
                </Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[styles.closeButton, { borderColor: themeColors.border }]}
              onPress={handleClosePicker}
            >
              <Text style={[styles.closeButtonText, { color: themeColors.textPrimary }]}>
                {i18n.t('common.close')}
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Rename Modal for Android */}
      <Modal
        visible={showRenameModal}
        transparent
        animationType="fade"
        onRequestClose={handleCancelRename}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={handleCancelRename}
        >
          <TouchableOpacity activeOpacity={1}>
            <View style={[styles.renameModalContent, { backgroundColor: themeColors.surface }]}>
              <Text style={[styles.renameModalTitle, { color: themeColors.textPrimary }]}>
                {i18n.t('budgetSwitcher.renameBudget')}
              </Text>
              <Text style={[styles.renameModalMessage, { color: themeColors.textSecondary }]}>
                {i18n.t('budgetSwitcher.renameBudgetMessage')}
              </Text>
              <TextInput
                style={[
                  styles.renameInput,
                  {
                    backgroundColor: themeColors.background,
                    color: themeColors.textPrimary,
                    borderColor: themeColors.border,
                  },
                ]}
                value={newName}
                onChangeText={setNewName}
                placeholder={renamingProfile?.name}
                placeholderTextColor={themeColors.textSecondary}
                autoFocus
                selectTextOnFocus
              />
              <View style={styles.renameModalButtons}>
                <TouchableOpacity
                  style={[styles.renameModalButton, { borderColor: themeColors.border }]}
                  onPress={handleCancelRename}
                >
                  <Text style={[styles.renameModalButtonText, { color: themeColors.textPrimary }]}>
                    {i18n.t('common.cancel')}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.renameModalButton,
                    styles.renameModalButtonPrimary,
                    { backgroundColor: themeColors.primary },
                  ]}
                  onPress={handleSaveRename}
                >
                  <Text style={styles.renameModalButtonTextPrimary}>
                    {i18n.t('common.save')}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  avatarContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: lightColors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    ...elevation.medium,
  },
  avatarIcon: {
    fontSize: 32,
  },
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
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editButton: {
    padding: spacing.sm,
  },
  editIcon: {
    fontSize: 18,
  },
  deleteButton: {
    padding: spacing.sm,
    paddingRight: spacing.md,
  },
  deleteIcon: {
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
  // Rename modal styles
  renameModalContent: {
    width: '85%',
    maxWidth: 400,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    ...elevation.high,
  },
  renameModalTitle: {
    fontSize: typography.fontSize.h3,
    fontWeight: typography.fontWeight.bold,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  renameModalMessage: {
    fontSize: typography.fontSize.body,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  renameInput: {
    borderWidth: 1,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    fontSize: typography.fontSize.body,
    marginBottom: spacing.lg,
  },
  renameModalButtons: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  renameModalButton: {
    flex: 1,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    borderWidth: 1,
  },
  renameModalButtonPrimary: {
    borderWidth: 0,
  },
  renameModalButtonText: {
    fontSize: typography.fontSize.body,
    fontWeight: typography.fontWeight.medium,
  },
  renameModalButtonTextPrimary: {
    color: lightColors.textInverse,
    fontSize: typography.fontSize.body,
    fontWeight: typography.fontWeight.semibold,
  },
});
