# Guide de Contribution - PACE

Merci de contribuer au projet PACE ! Ce document décrit les conventions et processus à suivre pour contribuer au projet.

## 📝 Conventional Commits

Ce projet utilise les **Conventional Commits** pour standardiser les messages de commit. Cela permet :
- La génération automatique du changelog
- La gestion automatique des versions (semver)
- Une meilleure compréhension de l'historique du projet

### Format du Message de Commit

Chaque message de commit doit suivre ce format :

```
<type>(<scope>): <description courte>

[corps optionnel]

[footer optionnel]
```

### Types de Commits

Les types suivants sont autorisés :

- **feat**: Ajout d'une nouvelle fonctionnalité (incrémente la version MINOR)
  ```
  feat: ajouter l'authentification utilisateur
  feat(auth): implémenter la connexion avec Google
  ```

- **fix**: Correction d'un bug (incrémente la version PATCH)
  ```
  fix: corriger le crash au démarrage
  fix(ui): résoudre l'alignement du header
  ```

- **docs**: Modifications de la documentation uniquement
  ```
  docs: mettre à jour le README avec les instructions d'installation
  docs(api): ajouter des exemples pour l'API REST
  ```

- **style**: Changements de formatage (espaces, indentation, etc.) sans impact fonctionnel
  ```
  style: formater le code selon les standards ESLint
  ```

- **refactor**: Refactorisation du code sans ajout de fonctionnalité ni correction de bug
  ```
  refactor: simplifier la logique de validation
  refactor(components): extraire la logique commune dans un hook
  ```

- **perf**: Améliorations de performance
  ```
  perf: optimiser le rendu des listes longues
  ```

- **test**: Ajout ou modification de tests
  ```
  test: ajouter des tests pour le module d'authentification
  ```

- **chore**: Tâches de maintenance (mise à jour de dépendances, configuration, etc.)
  ```
  chore: mettre à jour les dépendances
  chore(deps): upgrade expo à la version 54
  ```

- **ci**: Modifications des fichiers de CI/CD
  ```
  ci: ajouter le workflow de release automatique
  ```

- **build**: Changements affectant le système de build
  ```
  build: configurer webpack pour la production
  ```

- **revert**: Annulation d'un commit précédent
  ```
  revert: annuler "feat: ajouter l'authentification"
  ```

### Breaking Changes

Pour indiquer un **breaking change** (changement cassant qui incrémente la version MAJOR), ajoutez `!` après le type ou ajoutez `BREAKING CHANGE:` dans le footer :

```
feat!: modifier l'API d'authentification

BREAKING CHANGE: le format des tokens a changé, nécessite une mise à jour côté client
```

ou

```
feat(auth)!: changer le format des tokens JWT
```

### Scope (Portée)

Le scope est optionnel mais recommandé. Il indique quelle partie du code est affectée :

```
feat(auth): ajouter la connexion avec email
fix(ui): corriger le bouton de navigation
docs(readme): ajouter les badges de statut
```

Exemples de scopes pour PACE :
- `auth` : Authentification
- `ui` : Interface utilisateur
- `api` : Appels API
- `navigation` : Navigation
- `components` : Composants React
- `utils` : Utilitaires
- `assets` : Assets (images, icônes)

### Exemples Complets

```
feat: ajouter le système de notifications push

Implémentation des notifications push utilisant Expo Notifications.
- Configuration des permissions
- Gestion des tokens
- Affichage des notifications
```

```
fix(navigation): corriger le bug de navigation arrière

Le bouton retour ne fonctionnait pas sur iOS 17.
Correction en utilisant la nouvelle API de navigation.

Closes #123
```

```
chore(deps): mettre à jour React Native vers 0.81.5

- Mise à jour de React Native
- Mise à jour des dépendances associées
- Résolution des conflits de types TypeScript
```

## 🔍 Validation Automatique

Le projet utilise **commitlint** et **husky** pour valider automatiquement les messages de commit.

### Installation

Après avoir cloné le projet et exécuté `npm install`, husky sera automatiquement configuré grâce au script `prepare` dans `package.json`.

### Configuration du Template de Commit (Optionnel)

Pour faciliter l'écriture de vos messages de commit, vous pouvez configurer Git pour utiliser le template fourni :

```bash
git config commit.template .gitmessage
```

Maintenant, quand vous faites `git commit`, le template s'affichera automatiquement dans votre éditeur.

### Test Local

Pour tester si votre message de commit est valide avant de commiter :

```bash
echo "feat: mon message" | npx commitlint
```

### Si Votre Commit est Rejeté

Si votre message de commit ne suit pas le format Conventional Commits, vous verrez une erreur :

```
⧗   input: mauvais message de commit
✖   subject may not be empty [subject-empty]
✖   type may not be empty [type-empty]
```

Corrigez votre message et recommitez :

```bash
git commit --amend -m "feat: message corrigé selon les conventions"
```

## 🚀 Processus de Release

Le projet utilise **Release Please** pour automatiser les releases.

### Comment ça Marche ?

1. Vous faites des commits en suivant les Conventional Commits sur votre branche
2. Vous créez une Pull Request vers `main`
3. Une fois la PR mergée sur `main`, Release Please :
   - Analyse les commits depuis la dernière release
   - Détermine automatiquement la nouvelle version (selon semver)
   - Crée une "Release PR" qui contient :
     - Mise à jour du `CHANGELOG.md`
     - Mise à jour de la version dans `package.json`
     - Mise à jour de la version dans `app.json`
4. Quand la "Release PR" est mergée :
   - Un tag Git est créé
   - Une release GitHub est publiée
   - Le changelog est mis à jour

### Versioning (Semver)

Le projet suit le [Semantic Versioning](https://semver.org/) :

- **MAJOR** (X.0.0) : Breaking changes (commit avec `!` ou `BREAKING CHANGE:`)
- **MINOR** (0.X.0) : Nouvelles fonctionnalités (commits `feat:`)
- **PATCH** (0.0.X) : Corrections de bugs (commits `fix:`)

Les autres types (`docs`, `style`, `refactor`, `perf`, `test`, `chore`, `ci`, `build`) n'incrémentent pas la version mais apparaissent dans le changelog.

## 📚 Ressources

- [Conventional Commits](https://www.conventionalcommits.org/)
- [Semantic Versioning](https://semver.org/)
- [Release Please](https://github.com/googleapis/release-please)
- [Commitlint](https://commitlint.js.org/)

## 🤝 Workflow de Contribution

1. Créez une branche depuis `main` : `git checkout -b feature/ma-fonctionnalite`
2. Faites vos modifications
3. Commitez avec des messages Conventional Commits : `git commit -m "feat: ajouter ma fonctionnalité"`
4. Poussez votre branche : `git push origin feature/ma-fonctionnalite`
5. Créez une Pull Request vers `main`
6. Attendez la revue de code
7. Une fois approuvée et mergée, Release Please s'occupera du reste !

Merci de votre contribution ! 🎉
