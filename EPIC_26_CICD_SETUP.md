# Epic 26: DevOps & CI/CD - Automated Build Setup

## Overview

This documentation explains the automated build system for the PACE application. When you push code to the `main` branch, iOS and Android builds are automatically compiled using EAS Build (Expo Application Services).

## Benefits

✅ **Time Savings**: No more spending 2 hours for each store update
✅ **Automation**: Builds trigger automatically on every push to main
✅ **Consistency**: Same build process every time
✅ **Parallel Builds**: iOS and Android build simultaneously

## Architecture

### Components

1. **EAS Build Configuration** (`eas.json`)
   - Defines build profiles (development, preview, production)
   - Configures platform-specific settings
   - Manages build versioning

2. **GitHub Actions Workflow** (`.github/workflows/eas-build.yml`)
   - Triggers on pushes to main branch
   - Sets up Node.js and EAS CLI
   - Launches builds for both platforms

## Setup Instructions

### 1. Prerequisites

- An Expo account (create one at https://expo.dev)
- EAS CLI installed globally (for local testing): `npm install -g eas-cli`
- Access to the PACE repository

### 2. Configure EAS

#### Login to Expo
```bash
eas login
```

#### Link Project to EAS
```bash
cd /path/to/PACE
eas build:configure
```

This command will:
- Create or update `eas.json` configuration
- Link your project to your Expo account
- Set up the project slug

### 3. Configure GitHub Secrets

To enable automated builds, you need to add your Expo access token to GitHub secrets:

#### Generate an Expo Access Token

1. Go to https://expo.dev/accounts/[your-account]/settings/access-tokens
2. Click "Create Token"
3. Give it a descriptive name (e.g., "PACE GitHub Actions")
4. Copy the generated token

#### Add Token to GitHub

1. Go to your GitHub repository: https://github.com/Carolinedanslesnuages/PACE
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Name: `EXPO_TOKEN`
5. Value: Paste your Expo access token
6. Click **Add secret**

### 4. Build Profiles

The `eas.json` file defines three build profiles:

#### Development
```json
"development": {
  "developmentClient": true,
  "distribution": "internal"
}
```
- For development and debugging
- Includes development client
- Internal distribution only

#### Preview
```json
"preview": {
  "distribution": "internal",
  "ios": {
    "simulator": true
  }
}
```
- For testing before production
- iOS builds can run on simulator
- Internal distribution

#### Production
```json
"production": {
  "autoIncrement": true,
  "ios": {
    "buildConfiguration": "Release"
  },
  "android": {
    "buildType": "apk"
  }
}
```
- For App Store and Google Play submissions
- Auto-increments build numbers
- Release configuration

### 5. iOS-Specific Setup

For iOS builds, you need to configure credentials:

#### Option A: Let EAS Manage (Recommended)
```bash
eas credentials
```
EAS will automatically:
- Generate signing certificates
- Create provisioning profiles
- Store credentials securely

#### Option B: Use Existing Credentials
If you already have Apple Developer credentials:
1. Run `eas credentials`
2. Choose "Set up ad hoc provisioning" or "Set up app store provisioning"
3. Follow the prompts to upload your certificates

### 6. Android-Specific Setup

For Android builds:

#### Generate Keystore
```bash
eas credentials
```
Choose Android, then:
- Generate a new keystore
- Or upload an existing keystore

The keystore is required for:
- Signing your APK/AAB files
- Publishing to Google Play Store

### 7. Testing the Workflow

#### Manual Trigger
You can manually trigger a build from GitHub:

1. Go to **Actions** tab in your GitHub repository
2. Select **EAS Build** workflow
3. Click **Run workflow**
4. Select branch (usually `main`)
5. Click **Run workflow**

#### Automatic Trigger
Simply push to the main branch:
```bash
git add .
git commit -m "feat: new feature"
git push origin main
```

The workflow will automatically start building.

### 8. Monitoring Builds

#### View in GitHub Actions
1. Go to the **Actions** tab in your repository
2. Click on the latest workflow run
3. Monitor the build progress

#### View in Expo Dashboard
1. Go to https://expo.dev
2. Navigate to your project
3. Click on **Builds**
4. See detailed build logs and download artifacts

## Workflow Details

### What Happens on Push to Main

1. **Trigger**: Push detected on `main` branch
2. **Checkout**: Repository code is checked out
3. **Setup**: Node.js and EAS CLI are installed
4. **Authentication**: EXPO_TOKEN is used to authenticate
5. **Dependencies**: npm packages are installed
6. **Build**: EAS build is triggered for both iOS and Android
7. **Queue**: Builds are queued on EAS servers
8. **Notification**: You receive build status updates

### Build Command

The workflow uses:
```bash
eas build --platform all --non-interactive --no-wait
```

- `--platform all`: Build both iOS and Android
- `--non-interactive`: Don't prompt for user input
- `--no-wait`: Don't wait for builds to complete (faster workflow)

## Customization

### Build Only One Platform

Edit `.github/workflows/eas-build.yml`:

For iOS only:
```yaml
- name: Build on EAS
  run: eas build --platform ios --non-interactive --no-wait
```

For Android only:
```yaml
- name: Build on EAS
  run: eas build --platform android --non-interactive --no-wait
```

### Change Build Profile

To use a different profile (e.g., preview):
```yaml
- name: Build on EAS
  run: eas build --platform all --profile preview --non-interactive --no-wait
```

### Wait for Build Completion

To make the workflow wait for builds to complete:
```yaml
- name: Build on EAS
  run: eas build --platform all --non-interactive
```
(Remove `--no-wait` flag)

## Troubleshooting

### EXPO_TOKEN Error

**Error**: "You must provide an EXPO_TOKEN secret"

**Solution**: 
- Verify you've added EXPO_TOKEN to GitHub Secrets
- Check the token is valid at https://expo.dev/accounts/[your-account]/settings/access-tokens
- Regenerate token if necessary

### Build Fails with Credentials Error

**Error**: "No credentials found"

**Solution**:
```bash
eas credentials
```
Set up credentials for iOS and/or Android as described in sections 5 and 6.

### iOS Build Fails

**Common Issues**:
- Missing provisioning profile
- Invalid bundle identifier
- Apple Developer account not configured

**Solution**:
```bash
eas build:configure
eas credentials
```
Follow the prompts to set up iOS credentials.

### Android Build Fails

**Common Issues**:
- Missing keystore
- Invalid package name

**Solution**:
```bash
eas credentials
```
Generate or upload Android keystore.

### Build Queue is Full

**Error**: "Build queue is full"

**Solution**:
- Wait for other builds to complete
- Consider upgrading your Expo plan for more concurrent builds
- Check your build queue at https://expo.dev

## Cost Considerations

### Expo Build Plans

EAS Build has different pricing tiers:

- **Free Tier**: Limited builds per month
- **Production Plan**: More builds and concurrent builds
- **Enterprise Plan**: Unlimited builds

Check current pricing at: https://expo.dev/pricing

### Optimizing Build Usage

1. **Use `--no-wait`**: Don't block CI time waiting for builds
2. **Conditional Builds**: Only build when necessary
3. **Manual Triggers**: Use workflow_dispatch for on-demand builds
4. **Platform-Specific**: Build only the platform you need

## Best Practices

### 1. Test Locally First
```bash
eas build --platform ios --profile preview --local
```

### 2. Use Development Builds for Testing
```bash
eas build --profile development
```

### 3. Version Management
- Let EAS auto-increment build numbers
- Keep `app.json` version in sync with releases

### 4. Monitor Build Status
- Set up Expo notifications
- Check build dashboard regularly
- Review build logs for errors

### 5. Secure Credentials
- Never commit credentials to Git
- Use EAS credential management
- Rotate tokens periodically

## Next Steps

1. **Submit to Stores**: Once builds are ready, use `eas submit`
2. **OTA Updates**: Set up EAS Update for faster updates
3. **Testing**: Integrate with TestFlight (iOS) and Internal Testing (Android)
4. **Monitoring**: Set up error tracking (e.g., Sentry)

## Resources

- [EAS Build Documentation](https://docs.expo.dev/build/introduction/)
- [GitHub Actions for Expo](https://docs.expo.dev/build/building-on-ci/)
- [EAS Credentials](https://docs.expo.dev/app-signing/app-credentials/)
- [Expo Pricing](https://expo.dev/pricing)

## Support

For issues or questions:
- Check Expo forums: https://forums.expo.dev
- Review Expo documentation: https://docs.expo.dev
- Check GitHub Actions logs in your repository
- Contact Expo support for account-related issues
