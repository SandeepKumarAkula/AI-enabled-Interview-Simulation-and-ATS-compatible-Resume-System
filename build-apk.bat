@echo off
REM AI²SARS APK Build Script for Windows
REM This script automates the Android APK build process

setlocal enabledelayedexpansion

echo ==========================================
echo AI²SARS Android APK Build Script
echo ==========================================
echo.

REM Check prerequisites
echo Checking prerequisites...

where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Node.js not found. Please install Node.js 18+
    exit /b 1
)

where java >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Java not found. Please install Java 17 JDK
    exit /b 1
)

if "%ANDROID_HOME%"=="" (
    echo ERROR: ANDROID_HOME not set. Please set Android SDK path
    exit /b 1
)

echo OK: Prerequisites found
echo.

REM Step 1: Install dependencies
echo Step 1: Installing dependencies...
npm ci --legacy-peer-deps
if %ERRORLEVEL% NEQ 0 (
    npm install --legacy-peer-deps
)
echo OK: Dependencies installed
echo.

REM Step 2: Build Next.js
echo Step 2: Building Next.js app...
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Build failed
    exit /b 1
)
echo OK: Next.js build complete
echo.

REM Step 3: Sync Capacitor
echo Step 3: Syncing Capacitor...
call npx cap sync android
echo OK: Capacitor synced
echo.

REM Step 4: Build APK
echo Step 4: Building Android APK...
cd android

if "%1%"=="--release" (
    echo Building release APK with signing...
    if "%KEYSTORE_FILE%"=="" (
        echo WARNING: KEYSTORE_FILE not set. Building unsigned APK...
        call .\gradlew.bat assembleRelease --no-daemon
    ) else (
        call .\gradlew.bat assembleRelease ^
          -Pandroid.injected.signing.store.file=%KEYSTORE_FILE% ^
          -Pandroid.injected.signing.store.password=%KEYSTORE_PASSWORD% ^
          -Pandroid.injected.signing.key.alias=%KEY_ALIAS% ^
          -Pandroid.injected.signing.key.password=%KEY_PASSWORD% ^
          --no-daemon
    )
) else (
    echo Building debug APK...
    call .\gradlew.bat assembleDebug --no-daemon
)

if %ERRORLEVEL% NEQ 0 (
    echo ERROR: APK build failed
    exit /b 1
)

echo OK: APK build complete
echo.

REM Step 5: Show output
cd ..
if "%1%"=="--release" (
    set APK_PATH=android\app\build\outputs\apk\release\
    echo Release APK location:
    dir !APK_PATH!*.apk
) else (
    set APK_PATH=android\app\build\outputs\apk\debug\
    echo Debug APK location:
    dir !APK_PATH!*.apk
)
echo.

echo ==========================================
echo OK: Build complete!
echo ==========================================
echo.
echo Next steps:
echo   1. Download the APK from the path above
echo   2. Push code to GitHub
echo   3. GitHub Actions will build future APKs automatically
echo   4. Create releases for tagged versions
echo.

pause
