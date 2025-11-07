import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { BudgetConfig } from '../types';

interface ConfigWizardProps {
  onComplete: (config: BudgetConfig) => void;
}

export default function ConfigWizard({ onComplete }: ConfigWizardProps) {
  const [monthlyIncome, setMonthlyIncome] = useState('');
  const [fixedCharges, setFixedCharges] = useState('');
  const [savingsGoal, setSavingsGoal] = useState('');
  const [cycleStartDay, setCycleStartDay] = useState('');

  const handleSubmit = () => {
    // Validation
    const income = parseFloat(monthlyIncome);
    const charges = parseFloat(fixedCharges);
    const savings = parseFloat(savingsGoal);
    const startDay = parseInt(cycleStartDay);

    if (isNaN(income) || income <= 0) {
      Alert.alert('Erreur', 'Veuillez saisir un revenu mensuel valide');
      return;
    }

    if (isNaN(charges) || charges < 0) {
      Alert.alert('Erreur', 'Veuillez saisir un montant de charges valide');
      return;
    }

    if (isNaN(savings) || savings < 0) {
      Alert.alert('Erreur', 'Veuillez saisir un objectif d\'épargne valide');
      return;
    }

    if (isNaN(startDay) || startDay < 1 || startDay > 31) {
      Alert.alert('Erreur', 'Veuillez saisir un jour entre 1 et 31');
      return;
    }

    const config = {
      monthlyIncome: income,
      fixedCharges: charges,
      savingsGoal: savings,
      cycleStartDay: startDay,
    };

    onComplete(config);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Configuration Budgétaire</Text>
        <Text style={styles.subtitle}>
          Définissez votre cadre budgétaire pour commencer
        </Text>

        <View style={styles.formSection}>
          <Text style={styles.label}>Revenus mensuels nets (€)</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: 2500"
            keyboardType="decimal-pad"
            value={monthlyIncome}
            onChangeText={setMonthlyIncome}
          />
        </View>

        <View style={styles.formSection}>
          <Text style={styles.label}>Charges fixes totales (€)</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: 1200"
            keyboardType="decimal-pad"
            value={fixedCharges}
            onChangeText={setFixedCharges}
          />
        </View>

        <View style={styles.formSection}>
          <Text style={styles.label}>Objectif d'épargne (€)</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: 300"
            keyboardType="decimal-pad"
            value={savingsGoal}
            onChangeText={setSavingsGoal}
          />
        </View>

        <View style={styles.formSection}>
          <Text style={styles.label}>
            Jour de début du cycle budgétaire (1-31)
          </Text>
          <Text style={styles.hint}>
            Le jour du mois où vous recevez votre salaire
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: 5"
            keyboardType="number-pad"
            value={cycleStartDay}
            onChangeText={setCycleStartDay}
            maxLength={2}
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Enregistrer</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 32,
    textAlign: 'center',
  },
  formSection: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  hint: {
    fontSize: 13,
    color: '#888',
    marginBottom: 8,
    fontStyle: 'italic',
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 32,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
