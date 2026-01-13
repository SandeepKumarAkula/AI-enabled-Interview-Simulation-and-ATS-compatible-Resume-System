# Quick Start: Building APK

## Summary

Your app is now ready to build as an Android APK. Here are the fastest ways to get started:

## Option 1: Automatic Build via GitHub (Recommended)

1. **Push to GitHub**:
   ```bash
   git push origin main
   ```

2. **GitHub Actions builds automatically** in `.github/workflows/build-apk.yml`

3. **Download APK**:
   - Go to GitHub → Actions → build-apk workflow
   - Click latest successful run
   - Download `app-release` artifact (bottom of page)

4. **Done!** You have the APK ready to install/share

---

## Option 2: Build Locally (Windows)

1. **One command**:
   ```bash
   build-apk.bat
   ```

2. **APK will be at**:
   ```
   android\app\build\outputs\apk\debug\app-debug.apk
   ```

3. **For release build** (production):
   ```bash
   build-apk.bat --release
   ```

---

## Option 3: Build Locally (Mac/Linux)

1. **Make script executable**:
   ```bash
   chmod +x build-apk.sh
   ```

2. **Run**:
   ```bash
   ./build-apk.sh
   ```

3. **APK will be at**:
   ```
   android/app/build/outputs/apk/debug/app-debug.apk
   ```

4. **For release build**:
   ```bash
   ./build-apk.sh --release
   ```

---

## Manual Build (All Platforms)

```bash
# 1. Install dependencies
npm install --legacy-peer-deps

# 2. Build Next.js
npm run build

# 3. Sync to Android
npx cap sync android

# 4. Build APK
cd android
./gradlew assembleRelease  # or assembleDebug
```

---

## Next Steps

### To Install APK on Device:
```bash
adb install path/to/app-release-unsigned.apk
```

### To Create GitHub Release:
```bash
git tag v1.0.0
git push origin v1.0.0
```
APK will be automatically attached to release

### To Enable Signed Releases:

1. **Create keystore**:
   ```bash
   keytool -genkey -v -keystore my-key.jks \
     -keyalg RSA -keysize 2048 -validity 10000 \
     -alias my-key
   ```

2. **Add to GitHub Secrets** (Settings → Secrets → Actions):
   - `KEYSTORE_FILE`: Base64 of keystore
   - `KEYSTORE_PASSWORD`: Your password
   - `KEY_ALIAS`: Alias name
   - `KEY_PASSWORD`: Key password

3. **Push a tag**:
   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```
   → Signed APK auto-attached to release

---

## Configuration

- **App ID**: `com.aisars.app` (in `capacitor.config.ts`)
- **App Name**: `AI SARS` (in `capacitor.config.ts`)
- **Version**: Edit in `android/app/build.gradle`

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| `ANDROID_HOME not set` | Set Android SDK path: `export ANDROID_HOME=/path/to/android/sdk` |
| `Gradle build fails` | Run `cd android && ./gradlew clean` then try again |
| `Out of memory` | Increase heap: `export GRADLE_OPTS="-Xmx2048m"` |
| `APK not found` | Check build output above, ensure no errors |

---

## File Locations

- **Workflow**: `.github/workflows/build-apk.yml`
- **Build script (Windows)**: `build-apk.bat`
- **Build script (Linux/Mac)**: `build-apk.sh`
- **Full guide**: `APK_BUILD_GUIDE.md`
- **Capacitor config**: `capacitor.config.ts`

---

## What's Included

✅ GitHub Actions CI/CD  
✅ Local build scripts (Windows, Mac, Linux)  
✅ Automatic artifact uploads  
✅ Release creation workflow  
✅ Signed release support  

---

**Ready to build?** Start with Option 1 (GitHub) or Option 2 (Local Windows)!
