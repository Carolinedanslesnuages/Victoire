# Victoire

Victoire répond à une seule question : **combien puis-je dépenser aujourd’hui ?**

## Pourquoi

Mettre de l’argent de côté ne marche pas quand on se dit « je verrai ce qu’il reste en fin de mois ».
Victoire inverse l’ordre : l’épargne part en premier, et l’application ne suit que l’argent
qui est vraiment à vous pour le mois.

## Le principe

Le jour de la paie, l’argent est réparti en quatre parts :

1. l’épargne, virée automatiquement ;
2. la part versée sur le compte joint ;
3. les frais fixes personnels (transport, abonnements, factures) ;
4. **le reste**, qui est le seul montant suivi par l’application.

Exemple avec 3 000 € nets : 500 € d’épargne, 1 500 € sur le compte joint et 400 € de frais fixes
laissent 600 € pour le cycle, soit environ 20 € par jour.

## Le calcul

Le budget du jour est ce qu’il reste sur le cycle divisé par le nombre de jours avant la prochaine
paie, aujourd’hui compris. Ce qui n’est pas dépensé un jour est réparti sur les jours suivants ;
un jour trop dépensé réduit les suivants. Les détails sont dans [docs/calcul.md](docs/calcul.md).

À la fin du cycle, ce qu’il reste vous est proposé comme virement supplémentaire vers l’épargne.

## Les écrans

- **Aujourd’hui** : le reste du jour, une jauge, et la saisie d’une dépense.
- **Historique** : les dépenses du cycle, jour par jour.
- **Réglages** : les montants, le jour de paie, l’export et l’import des données.

