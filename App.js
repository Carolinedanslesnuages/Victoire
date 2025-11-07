import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import ConfigWizard from './components/ConfigWizard';
import BudgetDashboard from './components/BudgetDashboard';
import { saveBudgetConfig, loadBudgetConfig } from './utils/storage';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [budgetConfig, setBudgetConfig] = useState(null);

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    const config = await loadBudgetConfig();
    setBudgetConfig(config);
    setIsLoading(false);
  };

  const handleConfigComplete = async (config) => {
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
        <ActivityIndicator size="large" color="#007AFF" />
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
    backgroundColor: '#fff',
  },
});
