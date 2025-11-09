import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import BudgetDashboard from '../components/BudgetDashboard';
import HistoryScreen from '../components/HistoryScreen';
import ProfileScreen from '../components/ProfileScreen';
import SettingsScreen from '../components/SettingsScreen';
import { colors, typography } from '../constants/theme';
import i18n from '../utils/i18n';
import { BudgetProfile } from '../types';

const Tab = createBottomTabNavigator();

interface MainTabNavigatorProps {
  budgetProfile: BudgetProfile;
  onReconfigure: () => void;
  onAddExpense: () => void;
  onBudgetChange: () => void;
  refreshKey: number;
}

export default function MainTabNavigator({ 
  budgetProfile, 
  onReconfigure, 
  onAddExpense, 
  onBudgetChange,
  refreshKey 
}: MainTabNavigatorProps) {
  const [isSettingsVisible, setIsSettingsVisible] = React.useState(false);

  const getBudgetIcon = (type: 'personal' | 'household') => {
    return type === 'personal' ? '👤' : '👨‍👩‍👧‍👦';
  };

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
          {() => <BudgetDashboard profile={budgetProfile} onReconfigure={onReconfigure} refreshKey={refreshKey} />}
        </Tab.Screen>

        <Tab.Screen
          name="History"
          component={HistoryScreen}
          options={{
            tabBarLabel: i18n.t('navigation.history'),
            tabBarIcon: ({ color, size }) => (
              <Text style={{ fontSize: size, color }}>📋</Text>
            ),
          }}
        />

        {/* Central Add Expense Tab - No Label, Regular Icon Style */}
        <Tab.Screen
          name="AddExpense"
          component={EmptyComponent}
          options={{
            tabBarLabel: '',
            tabBarIcon: ({ color, size }) => (
              <Text style={{ fontSize: size, color }}>➕</Text>
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
          name="Profile"
          options={{
            tabBarLabel: i18n.t('navigation.profile'),
            tabBarIcon: ({ color, size }) => (
              <Text style={{ fontSize: size, color }}>{getBudgetIcon(budgetProfile.type)}</Text>
            ),
          }}
        >
          {() => <ProfileScreen onBudgetChange={onBudgetChange} />}
        </Tab.Screen>

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
