import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Image } from 'react-native';
import { AVATARS, AvatarId } from '../constants/avatars';
import { colors, typography, spacing, borderRadius, elevation } from '../constants/theme';
import i18n from '../utils/i18n';

interface AvatarSelectorProps {
  selectedAvatar?: AvatarId;
  onSelectAvatar: (avatarId: AvatarId) => void;
  title?: string;
  subtitle?: string;
}

export default function AvatarSelector({
  selectedAvatar,
  onSelectAvatar,
  title,
  subtitle,
}: AvatarSelectorProps) {
  return (
    <View style={styles.container}>
      {title && <Text style={styles.title}>{title}</Text>}
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.avatarGrid}>
          {AVATARS.map((avatar) => (
            <TouchableOpacity
              key={avatar.id}
              style={[
                styles.avatarCard,
                selectedAvatar === avatar.id && styles.avatarCardSelected,
              ]}
              onPress={() => onSelectAvatar(avatar.id)}
              activeOpacity={0.7}
            >
              <View style={styles.avatarCircle}>
                <Image 
                  source={avatar.imageSource} 
                  style={styles.avatarImage}
                  resizeMode="contain"
                />
              </View>
              <Text style={styles.avatarName}>
                {i18n.t(`avatars.${avatar.id}`, { defaultValue: avatar.name })}
              </Text>
              {selectedAvatar === avatar.id && (
                <View style={styles.selectedBadge}>
                  <Text style={styles.selectedBadgeText}>✓</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: typography.fontSize.h2,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: typography.fontSize.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  avatarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  avatarCard: {
    width: '47%',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.border,
    ...elevation.low,
  },
  avatarCardSelected: {
    borderColor: colors.primary,
    borderWidth: 3,
    backgroundColor: colors.primaryLight,
  },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  avatarImage: {
    width: 70,
    height: 70,
  },
  avatarName: {
    fontSize: typography.fontSize.body,
    fontWeight: typography.fontWeight.medium,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  selectedBadge: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedBadgeText: {
    fontSize: 16,
    fontWeight: typography.fontWeight.bold,
    color: colors.textInverse,
  },
});
