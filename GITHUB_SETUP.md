# GitHub Setup Instructions

Complete guide to push your project to GitHub and enable automated APK builds.

## Prerequisites

- GitHub account (create at https://github.com/signup)
- Git installed locally
- Your AI²SARS project folder

## Step 1: Create GitHub Repository

1. Go to https://github.com/new
2. **Repository name**: `aisars` (or your preferred name)
3. **Description**: `AI interview platform with resume analysis`
4. Choose **Public** or **Private**
5. Click **Create repository**

## Step 2: Initialize Local Git Repository

Navigate to your project folder:

```bash
cd "c:\Users\AKULA SANDEEP KUMAR\Downloads\AI²SARS"

# Initialize git
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: AI interview platform with APK build setup"
```

## Step 3: Connect to GitHub Repository

Replace `USERNAME` with your GitHub username:

```bash
# Add remote origin
git remote add origin https://github.com/USERNAME/aisars.git

# Rename branch to main (if needed)
git branch -M main

# Push to GitHub
git push -u origin main
```

**Note**: You may be prompted for GitHub credentials. Use your GitHub personal access token (see Step 4).

## Step 4: Create Personal Access Token (if needed)

1. Go to https://github.com/settings/tokens/new
2. **Token name**: `local-git-access`
3. **Expiration**: 90 days
4. **Scopes**: Select `repo` (full control of private repositories)
5. Click **Generate token**
6. Copy the token (save it somewhere safe)

Use this token as password when Git prompts for authentication.

## Step 5: Verify Repository on GitHub

1. Go to https://github.com/USERNAME/aisars
2. You should see all your files
3. Check that `.github/workflows/build-apk.yml` is present

## Step 6: Enable GitHub Actions

1. Go to your repo → **Settings** → **Actions** → **General**
2. Under "Actions permissions", select: **Allow all actions and reusable workflows**
3. Click **Save**

## Step 7: Test Automated Build

Push a small change to trigger the build:

```bash
# Make a small change (e.g., update README)
echo "# AI²SARS" > README.md

# Commit and push
git add README.md
git commit -m "Add README"
git push origin main
```

Monitor the build:
1. Go to your repo → **Actions**
2. Click the **build-apk** workflow
3. Watch it build in real-time

## Step 8: Download APK from GitHub Actions

Once build completes:

1. Go to your repo → **Actions**
2. Click the successful **build-apk** run
3. Scroll down to **Artifacts**
4. Download **app-release**
5. Extract the `.apk` file inside

## Step 9: Set Up Signed Releases (Optional but Recommended)

### Create a Signing Keystore

```bash
# Generate keystore
keytool -genkey -v -keystore my-release-key.jks ^
  -keyalg RSA -keysize 2048 -validity 10000 ^
  -alias release-key

# When prompted:
# - Password: Choose something strong (e.g., MySecurePass123)
# - First and last name: Your name
# - Organization unit: Your company/self
# - Organization: Your company/personal
# - City: Your city
# - State: Your state
# - Country code: US (or your country)
```

### Convert Keystore to Base64

**Windows**:
```bash
certutil -encode my-release-key.jks my-release-key.b64
type my-release-key.b64 | clip
```

**Mac/Linux**:
```bash
base64 my-release-key.jks | pbcopy  # Mac
base64 my-release-key.jks | xclip -selection clipboard  # Linux
```

### Add GitHub Secrets

1. Go to your repo → **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Add these secrets:

| Name | Value |
|------|-------|
| `KEYSTORE_FILE` | Paste the Base64 keystore (from clipboard) |
| `KEYSTORE_PASSWORD` | Your keystore password |
| `KEY_ALIAS` | `release-key` |
| `KEY_PASSWORD` | Your key password |

## Step 10: Create Release with Signed APK

```bash
# Create a git tag
git tag v1.0.0

# Push the tag to GitHub
git push origin v1.0.0
```

GitHub Actions will:
1. See the tag
2. Build the APK
3. Sign it with your keystore
4. Create a GitHub Release
5. Attach the signed APK automatically

Download from: **Releases** → **v1.0.0** → Download APK

## Regular Workflow

After setup, your workflow is simple:

### Daily Development:
```bash
# Make changes
git add .
git commit -m "Add feature X"
git push origin main
```

APK is automatically built and available in Actions.

### Release:
```bash
# Tag a release version
git tag v1.1.0
git push origin v1.1.0
```

Signed APK is automatically attached to GitHub Release.

## Sharing Your APK

### Option 1: GitHub Releases (Recommended)
- Users download from your GitHub Releases page
- Professional appearance
- Version history maintained

### Option 2: Direct Download
- Share APK file directly via email/messaging
- Users install via `adb install app.apk`

### Option 3: Google Play Store
- More complex but reaches more users
- Requires paid developer account ($25)
- Users get automatic updates

## Troubleshooting

### Build Fails in GitHub Actions

1. Click the failed workflow
2. Check the error in the logs
3. Common issues:
   - **Android SDK mismatch**: May need to update `build.gradle`
   - **Java version**: Ensure Java 11+ is available
   - **Dependencies**: Run `npm install --legacy-peer-deps`

### Can't Push to GitHub

```bash
# Try HTTPS instead of SSH
git remote set-url origin https://github.com/USERNAME/aisars.git
git push -u origin main
```

### Need to Add More Secrets

Always add secrets BEFORE the workflow runs. After adding:
1. Commit a change to trigger new workflow
2. Or manually run from **Actions** → **build-apk** → **Run workflow**

## Next Steps

1. ✅ Push code to GitHub
2. ✅ Enable GitHub Actions
3. ✅ Test first build
4. ✅ Download APK
5. ✅ (Optional) Set up signing for releases
6. ✅ Share with users!

## Additional Resources

- GitHub Docs: https://docs.github.com/en/get-started
- GitHub Actions: https://docs.github.com/en/actions
- Android Studio: https://developer.android.com/studio
- Capacitor: https://capacitorjs.com/docs/android

## Support

For issues with:
- **GitHub**: Check GitHub docs or contact GitHub support
- **Android builds**: See `APK_BUILD_GUIDE.md`
- **Capacitor**: Visit https://capacitorjs.com/docs
- **Your app**: Review the project's technical documentation

---

**Ready?** Follow the steps above and your APK builds will be automated!
