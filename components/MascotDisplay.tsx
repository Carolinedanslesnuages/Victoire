/**
 * MascotDisplay component - L'Écureuil Économe reactive mascot
 * Displays mascot with changing mood based on budget status
 */

import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { MascotState } from '../utils/mascot';
import { colors, spacing, borderRadius, typography } from '../constants/theme';
import i18n from '../utils/i18n';

interface MascotDisplayProps {
  mascotState: MascotState;
  showDescription?: boolean;
  size?: 'small' | 'medium' | 'large';
}

export default function MascotDisplay({ 
  mascotState, 
  showDescription = true,
  size = 'medium' 
}: MascotDisplayProps) {
  
  // Zone colors based on mascot state
  const zoneColors = {
    green: '#47B28F',  // Vert (Succès)
    yellow: '#FFC759', // Jaune (Vigilance)
    red: '#E55C5C',    // Rouge (Danger)
  };
  
  // Size dimensions
  const sizes = {
    small: 80,
    medium: 120,
    large: 160,
  };
  
  const mascotSize = sizes[size];
  const backgroundColor = zoneColors[mascotState.zone];
  const containerSize = mascotSize;
  
  return (
    <View style={styles.container}>
      <View 
        style={[
          styles.mascotContainer, 
          { 
            backgroundColor: `${backgroundColor}20`,
            borderColor: backgroundColor,
            width: containerSize,
            height: containerSize
          }
        ]}
      >
   <Image
          source={mascotState.imageSource}
          style={[styles.mascotImage, { width: mascotSize, height: mascotSize }]}
          resizeMode="contain"
        />
      </View>
      
      {showDescription && (
        <View style={styles.descriptionContainer}>
          <Text style={[styles.moodText, { color: backgroundColor }]}>
            {i18n.t(mascotState.description)}
          </Text>
          <View style={[styles.zoneBadge, { backgroundColor }]}>
            <Text style={styles.zoneBadgeText}>
              {i18n.t(`mascot.zones.${mascotState.zone}`)}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
  },
  mascotContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.full,
    borderWidth: 3,
    padding: spacing.md,
    overflow: 'hidden', 
    backgroundColor: colors.surface, 
  },
  mascotPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.gray100,
    borderRadius: borderRadius.full,
  },
  mascotEmoji: {
    fontSize: 60,
  },
  mascotImage: {
    // Size is controlled by inline style props
  },
  descriptionContainer: {
    alignItems: 'center',
    marginTop: spacing.md,
  },
  moodText: {
    fontSize: typography.fontSize.h4,
    fontWeight: typography.fontWeight.bold,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  zoneBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  zoneBadgeText: {
    fontSize: typography.fontSize.bodySmall,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textInverse,
  },
});