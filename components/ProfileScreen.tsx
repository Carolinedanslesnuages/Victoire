import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert, RefreshControl, TextInput, Platform, Modal } from 'react-native';
import { colors, typography, spacing, borderRadius, elevation } from '../constants/theme';
import i18n from '../utils/i18n';
import { 
  loadGamificationData, 
  getBadgeMetadata, 
  useStreakFreeze, 
  useJoker,
  canUseJoker 
} from '../utils/gamification';
import { GamificationData, Badge, BudgetProfile } from '../types';
import {
  loadBudgetProfiles,
  getActiveBudgetId,
  setActiveBudgetId,
  createBudgetProfile,
  updateBudgetProfile,
  deleteBudgetProfile,
} from '../utils/storage';
import { shareAchievement } from '../utils/sharing';

interface ProfileScreenProps {
  onBudgetChange?: () => void;
}

export default function ProfileScreen({ onBudgetChange }: ProfileScreenProps) {
  const [gamificationData, setGamificationData] = useState<GamificationData | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [canUseJokerNow, setCanUseJokerNow] = useState(false);
  const [profiles, setProfiles] = useState<BudgetProfile[]>([]);
  const [activeProfile, setActiveProfile] = useState<BudgetProfile | null>(null);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [renamingProfile, setRenamingProfile] = useState<BudgetProfile | null>(null);
  const [newName, setNewName] = useState('');

  useEffect(() => {
    loadData();
    loadProfiles();
  }, []);

  const loadData = async () => {
    const data = await loadGamificationData();
    setGamificationData(data);
    
    const jokerEligible = await canUseJoker();
    setCanUseJokerNow(jokerEligible);
  };

  const loadProfiles = async () => {
    const allProfiles = await loadBudgetProfiles();
    setProfiles(allProfiles);
    
    const activeId = await getActiveBudgetId();
    if (activeId) {
      const active = allProfiles.find(p => p.id === activeId);
      setActiveProfile(active || null);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
    await loadProfiles();
    setRefreshing(false);
  };

  const handleSelectBudget = async (profile: BudgetProfile) => {
    await setActiveBudgetId(profile.id);
    setActiveProfile(profile);
    if (onBudgetChange) {
      onBudgetChange();
    }
  };

  const handleRenameBudget = (profile: BudgetProfile) => {
    if (Platform.OS === 'ios') {
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
              if (onBudgetChange) {
                onBudgetChange();
              }
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

  const handleCreateHouseholdBudget = async () => {
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

  const handleUseFreeze = async () => {
    if (!gamificationData || gamificationData.streakInfo.streakFreezes <= 0) {
      Alert.alert(i18n.t('profile.streakSection.noFreezes'));
      return;
    }

    Alert.alert(
      i18n.t('profile.streakSection.useFreeze'),
      'Êtes-vous sûr de vouloir utiliser un gel de série ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Confirmer',
          onPress: async () => {
            const success = await useStreakFreeze();
            if (success) {
              Alert.alert(i18n.t('profile.streakSection.freezeUsed'));
              await loadData();
            }
          },
        },
      ]
    );
  };

  const handleUseJoker = async () => {
    if (!gamificationData || gamificationData.streakInfo.jokersRemaining <= 0) {
      Alert.alert(i18n.t('profile.streakSection.noJokers'));
      return;
    }

    if (!canUseJokerNow) {
      Alert.alert(i18n.t('profile.streakSection.jokerNotEligible'));
      return;
    }

    Alert.alert(
      i18n.t('profile.streakSection.useJoker'),
      'Êtes-vous sûr de vouloir utiliser un joker pour cette journée ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Confirmer',
          onPress: async () => {
            const success = await useJoker();
            if (success) {
              Alert.alert(i18n.t('profile.streakSection.jokerUsed'));
              await loadData();
            }
          },
        },
      ]
    );
  };

  const handleShareSuccess = async () => {
    if (!gamificationData) return;
    
    const streakDays = gamificationData.streakInfo.currentStreak;
    
    // US 17.2.1: Share achievement success to social media
    if (streakDays >= 3) {
      const success = await shareAchievement('streak', streakDays);
      if (!success) {
        Alert.alert(i18n.t('sharing.shareError'));
      }
    } else {
      Alert.alert(
        i18n.t('sharing.shareDialogTitle'),
        'Atteignez une série de 3 jours pour partager votre succès !'
      );
    }
  };

  const renderBadge = (badge: Badge) => {
    const metadata = getBadgeMetadata(badge.type);
    return (
      <View key={badge.type} style={styles.badgeItem}>
        <View style={[styles.badgeCircle, badge.isRare && styles.badgeCircleRare]}>
          <Text style={styles.badgeEmoji}>{metadata.emoji}</Text>
        </View>
        <Text style={styles.badgeName}>{i18n.t(metadata.nameKey)}</Text>
        {badge.isRare && (
          <Text style={styles.rareBadgeLabel}>{i18n.t('profile.badgesSection.rareBadge')}</Text>
        )}
      </View>
    );
  };

  if (!gamificationData) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Chargement...</Text>
      </View>
    );
  }

  const { streakInfo, badges, monthlyStats } = gamificationData;

  return (
    <>
      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        <View style={styles.content}>
          <Text style={styles.pageTitle}>{i18n.t('profile.title')}</Text>

          {/* Budget Profiles Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{i18n.t('budgetSwitcher.selectBudget')}</Text>
            
            <View style={styles.profilesList}>
              {profiles.map(profile => (
                <View
                  key={profile.id}
                  style={[
                    styles.profileItem,
                    profile.id === activeProfile?.id && styles.profileItemActive,
                  ]}
                >
                  <TouchableOpacity
                    style={styles.profileMainContent}
                    onPress={() => handleSelectBudget(profile)}
                  >
                    <Text style={styles.profileIcon}>{getBudgetIcon(profile.type)}</Text>
                    <View style={styles.profileInfo}>
                      <Text style={styles.profileName}>
                        {profile.name}
                      </Text>
                      <Text style={styles.profileType}>
                        {profile.type === 'personal'
                          ? i18n.t('budgetSwitcher.personal')
                          : i18n.t('budgetSwitcher.household')}
                      </Text>
                    </View>
                    {profile.id === activeProfile?.id && (
                      <Text style={styles.checkmark}>✓</Text>
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
            </View>

            {!profiles.some(p => p.type === 'household') && (
              <TouchableOpacity
                style={styles.createButton}
                onPress={handleCreateHouseholdBudget}
              >
                <Text style={styles.createButtonText}>
                  + {i18n.t('budgetSwitcher.createHousehold')}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Streak Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{i18n.t('profile.streakSection.title')}</Text>
          
          <View style={styles.streakCard}>
            <View style={styles.streakRow}>
              <View style={styles.streakItem}>
                <Text style={styles.streakLabel}>{i18n.t('profile.streakSection.currentStreak')}</Text>
                <View style={styles.streakValueContainer}>
                  <Text style={styles.streakValue}>{streakInfo.currentStreak}</Text>
                  <Text style={styles.streakDays}>{i18n.t('profile.streakSection.days')}</Text>
                </View>
              </View>
              
              <View style={styles.streakDivider} />
              
              <View style={styles.streakItem}>
                <Text style={styles.streakLabel}>{i18n.t('profile.streakSection.longestStreak')}</Text>
                <View style={styles.streakValueContainer}>
                  <Text style={styles.streakValue}>{streakInfo.longestStreak}</Text>
                  <Text style={styles.streakDays}>{i18n.t('profile.streakSection.days')}</Text>
                </View>
              </View>
            </View>

            {/* Safety Nets */}
            <View style={styles.safetyNetsContainer}>
              <View style={styles.safetyNetItem}>
                <Text style={styles.safetyNetLabel}>
                  🧊 {i18n.t('profile.streakSection.streakFreezes')}
                </Text>
                <Text style={styles.safetyNetValue}>{streakInfo.streakFreezes}</Text>
              </View>
              
              <View style={styles.safetyNetItem}>
                <Text style={styles.safetyNetLabel}>
                  ❤️ {i18n.t('profile.streakSection.jokersRemaining')}
                </Text>
                <Text style={styles.safetyNetValue}>{streakInfo.jokersRemaining}</Text>
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={[
                  styles.actionButton,
                  streakInfo.streakFreezes <= 0 && styles.actionButtonDisabled,
                ]}
                onPress={handleUseFreeze}
                disabled={streakInfo.streakFreezes <= 0}
                activeOpacity={0.7}
              >
                <Text style={styles.actionButtonText}>
                  🧊 {i18n.t('profile.streakSection.useFreeze')}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.actionButton,
                  (streakInfo.jokersRemaining <= 0 || !canUseJokerNow) && styles.actionButtonDisabled,
                ]}
                onPress={handleUseJoker}
                disabled={streakInfo.jokersRemaining <= 0 || !canUseJokerNow}
                activeOpacity={0.7}
              >
                <Text style={styles.actionButtonText}>
                  ❤️ {i18n.t('profile.streakSection.useJoker')}
                </Text>
              </TouchableOpacity>
            </View>

            {/* US 17.2.1: Share Success Button */}
            {streakInfo.currentStreak >= 3 && (
              <TouchableOpacity
                style={styles.shareButton}
                onPress={handleShareSuccess}
                activeOpacity={0.7}
              >
                <Text style={styles.shareButtonText}>
                  {i18n.t('sharing.shareButton')}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Badges Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{i18n.t('profile.badgesSection.title')}</Text>
          <Text style={styles.badgeCount}>
            {i18n.t('profile.badgesSection.unlockedCount', { count: badges.length })}
          </Text>
          
          {badges.length === 0 ? (
            <Text style={styles.noBadgesText}>{i18n.t('profile.badgesSection.noBadges')}</Text>
          ) : (
            <View style={styles.badgesGrid}>
              {badges.map(renderBadge)}
            </View>
          )}
        </View>

        {/* Stats Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{i18n.t('profile.statsSection.title')}</Text>
          
          <View style={styles.statsCard}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>{i18n.t('profile.statsSection.cyclesCompleted')}</Text>
              <Text style={styles.statValue}>{monthlyStats.totalCyclesCompleted}</Text>
            </View>
            
            <View style={styles.statDivider} />
            
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>{i18n.t('profile.statsSection.cyclesPositive')}</Text>
              <Text style={styles.statValue}>{monthlyStats.cyclesWithPositiveBalance}</Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>

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
          <View style={styles.renameModalContent}>
            <Text style={styles.renameModalTitle}>
              {i18n.t('budgetSwitcher.renameBudget')}
            </Text>
            <Text style={styles.renameModalMessage}>
              {i18n.t('budgetSwitcher.renameBudgetMessage')}
            </Text>
            <TextInput
              style={styles.renameInput}
              value={newName}
              onChangeText={setNewName}
              placeholder={renamingProfile?.name}
              placeholderTextColor={colors.textSecondary}
              autoFocus
              selectTextOnFocus
            />
            <View style={styles.renameModalButtons}>
              <TouchableOpacity
                style={styles.renameModalButton}
                onPress={handleCancelRename}
              >
                <Text style={styles.renameModalButtonText}>
                  {i18n.t('common.cancel')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.renameModalButton, styles.renameModalButtonPrimary]}
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
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.lg,
    paddingTop: 60,
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 100,
    fontSize: typography.fontSize.body,
    color: colors.textSecondary,
  },
  pageTitle: {
    fontSize: typography.fontSize.h2,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: spacing.xl,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: typography.fontSize.h3,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  streakCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    ...elevation.low,
  },
  streakRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: spacing.lg,
  },
  streakItem: {
    alignItems: 'center',
    flex: 1,
  },
  streakLabel: {
    fontSize: typography.fontSize.bodySmall,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  streakValueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  streakValue: {
    fontSize: typography.fontSize.h1,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
    marginRight: spacing.xs,
  },
  streakDays: {
    fontSize: typography.fontSize.body,
    color: colors.textSecondary,
  },
  streakDivider: {
    width: 1,
    backgroundColor: colors.border,
    marginHorizontal: spacing.md,
  },
  safetyNetsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: spacing.lg,
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.border,
  },
  safetyNetItem: {
    alignItems: 'center',
  },
  safetyNetLabel: {
    fontSize: typography.fontSize.body,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  safetyNetValue: {
    fontSize: typography.fontSize.h3,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  actionButton: {
    flex: 1,
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  actionButtonDisabled: {
    backgroundColor: colors.gray200,
    opacity: 0.5,
  },
  actionButtonText: {
    fontSize: typography.fontSize.bodySmall,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textInverse,
  },
  shareButton: {
    backgroundColor: colors.success,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    marginTop: spacing.md,
    ...elevation.low,
  },
  shareButtonText: {
    fontSize: typography.fontSize.body,
    fontWeight: typography.fontWeight.bold,
    color: colors.textInverse,
  },
  badgeCount: {
    fontSize: typography.fontSize.body,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  noBadgesText: {
    fontSize: typography.fontSize.body,
    color: colors.textSecondary,
    textAlign: 'center',
    paddingVertical: spacing.xl,
    fontStyle: 'italic',
  },
  badgesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  badgeItem: {
    width: '30%',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  badgeCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xs,
    ...elevation.low,
  },
  badgeCircleRare: {
    backgroundColor: colors.warning,
  },
  badgeEmoji: {
    fontSize: 36,
  },
  badgeName: {
    fontSize: typography.fontSize.caption,
    color: colors.textPrimary,
    textAlign: 'center',
    fontWeight: typography.fontWeight.medium,
  },
  rareBadgeLabel: {
    fontSize: typography.fontSize.caption,
    color: colors.warning,
    textAlign: 'center',
    marginTop: 2,
  },
  statsCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    flexDirection: 'row',
    ...elevation.low,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: typography.fontSize.body,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  statValue: {
    fontSize: typography.fontSize.h2,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
  },
  statDivider: {
    width: 1,
    backgroundColor: colors.border,
    marginHorizontal: spacing.md,
  },
  // Budget Profiles Section Styles
  profilesList: {
    marginBottom: spacing.md,
  },
  profileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
    borderWidth: 2,
    borderColor: colors.border,
    ...elevation.low,
  },
  profileItemActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
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
    color: colors.textPrimary,
    marginBottom: 2,
  },
  profileType: {
    fontSize: typography.fontSize.caption,
    color: colors.textSecondary,
  },
  checkmark: {
    fontSize: 24,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
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
    backgroundColor: colors.primary,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  createButtonText: {
    color: colors.textInverse,
    fontSize: typography.fontSize.body,
    fontWeight: typography.fontWeight.semibold,
  },
  // Rename Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  renameModalContent: {
    width: '85%',
    maxWidth: 400,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    ...elevation.high,
  },
  renameModalTitle: {
    fontSize: typography.fontSize.h3,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  renameModalMessage: {
    fontSize: typography.fontSize.body,
    color: colors.textSecondary,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  renameInput: {
    backgroundColor: colors.background,
    color: colors.textPrimary,
    borderColor: colors.border,
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
    borderColor: colors.border,
  },
  renameModalButtonPrimary: {
    backgroundColor: colors.primary,
    borderWidth: 0,
  },
  renameModalButtonText: {
    fontSize: typography.fontSize.body,
    fontWeight: typography.fontWeight.medium,
    color: colors.textPrimary,
  },
  renameModalButtonTextPrimary: {
    color: colors.textInverse,
    fontSize: typography.fontSize.body,
    fontWeight: typography.fontWeight.semibold,
  },
});
