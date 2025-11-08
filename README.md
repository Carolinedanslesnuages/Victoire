# PACE

Application mobile React Native créée avec Expo.

## Epic 0 : Environnement React Native (via Expo)

Cette application est un "Hello World" qui peut tourner sur le simulateur iPhone et sur un téléphone physique.

---

## Feature 0.1 : Prérequis Système (Mac)

### US 0.1.1 : Installation de Homebrew

Homebrew est le gestionnaire de paquets pour Mac qui facilite l'installation des outils de développement.

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

Après l'installation, suivez les instructions pour ajouter Homebrew à votre PATH.

### US 0.1.2 : Installation de Node.js et Watchman

Installez Node.js (version LTS) et Watchman via Homebrew :

```bash
brew install node
brew install watchman
```

Vérifiez l'installation :

```bash
node --version
npm --version
watchman --version
```

### US 0.1.3 : Configuration de VS Code

1. Téléchargez et installez [Visual Studio Code](https://code.visualstudio.com/)

2. Installez les extensions recommandées :
   - **React Native Tools** : Aide au développement React Native
   - **ES7+ React/Redux/GraphQL Snippets** : Snippets de code pour React

Pour installer les extensions :
- Ouvrez VS Code
- Allez dans Extensions (⌘+Shift+X)
- Recherchez et installez les extensions mentionnées

---

## Feature 0.2 : Initialisation du Projet

### US 0.2.1 : Création du projet avec Expo

Le projet a été créé avec la commande suivante :

```bash
npx create-expo-app@latest PACE --template blank
```

Structure du projet :
- `App.js` : Composant principal de l'application
- `app.json` : Configuration Expo
- `package.json` : Dépendances et scripts npm
- `assets/` : Images et ressources de l'application

### US 0.2.2 : Initialisation Git

Le projet est déjà initialisé avec Git. Pour vérifier :

```bash
git status
```

---

## Feature 0.3 : Première Exécution

### US 0.3.1 : Installation de Xcode

1. Téléchargez **Xcode** depuis l'App Store sur votre Mac
2. Une fois installé, ouvrez Xcode et acceptez la licence
3. Installez les Command Line Tools :

```bash
xcode-select --install
```

### US 0.3.2 : Lancement sur le Simulateur iOS

1. Installez les dépendances du projet :

```bash
npm install
```

2. Démarrez le serveur de développement Expo :

```bash
npm start
```

ou directement pour iOS :

```bash
npm run ios
```

3. Le simulateur iOS se lancera automatiquement et affichera l'application
4. Vous verrez l'application "Hello World!" s'afficher
5. Toute modification dans `App.js` sera reflétée en temps réel sur le simulateur

### US 0.3.3 : Test sur iPhone physique (Optionnel)

1. **Installez l'application Expo Go** sur votre iPhone depuis l'App Store

2. **Assurez-vous que votre Mac et votre iPhone sont sur le même réseau Wi-Fi**

3. **Démarrez le serveur de développement** :

```bash
npm start
```

4. **Scannez le QR code** :
   - Un QR code apparaîtra dans le terminal ou dans votre navigateur
   - Ouvrez l'application Expo Go sur votre iPhone
   - Scannez le QR code avec l'appareil photo de votre iPhone
   - L'application se chargera et s'exécutera sur votre téléphone

5. **Développement en temps réel** :
   - Toute modification du code sera automatiquement reflétée sur votre téléphone
   - Secouez votre téléphone pour accéder au menu de développement

---

## Scripts Disponibles

Dans le répertoire du projet, vous pouvez exécuter :

- `npm start` : Démarre le serveur de développement Expo
- `npm run ios` : Lance l'application sur le simulateur iOS
- `npm run android` : Lance l'application sur un émulateur/appareil Android
- `npm run web` : Lance l'application dans le navigateur web

---

## Structure du Projet

```
PACE/
├── App.js              # Composant principal "Hello World"
├── app.json            # Configuration Expo
├── package.json        # Dépendances et scripts
├── index.js            # Point d'entrée de l'application
├── assets/             # Images et icônes
│   ├── icon.png
│   ├── splash-icon.png
│   ├── adaptive-icon.png
│   └── favicon.png
└── README.md           # Ce fichier
```

---

## Ressources Utiles

- [Documentation Expo](https://docs.expo.dev/)
- [Documentation React Native](https://reactnative.dev/)
- [Guide de démarrage Expo](https://docs.expo.dev/get-started/introduction/)
- [Expo Go sur l'App Store](https://apps.apple.com/app/expo-go/id982107779)

---

## Dépannage

### Le QR code ne fonctionne pas

- Vérifiez que votre Mac et votre iPhone sont sur le même réseau Wi-Fi
- Essayez de redémarrer le serveur de développement
- Utilisez le mode tunnel : `npx expo start --tunnel`

### Le simulateur iOS ne se lance pas

- Vérifiez que Xcode est bien installé : `xcode-select -p`
- Ouvrez Xcode et allez dans Preferences > Locations pour configurer les Command Line Tools
- Essayez de lancer le simulateur manuellement depuis Xcode

### Erreurs de dépendances

```bash
rm -rf node_modules package-lock.json
npm install
```

---

## Epic 31 : Automatisation des Releases

Ce projet utilise **Release Please** pour automatiser la gestion des versions et des releases.

### Comment Contribuer

📝 **Utilisez les Conventional Commits** pour vos messages de commit :

```bash
feat: ajouter une nouvelle fonctionnalité
fix: corriger un bug
docs: mettre à jour la documentation
chore: tâches de maintenance
```

Pour plus de détails, consultez le [Guide de Contribution](CONTRIBUTING.md).

### Processus de Release Automatique

1. Les commits suivant les Conventional Commits sont poussés sur `main`
2. Release Please analyse les commits et crée automatiquement une "Release PR"
3. La Release PR met à jour :
   - La version dans `package.json`
   - La version dans `app.json`
   - Le `CHANGELOG.md`
4. Une fois la Release PR mergée, un tag Git et une release GitHub sont créés automatiquement

### Validation des Commits

Le projet utilise **commitlint** et **husky** pour valider automatiquement vos messages de commit. Si votre message ne suit pas les conventions, le commit sera rejeté.

Pour plus d'informations sur les conventions de commit et le processus de release, consultez [CONTRIBUTING.md](CONTRIBUTING.md).

---

## Epic 26 : DevOps & CI/CD - Build Automatisé

Ce projet dispose d'un système de **build automatisé** pour les applications iOS et Android.

### 🚀 Qu'est-ce que c'est ?

Chaque fois que du code est poussé sur la branche `main`, un service (EAS Build d'Expo via GitHub Actions) lance automatiquement la compilation des applications iOS et Android.

### 💡 Avantages

- **Gain de temps** : Plus besoin de passer 2 heures à chaque mise à jour des stores
- **Automatisation** : Les builds se lancent automatiquement
- **Cohérence** : Même processus de build à chaque fois
- **Builds parallèles** : iOS et Android compilent simultanément

### 📚 Documentation

Pour configurer et utiliser le système de build automatisé, consultez la [documentation complète CI/CD](EPIC_26_CICD_SETUP.md).

### Configuration requise

1. Compte Expo configuré
2. Token Expo ajouté aux secrets GitHub (`EXPO_TOKEN`)
3. Credentials iOS et Android configurés via EAS

---

## Epic 13 : Conformité & Légal

L'application respecte toutes les exigences des stores (App Store et Google Play) en matière de conformité légale :

### Documents Légaux

- **[Politique de Confidentialité](PRIVACY_POLICY.md)** : Disponible dans l'application et sur le repository GitHub
- **[Conditions d'Utilisation](TERMS_OF_SERVICE.md)** : Inclut l'EULA standard d'Apple et les termes d'abonnement

Ces documents sont accessibles depuis l'écran Paramètres de l'application et peuvent être consultés avant la soumission aux stores.

### Transparence des Données (iOS)

L'application inclut la configuration App Tracking Transparency (ATT) pour iOS :
- Un message explicatif est configuré dans `app.json`
- L'application ne collecte **aucune donnée de tracking**
- Toutes les données sont stockées localement sur l'appareil de l'utilisateur

### Conformité GDPR & CCPA

- Les données sont stockées localement uniquement
- Aucune transmission de données personnelles vers des serveurs externes
- L'utilisateur a un contrôle total sur ses données
- Option de réinitialisation complète disponible

---

## Prochaines Étapes

Maintenant que votre environnement est configuré et que l'application "Hello World" fonctionne, vous êtes prêt à :

1. Personnaliser l'application en modifiant `App.js`
2. Ajouter de nouvelles fonctionnalités en suivant les [conventions de commit](CONTRIBUTING.md)
3. Explorer les composants React Native
4. Intégrer des bibliothèques tierces

Bon développement ! 🚀