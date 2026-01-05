export const messages = {
  appName: 'Victoire',
  tabs: {
    today: 'Aujourd’hui',
    history: 'Historique',
    settings: 'Réglages',
  },

  today: {
    remainingLabel: 'Reste pour aujourd’hui',
    budgetLabel: 'Budget du jour',
    spentLabel: 'Déjà dépensé',
    cycleLabel: 'Reste sur le cycle',
    daysLeft: (count: number): string =>
      count === 1 ? 'Dernier jour avant la paie' : `${count} jours avant la paie`,
    comfortable: 'Vous êtes dans le rythme.',
    close: 'Presque tout est utilisé pour aujourd’hui.',
    over: 'Budget du jour dépassé : demain sera un peu plus serré.',
    exhausted: 'Le budget du cycle est épuisé.',
  },

  addExpense: {
    title: 'Noter une dépense',
    amountLabel: 'Montant',
    amountPlaceholder: '12,50',
    labelLabel: 'Libellé (facultatif)',
    labelPlaceholder: 'Déjeuner, livre…',
    submit: 'Ajouter',
    invalidAmount: 'Ce montant n’est pas valide (exemple : 12,50).',
    zeroAmount: 'Le montant doit être supérieur à zéro.',
  },

  history: {
    title: 'Dépenses du cycle',
    empty: 'Aucune dépense pour l’instant.',
    noLabel: 'Sans libellé',
    remove: 'Supprimer',
    removeAria: (label: string, amount: string): string => `Supprimer ${label} (${amount})`,
    dayTotal: (amount: string): string => `Total : ${amount}`,
  },

  settings: {
    title: 'Mes réglages',
    intro: 'Quatre montants suffisent. Victoire calcule ce que vous pouvez dépenser par jour.',
    netIncome: 'Revenu net du mois',
    netIncomeHint: 'Ce que vous recevez chaque mois.',
    savings: 'À mettre de côté',
    savingsHint: 'Épargné le jour de la paie, avant tout le reste.',
    jointAccount: 'Versé sur le compte joint',
    jointAccountHint: 'Votre part des dépenses communes.',
    fixedCosts: 'Frais fixes personnels',
    fixedCostsHint: 'Transport, abonnements, factures qui vous sont propres.',
    payday: 'Jour de paie',
    paydayHint: 'Le cycle va de paie en paie.',
    start: 'Commencer',
    save: 'Enregistrer',
    invalidAmount: 'Un montant n’est pas valide (exemple : 1 500 ou 12,50).',

