# Le calcul du budget du jour

Ce document décrit les règles appliquées par `src/domain`.

## Le reste du cycle

```
reste du cycle = revenu net − épargne − compte joint − frais fixes personnels
```

Avec 3 000 − 500 − 1 500 − 400, le reste du cycle est de 600 €.

## Le cycle

Un cycle commence le jour de paie et se termine la veille de la paie suivante. Si le jour de paie
n’existe pas dans un mois (par exemple le 31 en février), c’est le dernier jour du mois qui compte.

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

