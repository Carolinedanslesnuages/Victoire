# Le calcul du budget du jour

Ce document décrit les règles appliquées par `src/domain`.

## Le reste du cycle

```
reste du cycle = revenu net − épargne − compte joint − frais fixes personnels
```

Avec 3 000 − 500 − 1 500 − 400, le reste du cycle est de 600 €.

## Le cycle

Un cycle commence le jour de paie et se termine la veille de la paie suivante.

Le jour de paie habituel (par exemple le 25) n’est qu’une estimation :

- si ce jour n’existe pas dans le mois (le 31 en février), c’est le dernier jour du mois ;
- s’il tombe un samedi, un dimanche ou un jour férié français, la paie est estimée au jour ouvré
  suivant (le 25 décembre 2026 donne ainsi le lundi 28) ;
- quand la paie arrive, vous indiquez le jour réel dans l’application : le cycle commence ce jour-là,
  qu’il soit plus tôt ou plus tard que l’estimation.

## Le budget du jour

```
budget du jour = (reste du cycle − dépenses avant aujourd’hui) ÷ jours restants
```

Les jours restants comptent aujourd’hui. Le résultat est arrondi à l’inférieur, au centime.

## Ce qu’il reste pour aujourd’hui

```
reste du jour = budget du jour − dépenses d’aujourd’hui
```

Dépenser moins que prévu fait monter le budget des jours suivants. Dépenser plus le fait baisser :
il n’y a ni pénalité ni joker, seulement un report.

## Les niveaux de la jauge

- **Dans le rythme** : il reste plus d’un cinquième du budget du jour.
- **Presque épuisé** : il reste un cinquième du budget du jour, ou moins.
- **Dépassé** : le budget du jour est dépassé, ou le reste du cycle est épuisé.

## La fin du cycle

Quand un nouveau cycle commence, ce qu’il restait du précédent est proposé comme virement
supplémentaire vers l’épargne. Rien n’est proposé si aucune dépense n’avait été notée, ou si tout
a été dépensé. La décision (viré ou non) est enregistrée pour ne pas être demandée deux fois.

## Limites connues

- Le reste du cycle d’un cycle terminé est recalculé avec les réglages actuels : si vous les
  modifiez, la proposition de fin de cycle se base sur les nouveaux montants.
- Une dépense est toujours datée du jour où elle est saisie.
