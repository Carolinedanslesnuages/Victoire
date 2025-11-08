import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet, View, Text } from 'react-native';
import BudgetDashboard from '../components/BudgetDashboard';
import SettingsScreen from '../components/SettingsScreen';
import { colors, typography, borderRadius, elevation } from '../constants/theme';
import i18n from '../utils/i18n';
import { BudgetConfig } from '../types';

const Tab = createBottomTabNavigator();

interface MainTabNavigatorProps {
  budgetConfig: BudgetConfig;
  onReconfigure: () => void;
  onAddExpense: () => void;
}

export default function MainTabNavigator({ budgetConfig, onReconfigure, onAddExpense }: MainTabNavigatorProps) {
  const [isSettingsVisible, setIsSettingsVisible] = React.useState(false);

  return (
    <>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.gray400,
          tabBarStyle: {
            backgroundColor: colors.surface,
            borderTopWidth: 1,
            borderTopColor: colors.borderLight,
            height: 70,
            paddingBottom: 10,
            paddingTop: 10,
            // Flat design - no heavy shadows
            elevation: 0,
            shadowOpacity: 0,
          },
          tabBarLabelStyle: {
            fontSize: typography.fontSize.caption,
            fontWeight: typography.fontWeight.medium,
          },
          tabBarIconStyle: {
            marginTop: 5,
          },
        }}
      >
        <Tab.Screen
          name="Home"
          options={{
            tabBarLabel: i18n.t('navigation.home'),
            tabBarIcon: ({ color, size }) => (
              <Text style={{ fontSize: size, color }}>🏠</Text>
            ),
          }}
        >
          {() => <BudgetDashboard config={budgetConfig} onReconfigure={onReconfigure} />}
        </Tab.Screen>

        {/* Central FAB as a Tab */}
        <Tab.Screen
          name="AddExpense"
          component={EmptyComponent}
          options={{
            tabBarLabel: '',
            tabBarIcon: () => (
              <View style={styles.fabContainer}>
                <View style={styles.fab}>
                  <Text style={styles.fabText}>+</Text>
                </View>
              </View>
            ),
          }}
          listeners={{
            tabPress: (e) => {
              e.preventDefault();
              onAddExpense();
            },
          }}
        />

        <Tab.Screen
          name="Settings"
          component={EmptyComponent}
          options={{
            tabBarLabel: i18n.t('navigation.settings'),
            tabBarIcon: ({ color, size }) => (
              <Text style={{ fontSize: size, color }}>⚙️</Text>
            ),
          }}
          listeners={{
            tabPress: (e) => {
              e.preventDefault();
              setIsSettingsVisible(true);
            },
          }}
        />
      </Tab.Navigator>

      {/* Settings Screen Modal */}
      <SettingsScreen
        visible={isSettingsVisible}
        onClose={() => setIsSettingsVisible(false)}
        onResetComplete={onReconfigure}
      />
    </>
  );
}

// Empty component for tabs that don't have a screen
const EmptyComponent = () => null;

const styles = StyleSheet.create({
  fabContainer: {
    position: 'absolute',
    top: -30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fab: {
    width: 64,
    height: 64,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...elevation.medium,
  },
  fabText: {
    fontSize: 36,
    color: colors.textInverse,
    fontWeight: typography.fontWeight.regular,
  },
});
