import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import { colors, typography, spacing, borderRadius, elevation } from '../constants/theme';
import i18n from '../utils/i18n';
import { 
  loadGamificationData, 
  getBadgeMetadata, 
  useStreakFreeze, 
  useJoker,
  canUseJoker 
} from '../utils/gamification';
import { GamificationData, Badge } from '../types';

export default function ProfileScreen() {
  const [gamificationData, setGamificationData] = useState<GamificationData | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [canUseJokerNow, setCanUseJokerNow] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const data = await loadGamificationData();
    setGamificationData(data);
    
    const jokerEligible = await canUseJoker();
    setCanUseJokerNow(jokerEligible);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
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
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
    >
      <View style={styles.content}>
        <Text style={styles.pageTitle}>{i18n.t('profile.title')}</Text>

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
});
