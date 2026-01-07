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

