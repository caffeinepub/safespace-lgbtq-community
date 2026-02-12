# SafeSpace Mobile Wrapper Build Guide

This guide provides step-by-step instructions for building unsigned Android APK and iOS IPA files from the SafeSpace mobile wrapper projects.

## Overview

The SafeSpace mobile wrappers are native Android and iOS applications that load the SafeSpace web app in a WebView. This allows users to access SafeSpace as a native mobile app while maintaining a single codebase for the core functionality.

## Prerequisites

### For Android (APK)

- **Java Development Kit (JDK)**: Version 11 or higher
  - Download from [Oracle](https://www.oracle.com/java/technologies/downloads/) or use OpenJDK
  - Verify installation: `java -version`

- **Android Studio** (recommended) or **Android SDK Command-line Tools**
  - Download from [developer.android.com](https://developer.android.com/studio)
  - Ensure Android SDK is installed (API level 24 or higher)

- **Gradle**: Usually bundled with Android Studio
  - Verify installation: `gradle -version`

### For iOS (IPA)

- **macOS**: Required for iOS development
- **Xcode**: Version 13 or higher
  - Download from Mac App Store or [developer.apple.com](https://developer.apple.com/xcode/)
  - Install Xcode Command Line Tools: `xcode-select --install`

- **CocoaPods** (if dependencies require it):
  ```bash
  sudo gem install cocoapods
  ```

## Repository Structure

