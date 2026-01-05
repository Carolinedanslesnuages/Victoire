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

    problems: {
      incomeMissing: 'Indiquez votre revenu net du mois.',
      negativeAmount: 'Les montants ne peuvent pas être négatifs.',
      paydayOutOfRange: 'Le jour de paie doit être compris entre 1 et 31.',
      potNotPositive: 'Il ne reste rien à dépenser : réduisez l’épargne ou les frais.',
    },

    preview: (pot: string, daily: string): string =>
      `Il vous reste ${pot} par cycle, soit environ ${daily} par jour.`,
    reminder:
      'Programmez un virement automatique vers votre épargne le jour de la paie : l’argent part avant que vous puissiez le dépenser.',
  },

  closing: {
    title: 'Un cycle vient de se terminer',
    summary: (start: string, end: string, leftover: string): string =>
      `Du ${start} au ${end}, il vous restait ${leftover}. Voulez-vous les virer sur votre épargne ?`,
    saved: 'C’est viré',
    ignored: 'Pas cette fois',
  },

  backup: {
    title: 'Mes données',
    intro: 'Elles restent sur cet appareil. Exportez-les de temps en temps pour les conserver.',
    export: 'Exporter',
    import: 'Importer',
    exportedName: 'victoire-sauvegarde.json',
    imported: 'Données importées.',
    notJson: 'Ce fichier n’est pas une sauvegarde lisible.',
    wrongVersion: 'Cette sauvegarde vient d’une autre version.',
    invalidContent: 'Le contenu de ce fichier est incomplet.',
  },
} as const
