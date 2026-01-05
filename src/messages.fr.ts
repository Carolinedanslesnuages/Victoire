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

