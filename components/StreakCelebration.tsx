import React, { useEffect, useRef } from 'react';
import { Modal, View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { colors, typography, spacing, borderRadius } from '../constants/theme';
import i18n from '../utils/i18n';

interface StreakCelebrationProps {
  visible: boolean;
  streakCount: number;
  onComplete: () => void;
}

const { width } = Dimensions.get('window');

export default function StreakCelebration({ visible, streakCount, onComplete }: StreakCelebrationProps) {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (visible) {
      // Start animation sequence
      Animated.sequence([
        // Scale up and fade in
        Animated.parallel([
          Animated.spring(scaleAnim, {
            toValue: 1,
            friction: 8,
            tension: 40,
            useNativeDriver: true,
          }),
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
        ]),
        // Rotate animation
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        // Pulse animation
        Animated.loop(
          Animated.sequence([
            Animated.timing(pulseAnim, {
              toValue: 1.1,
              duration: 400,
              useNativeDriver: true,
            }),
            Animated.timing(pulseAnim, {
              toValue: 1,
              duration: 400,
              useNativeDriver: true,
            }),
          ]),
          { iterations: 2 }
        ),
        // Fade out after celebration
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          delay: 800,
          useNativeDriver: true,
        }),
      ]).start(() => {
        // Reset animations
        scaleAnim.setValue(0);
        rotateAnim.setValue(0);
        fadeAnim.setValue(0);
        pulseAnim.setValue(1);
        onComplete();
      });
    }
  }, [visible]);

  if (!visible) return null;

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
    >
      <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
        <Animated.View
          style={[
            styles.container,
            {
              transform: [
                { scale: Animated.multiply(scaleAnim, pulseAnim) },
                { rotate: rotation },
              ],
            },
          ]}
        >
          <View style={styles.flameContainer}>
            <Text style={styles.flameEmoji}>🔥</Text>
          </View>
        </Animated.View>
        
        <Animated.View
          style={[
            styles.textContainer,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <Text style={styles.celebrationText}>
            {streakCount === 1 ? i18n.t('streakCelebration.dayOne') : i18n.t('streakCelebration.streak')}
          </Text>
          <Text style={styles.streakNumber}>{streakCount}</Text>
          <Text style={styles.daysText}>
            {streakCount === 1 ? i18n.t('streakCelebration.day') : i18n.t('streakCelebration.days')}
          </Text>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 20,
  },
  flameContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  flameEmoji: {
    fontSize: 100,
  },
  textContainer: {
    marginTop: spacing.xl,
    alignItems: 'center',
  },
  celebrationText: {
    fontSize: typography.fontSize.h3,
    fontWeight: typography.fontWeight.bold,
    color: colors.textInverse,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  streakNumber: {
    fontSize: 64,
    fontWeight: typography.fontWeight.bold,
    color: colors.warning,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  daysText: {
    fontSize: typography.fontSize.h4,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textInverse,
    marginTop: spacing.xs,
  },
});
