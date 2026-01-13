#!/bin/bash

# AI²SARS APK Build Script
# This script automates the Android APK build process

set -e

echo "=========================================="
echo "AI²SARS Android APK Build Script"
echo "=========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check prerequisites
echo -e "${YELLOW}Checking prerequisites...${NC}"

if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js not found. Please install Node.js 18+${NC}"
    exit 1
fi

if ! command -v java &> /dev/null; then
    echo -e "${RED}❌ Java not found. Please install Java 17 JDK${NC}"
    exit 1
fi

if [ -z "$ANDROID_HOME" ]; then
    echo -e "${RED}❌ ANDROID_HOME not set. Please set Android SDK path${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Prerequisites OK${NC}"
echo ""

# Step 1: Install dependencies
echo -e "${YELLOW}Step 1: Installing dependencies...${NC}"
npm ci --legacy-peer-deps 2>/dev/null || npm install --legacy-peer-deps
echo -e "${GREEN}✓ Dependencies installed${NC}"
echo ""

# Step 2: Build Next.js
echo -e "${YELLOW}Step 2: Building Next.js app...${NC}"
npm run build
echo -e "${GREEN}✓ Next.js build complete${NC}"
echo ""

# Step 3: Sync Capacitor
echo -e "${YELLOW}Step 3: Syncing Capacitor...${NC}"
npx cap sync android
echo -e "${GREEN}✓ Capacitor synced${NC}"
echo ""

# Step 4: Build APK
echo -e "${YELLOW}Step 4: Building Android APK...${NC}"
cd android
chmod +x gradlew

if [ "$1" == "--release" ]; then
    echo "Building release APK with signing..."
    if [ -z "$KEYSTORE_FILE" ]; then
        echo -e "${RED}❌ KEYSTORE_FILE not set. Building unsigned APK...${NC}"
        ./gradlew assembleRelease --no-daemon
    else
        ./gradlew assembleRelease \
          -Pandroid.injected.signing.store.file=$KEYSTORE_FILE \
          -Pandroid.injected.signing.store.password=$KEYSTORE_PASSWORD \
          -Pandroid.injected.signing.key.alias=$KEY_ALIAS \
          -Pandroid.injected.signing.key.password=$KEY_PASSWORD \
          --no-daemon
    fi
else
    echo "Building debug APK..."
    ./gradlew assembleDebug --no-daemon
fi

echo -e "${GREEN}✓ APK build complete${NC}"
echo ""

# Step 5: Show output
cd ..
if [ "$1" == "--release" ]; then
    APK_PATH="android/app/build/outputs/apk/release/"
    echo -e "${GREEN}Release APK location:${NC}"
    ls -lh $APK_PATH*.apk 2>/dev/null || echo "APK not found in $APK_PATH"
else
    APK_PATH="android/app/build/outputs/apk/debug/"
    echo -e "${GREEN}Debug APK location:${NC}"
    ls -lh $APK_PATH*.apk 2>/dev/null || echo "APK not found in $APK_PATH"
fi
echo ""

echo -e "${GREEN}=========================================="
echo "✓ Build complete!"
echo "==========================================${NC}"
echo ""
echo "Next steps:"
echo "  1. Download the APK from the path above"
echo "  2. Push code to GitHub"
echo "  3. GitHub Actions will build future APKs automatically"
echo "  4. Create releases for tagged versions"
echo ""
