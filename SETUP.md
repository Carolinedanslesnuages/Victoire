# Setup Guide for PACE React Native Application

## What You'll See

When you run the application, you will see a simple screen with:

```
         Hello World!
       Welcome to PACE
```

The text is centered on a white background:
- "Hello World!" is displayed in large, bold font (32px)
- "Welcome to PACE" is displayed below in a smaller, gray font (18px)

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Application

#### Option A: iOS Simulator (Mac required)
```bash
npm run ios
```

#### Option B: Physical Device (iPhone)
```bash
npm start
```
Then scan the QR code with Expo Go app on your iPhone.

#### Option C: Web Browser
```bash
npm run web
```

## Application Structure

- **App.js** - Main application component with the Hello World UI
- **index.js** - Entry point that registers the root component
- **app.json** - Expo configuration
- **package.json** - Project dependencies and scripts
- **assets/** - Application icons and images

## Next Steps

After verifying the Hello World app works:
1. Modify App.js to add new features
2. Learn about React Native components
3. Explore Expo's additional features
4. Build your first real feature

## Troubleshooting

### iOS Simulator doesn't open
- Make sure Xcode is installed: `xcode-select -p`
- Install Command Line Tools: `xcode-select --install`

### Cannot connect to Expo Go on physical device
- Ensure both devices are on the same WiFi network
- Try using tunnel mode: `npx expo start --tunnel`

### Dependencies issues
```bash
rm -rf node_modules package-lock.json
npm install
```
