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

## Prochaines Étapes

Maintenant que votre environnement est configuré et que l'application "Hello World" fonctionne, vous êtes prêt à :

1. Personnaliser l'application en modifiant `App.js`
2. Ajouter de nouvelles fonctionnalités
3. Explorer les composants React Native
4. Intégrer des bibliothèques tierces

Bon développement ! 🚀