import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, RefreshControl } from 'react-native';
import BudgetRing from './BudgetRing';
import AddExpenseModal from './AddExpenseModal';
import {
  calculateDailyBudget,
  getDaysRemainingInCycle,
  calculateBudgetStatus,
  calculateSpentPercentage,
} from '../utils/budgetCalculations';
import {
  saveTransaction,
  getTransactionsForCurrentCycle,
} from '../utils/storage';

export default function BudgetDashboard({ config, onReconfigure }) {
  const [transactions, setTransactions] = useState([]);
  const [isAddExpenseVisible, setIsAddExpenseVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadTransactions();
  }, [config.cycleStartDay]);

  const loadTransactions = async () => {
    const txns = await getTransactionsForCurrentCycle(config.cycleStartDay);
    setTransactions(txns);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadTransactions();
    setRefreshing(false);
  };

  const handleAddExpense = async (expense) => {
    const success = await saveTransaction(expense);
    if (success) {
      await loadTransactions();
    }
  };

  // Calculate values
  const totalSpent = transactions.reduce((sum, t) => sum + t.amount, 0);
  const resteAVivre = config.monthlyIncome - config.fixedCharges - config.savingsGoal;
  const dailyBudget = calculateDailyBudget(
    config.monthlyIncome,
    config.fixedCharges,
    config.savingsGoal,
    totalSpent,
    config.cycleStartDay
  );
  const daysRemaining = getDaysRemainingInCycle(config.cycleStartDay);
  const budgetStatus = calculateBudgetStatus(
    config.monthlyIncome,
    config.fixedCharges,
    config.savingsGoal,
    totalSpent,
    config.cycleStartDay
  );
  const spentPercentage = calculateSpentPercentage(
    config.monthlyIncome,
    config.fixedCharges,
    config.savingsGoal,
    totalSpent
  );

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);
  };

  const isDailyBudgetNegative = dailyBudget < 0;

  return (
    <View style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Mon Budget PACE</Text>
          <Text style={styles.headerSubtitle}>
            Cycle du {config.cycleStartDay} de chaque mois
          </Text>
        </View>

        {/* Feature 2.1.1 & 2.1.2: Budget du Jour - Very Prominent Display */}
        <View
          style={[
            styles.dailyBudgetCard,
            isDailyBudgetNegative && styles.dailyBudgetCardNegative,
          ]}
        >
          <Text style={styles.dailyBudgetLabel}>Budget du Jour</Text>
          <Text
            style={[
              styles.dailyBudgetAmount,
              isDailyBudgetNegative && styles.dailyBudgetAmountNegative,
            ]}
          >
            {formatCurrency(dailyBudget)}
          </Text>
          {isDailyBudgetNegative && (
            <Text style={styles.dailyBudgetWarning}>
              ⚠️ Vous devez réduire vos dépenses
            </Text>
          )}
          <Text style={styles.dailyBudgetHint}>
            Ce que vous pouvez dépenser aujourd'hui
          </Text>
        </View>

        {/* Feature 2.2: Monthly Health Indicator */}
        <View style={styles.monthlyHealthCard}>
          <Text style={styles.cardTitle}>Santé du Mois</Text>

          {/* Feature 2.2.1: Days Remaining */}
          <View style={styles.daysRemainingContainer}>
            <Text style={styles.daysRemainingNumber}>{daysRemaining}</Text>
            <Text style={styles.daysRemainingLabel}>
              jour{daysRemaining > 1 ? 's' : ''} restant{daysRemaining > 1 ? 's' : ''}
            </Text>
          </View>

          {/* Feature 2.2.2: Ring Chart */}
          <View style={styles.ringChartContainer}>
            <BudgetRing
              percentage={spentPercentage}
              size={160}
              strokeWidth={16}
              color={budgetStatus.color}
              backgroundColor="#E0E0E0"
            />
            <View style={styles.ringChartCenter}>
              <Text style={styles.ringChartPercentage}>
                {Math.round(spentPercentage)}%
              </Text>
              <Text style={styles.ringChartLabel}>dépensé</Text>
            </View>
          </View>

          <View style={styles.budgetSummary}>
            <View style={styles.budgetSummaryItem}>
              <Text style={styles.budgetSummaryLabel}>Dépensé</Text>
              <Text style={[styles.budgetSummaryAmount, { color: '#FF3B30' }]}>
                {formatCurrency(totalSpent)}
              </Text>
            </View>
            <View style={styles.budgetSummaryItem}>
              <Text style={styles.budgetSummaryLabel}>Restant</Text>
              <Text style={[styles.budgetSummaryAmount, { color: '#4CAF50' }]}>
                {formatCurrency(Math.max(0, resteAVivre - totalSpent))}
              </Text>
            </View>
          </View>

          {/* Feature 2.2.3: Status Indicator */}
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: budgetStatus.color },
            ]}
          >
            <Text style={styles.statusBadgeText}>{budgetStatus.label}</Text>
          </View>
        </View>

        {/* Recent Transactions */}
        <View style={styles.transactionsCard}>
          <Text style={styles.cardTitle}>Dépenses récentes</Text>
          {transactions.length === 0 ? (
            <Text style={styles.noTransactions}>
              Aucune dépense enregistrée ce mois-ci
            </Text>
          ) : (
            transactions.slice(-5).reverse().map((transaction) => (
              <View key={transaction.id} style={styles.transactionItem}>
                <View style={styles.transactionLeft}>
                  <Text style={styles.transactionDescription}>
                    {transaction.description}
                  </Text>
                  <Text style={styles.transactionDate}>
                    {new Date(transaction.date).toLocaleDateString('fr-FR')}
                  </Text>
                </View>
                <Text style={styles.transactionAmount}>
                  -{formatCurrency(transaction.amount)}
                </Text>
              </View>
            ))
          )}
        </View>

        {/* Settings Button */}
        <TouchableOpacity style={styles.configButton} onPress={onReconfigure}>
          <Text style={styles.configButtonText}>⚙️ Modifier la configuration</Text>
        </TouchableOpacity>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Floating Add Button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setIsAddExpenseVisible(true)}
      >
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>

      {/* Add Expense Modal */}
      <AddExpenseModal
        visible={isAddExpenseVisible}
        onClose={() => setIsAddExpenseVisible(false)}
        onAddExpense={handleAddExpense}
      />
    </View>
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
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
  },
  // Feature 2.1: Daily Budget Card
  dailyBudgetCard: {
    backgroundColor: '#fff',
    margin: 16,
    marginBottom: 8,
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 3,
    borderColor: '#4CAF50',
  },
  dailyBudgetCardNegative: {
    borderColor: '#FF3B30',
    backgroundColor: '#FFF5F5',
  },
  dailyBudgetLabel: {
    fontSize: 20,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  dailyBudgetAmount: {
    fontSize: 56,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 8,
  },
  dailyBudgetAmountNegative: {
    color: '#FF3B30',
  },
  dailyBudgetWarning: {
    fontSize: 16,
    color: '#FF3B30',
    fontWeight: '600',
    marginBottom: 8,
  },
  dailyBudgetHint: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
  },
  // Feature 2.2: Monthly Health Card
  monthlyHealthCard: {
    backgroundColor: '#fff',
    margin: 16,
    marginTop: 8,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  daysRemainingContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    marginBottom: 20,
  },
  daysRemainingNumber: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#007AFF',
    marginRight: 8,
  },
  daysRemainingLabel: {
    fontSize: 18,
    color: '#666',
  },
  ringChartContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
    position: 'relative',
  },
  ringChartCenter: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringChartPercentage: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
  },
  ringChartLabel: {
    fontSize: 14,
    color: '#666',
  },
  budgetSummary: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E0E0E0',
  },
  budgetSummaryItem: {
    alignItems: 'center',
  },
  budgetSummaryLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  budgetSummaryAmount: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  statusBadge: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
    alignItems: 'center',
    marginTop: 8,
  },
  statusBadgeText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  // Transactions
  transactionsCard: {
    backgroundColor: '#fff',
    margin: 16,
    marginTop: 8,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  noTransactions: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    paddingVertical: 20,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  transactionLeft: {
    flex: 1,
  },
  transactionDescription: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
    marginBottom: 2,
  },
  transactionDate: {
    fontSize: 12,
    color: '#999',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF3B30',
  },
  // Buttons
  addButton: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  addButtonText: {
    fontSize: 36,
    color: '#fff',
    fontWeight: '300',
  },
  configButton: {
    backgroundColor: '#fff',
    margin: 16,
    marginTop: 8,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  configButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '500',
  },
});
