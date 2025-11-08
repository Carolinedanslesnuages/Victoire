/**
 * E2E Test: Onboarding Scenario
 * 
 * This test simulates a user completing the initial configuration wizard
 * and verifies that the dashboard is displayed correctly.
 */

describe('Onboarding Flow', () => {
  beforeAll(async () => {
    await device.launchApp({
      newInstance: true,
      permissions: { notifications: 'YES' }
    });
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should complete initial configuration and display dashboard', async () => {
    // SCENARIO: New user opens the app for the first time
    // Expected: Configuration wizard is displayed

    // Step 1: Verify configuration wizard is displayed
    await expect(element(by.text(/Configuration Initiale|Initial Setup/i))).toBeVisible();

    // Step 2: Enter monthly income
    await element(by.id('monthlyIncome') || by.label(/Revenus mensuels|Monthly Income/i)).tap();
    await element(by.id('monthlyIncome') || by.label(/Revenus mensuels|Monthly Income/i)).typeText('3000');
    
    // Step 3: Enter fixed charges
    await element(by.id('fixedCharges') || by.label(/Charges fixes|Fixed Charges/i)).tap();
    await element(by.id('fixedCharges') || by.label(/Charges fixes|Fixed Charges/i)).typeText('1500');
    
    // Step 4: Enter savings goal
    await element(by.id('savingsGoal') || by.label(/Objectif d'épargne|Savings Goal/i)).tap();
    await element(by.id('savingsGoal') || by.label(/Objectif d'épargne|Savings Goal/i)).typeText('500');
    
    // Step 5: Enter cycle start day
    await element(by.id('cycleStartDay') || by.label(/Jour de début de cycle|Cycle Start Day/i)).tap();
    await element(by.id('cycleStartDay') || by.label(/Jour de début de cycle|Cycle Start Day/i)).typeText('1');
    
    // Step 6: Submit the configuration
    await element(by.text(/Valider|Validate|Submit/i)).tap();
    
    // Step 7: Verify dashboard is displayed
    await expect(element(by.text(/Budget du Jour|Daily Budget/i))).toBeVisible();
    
    // Step 8: Verify daily budget is calculated and displayed
    // Should show the calculated daily budget based on inputs
    // Reste à Vivre = 3000 - 1500 - 500 = 1000
    // Daily budget will vary based on days remaining in cycle
    await expect(element(by.text(/€|EUR/i))).toBeVisible();
    
    // Step 9: Verify days remaining is displayed
    await expect(element(by.text(/jour|day/i))).toBeVisible();
    
    // Step 10: Verify no transactions message is displayed
    await expect(element(by.text(/Aucune transaction|No transactions/i))).toBeVisible();
  });

  it('should validate input fields during onboarding', async () => {
    // SCENARIO: User tries to submit invalid data
    
    // Try to submit empty form
    await element(by.text(/Valider|Validate|Submit/i)).tap();
    
    // Should show error message
    await expect(element(by.text(/Erreur|Error/i))).toBeVisible();
    
    // Tap OK to dismiss alert
    await element(by.text(/OK/i)).tap();
    
    // Enter invalid income (negative or zero)
    await element(by.id('monthlyIncome') || by.label(/Revenus mensuels|Monthly Income/i)).tap();
    await element(by.id('monthlyIncome') || by.label(/Revenus mensuels|Monthly Income/i)).typeText('0');
    await element(by.id('fixedCharges') || by.label(/Charges fixes|Fixed Charges/i)).tap();
    await element(by.id('fixedCharges') || by.label(/Charges fixes|Fixed Charges/i)).typeText('100');
    await element(by.id('savingsGoal') || by.label(/Objectif d'épargne|Savings Goal/i)).tap();
    await element(by.id('savingsGoal') || by.label(/Objectif d'épargne|Savings Goal/i)).typeText('50');
    await element(by.id('cycleStartDay') || by.label(/Jour de début de cycle|Cycle Start Day/i)).tap();
    await element(by.id('cycleStartDay') || by.label(/Jour de début de cycle|Cycle Start Day/i)).typeText('1');
    
    await element(by.text(/Valider|Validate|Submit/i)).tap();
    
    // Should show error message for invalid income
    await expect(element(by.text(/Erreur|Error|invalide|invalid/i))).toBeVisible();
  });

  it('should handle edge case: cycle start day validation', async () => {
    // Enter valid data except for cycle start day
    await element(by.id('monthlyIncome') || by.label(/Revenus mensuels|Monthly Income/i)).tap();
    await element(by.id('monthlyIncome') || by.label(/Revenus mensuels|Monthly Income/i)).typeText('2000');
    await element(by.id('fixedCharges') || by.label(/Charges fixes|Fixed Charges/i)).tap();
    await element(by.id('fixedCharges') || by.label(/Charges fixes|Fixed Charges/i)).typeText('500');
    await element(by.id('savingsGoal') || by.label(/Objectif d'épargne|Savings Goal/i)).tap();
    await element(by.id('savingsGoal') || by.label(/Objectif d'épargne|Savings Goal/i)).typeText('200');
    
    // Enter invalid cycle start day (e.g., 32)
    await element(by.id('cycleStartDay') || by.label(/Jour de début de cycle|Cycle Start Day/i)).tap();
    await element(by.id('cycleStartDay') || by.label(/Jour de début de cycle|Cycle Start Day/i)).typeText('32');
    
    await element(by.text(/Valider|Validate|Submit/i)).tap();
    
    // Should show error for invalid day
    await expect(element(by.text(/Erreur|Error/i))).toBeVisible();
  });
});
