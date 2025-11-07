import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import ConfigWizard from './components/ConfigWizard';
import BudgetDashboard from './components/BudgetDashboard';
import { saveBudgetConfig, loadBudgetConfig } from './utils/storage';
import { BudgetConfig } from './types';
import { colors } from './constants/theme';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [budgetConfig, setBudgetConfig] = useState<BudgetConfig | null>(null);

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    const config = await loadBudgetConfig();
    setBudgetConfig(config);
    setIsLoading(false);
  };

  const handleConfigComplete = async (config: BudgetConfig) => {
    const success = await saveBudgetConfig(config);
    if (success) {
      setBudgetConfig(config);
    }
  };

  const handleReconfigure = () => {
    setBudgetConfig(null);
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {budgetConfig ? (
        <BudgetDashboard
          config={budgetConfig}
          onReconfigure={handleReconfigure}
        />
      ) : (
        <ConfigWizard onComplete={handleConfigComplete} />
      )}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
