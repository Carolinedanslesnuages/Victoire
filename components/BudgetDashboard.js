import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';

export default function BudgetDashboard({ config, onReconfigure }) {
  // Calculate "reste à vivre" (remaining to live)
  const resteAVivre = config.monthlyIncome - config.fixedCharges - config.savingsGoal;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mon Budget PACE</Text>
        <Text style={styles.subtitle}>
          Cycle commence le {config.cycleStartDay} de chaque mois
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Revenus mensuels</Text>
        <Text style={styles.cardAmount}>{formatCurrency(config.monthlyIncome)}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Charges fixes</Text>
        <Text style={[styles.cardAmount, styles.expense]}>
          -{formatCurrency(config.fixedCharges)}
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Objectif d'épargne</Text>
        <Text style={[styles.cardAmount, styles.expense]}>
          -{formatCurrency(config.savingsGoal)}
        </Text>
      </View>

      <View style={[styles.card, styles.highlightCard]}>
        <Text style={styles.highlightTitle}>Reste à vivre</Text>
        <Text style={[styles.highlightAmount, resteAVivre < 0 && styles.negative]}>
          {formatCurrency(resteAVivre)}
        </Text>
        {resteAVivre < 0 && (
          <Text style={styles.warning}>
            ⚠️ Attention : Vos dépenses dépassent vos revenus
          </Text>
        )}
      </View>

      <TouchableOpacity style={styles.button} onPress={onReconfigure}>
        <Text style={styles.buttonText}>Modifier la configuration</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#007AFF',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
  },
  card: {
    backgroundColor: '#fff',
    margin: 12,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  cardAmount: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  expense: {
    color: '#FF3B30',
  },
  highlightCard: {
    backgroundColor: '#4CAF50',
    marginTop: 8,
  },
  highlightTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 8,
  },
  highlightAmount: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
  },
  negative: {
    color: '#FFE5E5',
  },
  warning: {
    fontSize: 14,
    color: '#FFE5E5',
    marginTop: 12,
    fontWeight: '500',
  },
  button: {
    backgroundColor: '#fff',
    margin: 12,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#007AFF',
    marginBottom: 32,
  },
  buttonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
