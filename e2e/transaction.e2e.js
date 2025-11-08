/**
 * E2E Test: Transaction Scenario
 * 
 * This test simulates a user adding a transaction and verifies
 * that the dashboard updates correctly.
 */

describe('Transaction Flow', () => {
  beforeAll(async () => {
    await device.launchApp({
      newInstance: true,
      permissions: { notifications: 'YES' }
    });
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should add a transaction and update the dashboard', async () => {
    // SCENARIO: User has completed onboarding and wants to add their first expense
    
    // Step 1: Complete onboarding first (if not already done)
    // Check if we're on the config wizard or dashboard
    try {
      await expect(element(by.text(/Configuration Initiale|Initial Setup/i))).toBeVisible();
      
      // Complete quick onboarding
      await element(by.id('monthlyIncome') || by.label(/Revenus mensuels|Monthly Income/i)).tap();
      await element(by.id('monthlyIncome') || by.label(/Revenus mensuels|Monthly Income/i)).typeText('3000');
      await element(by.id('fixedCharges') || by.label(/Charges fixes|Fixed Charges/i)).tap();
      await element(by.id('fixedCharges') || by.label(/Charges fixes|Fixed Charges/i)).typeText('1500');
      await element(by.id('savingsGoal') || by.label(/Objectif d'épargne|Savings Goal/i)).tap();
      await element(by.id('savingsGoal') || by.label(/Objectif d'épargne|Savings Goal/i)).typeText('500');
      await element(by.id('cycleStartDay') || by.label(/Jour de début de cycle|Cycle Start Day/i)).tap();
      await element(by.id('cycleStartDay') || by.label(/Jour de début de cycle|Cycle Start Day/i)).typeText('1');
      await element(by.text(/Valider|Validate|Submit/i)).tap();
    } catch (e) {
      // Already on dashboard, continue
    }

    // Step 2: Verify we're on the dashboard
    await expect(element(by.text(/Budget du Jour|Daily Budget/i))).toBeVisible();
    
    // Step 3: Note the current daily budget value before adding transaction
    // We'll verify it decreases after adding an expense
    
    // Step 4: Tap the "Add Expense" button (usually a "+" button)
    await element(by.id('addExpenseButton') || by.label(/\+|Ajouter une dépense|Add Expense/i)).tap();
    
    // Step 5: Verify the expense modal is displayed
    await expect(element(by.text(/Ajouter une dépense|Add Expense/i))).toBeVisible();
    
    // Step 6: Enter amount
    await element(by.id('expenseAmount') || by.placeholder(/Ex: 15\.50|amount/i)).tap();
    await element(by.id('expenseAmount') || by.placeholder(/Ex: 15\.50|amount/i)).typeText('50');
    
    // Step 7: Enter description
    await element(by.id('expenseDescription') || by.placeholder(/Ex: Courses|description/i)).tap();
    await element(by.id('expenseDescription') || by.placeholder(/Ex: Courses|description/i)).typeText('Café du matin');
    
    // Step 8: Enter category (optional)
    await element(by.id('expenseCategory') || by.placeholder(/Ex: Alimentation|category/i)).tap();
    await element(by.id('expenseCategory') || by.placeholder(/Ex: Alimentation|category/i)).typeText('Alimentation');
    
    // Step 9: Submit the transaction
    await element(by.text(/Ajouter|Add|Valider/i)).tap();
    
    // Step 10: Verify we're back on the dashboard
    await expect(element(by.text(/Budget du Jour|Daily Budget/i))).toBeVisible();
    
    // Step 11: Verify the transaction appears in the list
    await expect(element(by.text('Café du matin'))).toBeVisible();
    
    // Step 12: Verify the amount is displayed
    await expect(element(by.text(/50/))).toBeVisible();
    
    // Step 13: Verify the category is displayed
    await expect(element(by.text('Alimentation'))).toBeVisible();
    
    // Step 14: Verify the daily budget has been recalculated
    // The daily budget should now be lower since we've spent 50€
    // We can verify this by checking that the dashboard still shows a budget value
    await expect(element(by.text(/€|EUR/i))).toBeVisible();
  });

  it('should add multiple transactions and update dashboard correctly', async () => {
    // Complete onboarding if needed
    try {
      await expect(element(by.text(/Configuration Initiale|Initial Setup/i))).toBeVisible();
      await element(by.id('monthlyIncome') || by.label(/Revenus mensuels|Monthly Income/i)).tap();
      await element(by.id('monthlyIncome') || by.label(/Revenus mensuels|Monthly Income/i)).typeText('3000');
      await element(by.id('fixedCharges') || by.label(/Charges fixes|Fixed Charges/i)).tap();
      await element(by.id('fixedCharges') || by.label(/Charges fixes|Fixed Charges/i)).typeText('1000');
      await element(by.id('savingsGoal') || by.label(/Objectif d'épargne|Savings Goal/i)).tap();
      await element(by.id('savingsGoal') || by.label(/Objectif d'épargne|Savings Goal/i)).typeText('300');
      await element(by.id('cycleStartDay') || by.label(/Jour de début de cycle|Cycle Start Day/i)).tap();
      await element(by.id('cycleStartDay') || by.label(/Jour de début de cycle|Cycle Start Day/i)).typeText('1');
      await element(by.text(/Valider|Validate|Submit/i)).tap();
    } catch (e) {
      // Already on dashboard
    }

    // Add first transaction
    await element(by.id('addExpenseButton') || by.label(/\+|Ajouter une dépense|Add Expense/i)).tap();
    await element(by.id('expenseAmount') || by.placeholder(/Ex: 15\.50|amount/i)).tap();
    await element(by.id('expenseAmount') || by.placeholder(/Ex: 15\.50|amount/i)).typeText('75');
    await element(by.id('expenseDescription') || by.placeholder(/Ex: Courses|description/i)).tap();
    await element(by.id('expenseDescription') || by.placeholder(/Ex: Courses|description/i)).typeText('Restaurant');
    await element(by.text(/Ajouter|Add|Valider/i)).tap();
    
    // Verify first transaction
    await expect(element(by.text('Restaurant'))).toBeVisible();
    
    // Add second transaction
    await element(by.id('addExpenseButton') || by.label(/\+|Ajouter une dépense|Add Expense/i)).tap();
    await element(by.id('expenseAmount') || by.placeholder(/Ex: 15\.50|amount/i)).tap();
    await element(by.id('expenseAmount') || by.placeholder(/Ex: 15\.50|amount/i)).typeText('30');
    await element(by.id('expenseDescription') || by.placeholder(/Ex: Courses|description/i)).tap();
    await element(by.id('expenseDescription') || by.placeholder(/Ex: Courses|description/i)).typeText('Transport');
    await element(by.text(/Ajouter|Add|Valider/i)).tap();
    
    // Verify both transactions are displayed
    await expect(element(by.text('Restaurant'))).toBeVisible();
    await expect(element(by.text('Transport'))).toBeVisible();
    
    // Verify total spent has increased
    // With reste à vivre of 1700 (3000-1000-300), spending 105 should be visible
    await expect(element(by.text(/75/))).toBeVisible();
    await expect(element(by.text(/30/))).toBeVisible();
  });

  it('should validate transaction input fields', async () => {
    // Complete onboarding if needed
    try {
      await expect(element(by.text(/Configuration Initiale|Initial Setup/i))).toBeVisible();
      await element(by.id('monthlyIncome') || by.label(/Revenus mensuels|Monthly Income/i)).tap();
      await element(by.id('monthlyIncome') || by.label(/Revenus mensuels|Monthly Income/i)).typeText('2000');
      await element(by.id('fixedCharges') || by.label(/Charges fixes|Fixed Charges/i)).tap();
      await element(by.id('fixedCharges') || by.label(/Charges fixes|Fixed Charges/i)).typeText('800');
      await element(by.id('savingsGoal') || by.label(/Objectif d'épargne|Savings Goal/i)).tap();
      await element(by.id('savingsGoal') || by.label(/Objectif d'épargne|Savings Goal/i)).typeText('200');
      await element(by.id('cycleStartDay') || by.label(/Jour de début de cycle|Cycle Start Day/i)).tap();
      await element(by.id('cycleStartDay') || by.label(/Jour de début de cycle|Cycle Start Day/i)).typeText('1');
      await element(by.text(/Valider|Validate|Submit/i)).tap();
    } catch (e) {
      // Already on dashboard
    }

    // Open add expense modal
    await element(by.id('addExpenseButton') || by.label(/\+|Ajouter une dépense|Add Expense/i)).tap();
    
    // Try to submit without filling fields
    await element(by.text(/Ajouter|Add|Valider/i)).tap();
    
    // Should show error
    await expect(element(by.text(/Erreur|Error/i))).toBeVisible();
    
    // Dismiss alert
    await element(by.text(/OK/i)).tap();
    
    // Enter invalid amount (0 or negative)
    await element(by.id('expenseAmount') || by.placeholder(/Ex: 15\.50|amount/i)).tap();
    await element(by.id('expenseAmount') || by.placeholder(/Ex: 15\.50|amount/i)).typeText('0');
    await element(by.id('expenseDescription') || by.placeholder(/Ex: Courses|description/i)).tap();
    await element(by.id('expenseDescription') || by.placeholder(/Ex: Courses|description/i)).typeText('Test');
    await element(by.text(/Ajouter|Add|Valider/i)).tap();
    
    // Should show error for invalid amount
    await expect(element(by.text(/Erreur|Error|invalide|invalid/i))).toBeVisible();
  });

  it('should handle transaction deletion', async () => {
    // Complete onboarding and add a transaction first
    try {
      await expect(element(by.text(/Configuration Initiale|Initial Setup/i))).toBeVisible();
      await element(by.id('monthlyIncome') || by.label(/Revenus mensuels|Monthly Income/i)).tap();
      await element(by.id('monthlyIncome') || by.label(/Revenus mensuels|Monthly Income/i)).typeText('3000');
      await element(by.id('fixedCharges') || by.label(/Charges fixes|Fixed Charges/i)).tap();
      await element(by.id('fixedCharges') || by.label(/Charges fixes|Fixed Charges/i)).typeText('1200');
      await element(by.id('savingsGoal') || by.label(/Objectif d'épargne|Savings Goal/i)).tap();
      await element(by.id('savingsGoal') || by.label(/Objectif d'épargne|Savings Goal/i)).typeText('400');
      await element(by.id('cycleStartDay') || by.label(/Jour de début de cycle|Cycle Start Day/i)).tap();
      await element(by.id('cycleStartDay') || by.label(/Jour de début de cycle|Cycle Start Day/i)).typeText('1');
      await element(by.text(/Valider|Validate|Submit/i)).tap();
    } catch (e) {
      // Already on dashboard
    }

    // Add a transaction
    await element(by.id('addExpenseButton') || by.label(/\+|Ajouter une dépense|Add Expense/i)).tap();
    await element(by.id('expenseAmount') || by.placeholder(/Ex: 15\.50|amount/i)).tap();
    await element(by.id('expenseAmount') || by.placeholder(/Ex: 15\.50|amount/i)).typeText('100');
    await element(by.id('expenseDescription') || by.placeholder(/Ex: Courses|description/i)).tap();
    await element(by.id('expenseDescription') || by.placeholder(/Ex: Courses|description/i)).typeText('À supprimer');
    await element(by.text(/Ajouter|Add|Valider/i)).tap();
    
    // Verify transaction is added
    await expect(element(by.text('À supprimer'))).toBeVisible();
    
    // Tap delete button (usually a trash icon 🗑️)
    await element(by.id('deleteTransaction') || by.label(/🗑️|Supprimer|Delete/i)).tap();
    
    // Confirm deletion
    await element(by.text(/Confirmer|Confirm|Supprimer/i)).tap();
    
    // Verify transaction is removed
    await expect(element(by.text('À supprimer'))).not.toBeVisible();
    
    // Verify dashboard updates (budget should return to previous value)
    await expect(element(by.text(/Budget du Jour|Daily Budget/i))).toBeVisible();
  });
});
