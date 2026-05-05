# Forjit AI — Android App Build Guide

A WebView wrapper for **https://forjitai.in** built with Capacitor.

---

## Features
- ⚡ Splash screen with Forjit AI branding
- 📶 Offline detection with retry screen
- 🔄 Pull-to-refresh support
- ◀️ Android back-button navigates inside WebView
- 📊 Top loading progress bar (amber accent)
- 🔒 HTTPS-only, network security enforced
- 🎯 Deep link support for forjitai.in URLs
- 📦 Adaptive icons (all densities)

---

## Prerequisites

Install these before building:

| Tool | Version | Download |
|------|---------|---------|
| Android Studio | Latest (Hedgehog+) | https://developer.android.com/studio |
| Android SDK | API 34 | Via Android Studio SDK Manager |
| JDK | 17+ | Bundled with Android Studio |
| Node.js | 18+ | https://nodejs.org |

---

## Build Steps

### 1. Install dependencies
```bash
cd android-app
npm install
```

### 2. Open in Android Studio
```bash
npx cap open android
# OR: open Android Studio → File → Open → select android/ folder
```

### 3. Build Debug APK (for testing)
```bash
cd android
./gradlew assembleDebug
# Output: android/app/build/outputs/apk/debug/app-debug.apk
```

### 4. Build Release APK (for Play Store)

#### a) Create a keystore (only once)
```bash
keytool -genkey -v \
  -keystore forjitai-release.keystore \
  -alias forjitai \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000
```
**Store the keystore file and passwords safely — you cannot publish updates without it.**

#### b) Add signing config to `android/app/build.gradle`
```groovy
android {
    signingConfigs {
        release {
            storeFile file('/path/to/forjitai-release.keystore')
            storePassword 'YOUR_STORE_PASSWORD'
            keyAlias 'forjitai'
            keyPassword 'YOUR_KEY_PASSWORD'
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
            // ... existing config
        }
    }
}
```

#### c) Build signed release APK
```bash
cd android
./gradlew assembleRelease
# Output: android/app/build/outputs/apk/release/app-release.apk
```

#### d) Build AAB (recommended for Play Store)
```bash
./gradlew bundleRelease
# Output: android/app/build/outputs/bundle/release/app-release.aab
```

---

## Play Store Checklist

- [ ] Create keystore and sign the APK/AAB
- [ ] Replace drawable icons with actual PNG icons (see below)
- [ ] Set `versionCode` and `versionName` in `app/build.gradle`
- [ ] Create Play Store listing (screenshots, description)
- [ ] Add Privacy Policy URL (required): https://forjitai.in/privacy
- [ ] Verify Digital Asset Links for deep linking (assetlinks.json on forjitai.in)

---

## App Icons

Replace the vector XML icons with actual PNG files for production:

| Density | Size | Folder |
|---------|------|--------|
| mdpi | 48×48 | mipmap-mdpi |
| hdpi | 72×72 | mipmap-hdpi |
| xhdpi | 96×96 | mipmap-xhdpi |
| xxhdpi | 144×144 | mipmap-xxhdpi |
| xxxhdpi | 192×192 | mipmap-xxxhdpi |
| Play Store | 512×512 | Upload separately |

Use [Android Asset Studio](https://romannurik.github.io/AndroidAssetStudio/icons-launcher.html) to generate all sizes.

---

## App Details

| Field | Value |
|-------|-------|
| Package ID | `in.forjitai.app` |
| App Name | Forjit AI |
| Min SDK | Android 6.0 (API 23) |
| Target SDK | Android 14 (API 34) |
| URL | https://forjitai.in |
| Version | 1.0.0 (code: 1) |

---

## Project Structure

```
android-app/
├── capacitor.config.json     # Capacitor + server URL config
├── package.json
├── www/
│   └── index.html            # Fallback web page
└── android/
    ├── build.gradle          # Project build config
    ├── settings.gradle
    ├── gradle.properties
    └── app/
        ├── build.gradle      # App build config + dependencies
        ├── proguard-rules.pro
        └── src/main/
            ├── AndroidManifest.xml
            ├── java/in/forjitai/app/
            │   └── MainActivity.java  # All WebView logic here
            └── res/
                ├── drawable/          # SVG icons + splash
                ├── layout/
                │   └── activity_main.xml
                ├── mipmap-*/          # Launcher icons
                ├── values/
                │   ├── colors.xml
                │   ├── strings.xml
                │   └── styles.xml
                └── xml/
                    └── network_security_config.xml
```

---

## © 2025 Forjit AI · All rights reserved
Contact: forjitai@gmail.com
