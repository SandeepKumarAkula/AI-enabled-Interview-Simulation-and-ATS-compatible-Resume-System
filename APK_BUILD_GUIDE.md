# Android APK Build Guide

This guide explains how to build an Android APK from the AI²SARS application.

## Prerequisites

### System Requirements
- Node.js 18+ installed
- Android SDK installed (API level 33+)
- Java 17 JDK installed
- Gradle 8.0+

### Install Tools

```bash
# Install Android SDK (if not already installed)
# Download from: https://developer.android.com/studio

# Set Android SDK path (adjust path as needed)
export ANDROID_SDK_ROOT=/path/to/android/sdk
export ANDROID_HOME=$ANDROID_SDK_ROOT
export PATH=$PATH:$ANDROID_SDK_ROOT/tools:$ANDROID_SDK_ROOT/platform-tools
```

## Local Build Steps

### Step 1: Install Dependencies
```bash
npm install
npm install --legacy-peer-deps
```

### Step 2: Build Next.js App
```bash
npm run build
```

### Step 3: Initialize/Sync Capacitor
```bash
npm install -g @capacitor/cli
npx cap add android          # Only needed if android folder doesn't exist
npx cap sync android         # Sync web assets to Android
```

### Step 4: Build APK
```bash
cd android
chmod +x gradlew
./gradlew assembleRelease --no-daemon
```

The unsigned APK will be generated at:
```
android/app/build/outputs/apk/release/app-release-unsigned.apk
```

### Step 5: Sign APK (Production)

If you have a keystore file:

```bash
cd android
./gradlew assembleRelease \
  -Pandroid.injected.signing.store.file=path/to/keystore.jks \
  -Pandroid.injected.signing.store.password=YOUR_STORE_PASSWORD \
  -Pandroid.injected.signing.key.alias=YOUR_KEY_ALIAS \
  -Pandroid.injected.signing.key.password=YOUR_KEY_PASSWORD
```

Signed APK will be at:
```
android/app/build/outputs/apk/release/app-release.apk
```

### Step 6: Create a Keystore (if you don't have one)

```bash
keytool -genkey -v -keystore my-release-key.jks \
  -keyalg RSA -keysize 2048 -validity 10000 \
  -alias my-key-alias
```

## GitHub Automated Build

### Option 1: Automatic Build on Push

The repository includes `.github/workflows/build-apk.yml` which automatically:
- Builds the APK on every push to main/master
- Creates an artifact with the APK
- You can download it from GitHub Actions

### Option 2: Setup Signed Releases

To enable automatic signing and releases:

1. **Create a keystore** (if not already created):
   ```bash
   keytool -genkey -v -keystore release-keystore.jks \
     -keyalg RSA -keysize 2048 -validity 10000 \
     -alias release-key
   ```

2. **Encode keystore as base64**:
   ```bash
   base64 release-keystore.jks | xclip -selection clipboard
   # Or on macOS:
   base64 release-keystore.jks | pbcopy
   ```

3. **Add GitHub Secrets**:
   - Go to: GitHub repo → Settings → Secrets and variables → Actions
   - Add the following secrets:
     - `KEYSTORE_FILE`: Base64 encoded keystore content (from step 2)
     - `KEYSTORE_PASSWORD`: Your keystore password
     - `KEY_ALIAS`: Your key alias (e.g., "release-key")
     - `KEY_PASSWORD`: Your key password

4. **Create a Release**:
   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```
   The APK will be automatically signed and attached to the GitHub Release.

## Download APK from GitHub

### From GitHub Actions (Unsigned):
1. Go to your repo → Actions → build-apk workflow
2. Click the latest successful build
3. Scroll down to "Artifacts"
4. Download `app-release`

### From GitHub Releases (Signed):
1. Go to your repo → Releases
2. Download the APK from the release assets

## Troubleshooting

### Build Fails with Gradle Error
```bash
cd android
./gradlew clean
./gradlew assembleRelease --no-daemon --stacktrace
```

### Android SDK Not Found
Set the Android SDK path:
```bash
export ANDROID_HOME=/path/to/android/sdk
export PATH=$PATH:$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools
```

### Memory Issues
Increase Gradle heap size:
```bash
cd android
export GRADLE_OPTS="-Xmx2048m"
./gradlew assembleRelease --no-daemon
```

### Capacitor Sync Issues
```bash
npx cap sync android --prod
```

## Distribute APK

### Manual Testing
1. Connect Android device or use emulator
2. Install APK:
   ```bash
   adb install path/to/app-release-unsigned.apk
   ```

### Google Play Store
1. Create a Google Play Developer account
2. Sign APK with production keystore
3. Upload to Google Play Console
4. Configure app details and permissions
5. Publish to testing/production tracks

### Direct Distribution
1. Host APK on your server
2. Users can download and install directly
3. Must enable "Unknown sources" on their device

## Configuration

### Customize App Name/Icon

Edit `capacitor.config.ts`:
```typescript
const config: CapacitorConfig = {
  appId: 'com.example.aisars',
  appName: 'AI SARS',
  webDir: 'out',
  // ... other config
};
```

Edit `android/app/build.gradle`:
```gradle
android {
    defaultConfig {
        applicationId "com.example.aisars"
        // ... other config
    }
}
```

### Set Version Number

Edit `android/app/build.gradle`:
```gradle
defaultConfig {
    versionCode 1
    versionName "1.0.0"
}
```

## CI/CD Commands

### Build for Testing
```bash
npm run build
npx cap sync android
cd android && ./gradlew assembleDebug
```

### Build for Release
```bash
npm run build
npx cap sync android --prod
cd android && ./gradlew assembleRelease
```

### Clean Build
```bash
cd android
./gradlew clean
cd ..
npx cap sync android --prod
cd android && ./gradlew assembleRelease --no-daemon
```

## Next Steps

1. Push code to GitHub
2. GitHub Actions will automatically build the APK
3. Download from Actions artifacts or GitHub Releases
4. Test on real device
5. Upload to Google Play Store (optional)

For more information:
- Capacitor docs: https://capacitorjs.com/docs/android
- Android docs: https://developer.android.com/studio
- GitHub Actions: https://docs.github.com/en/actions
