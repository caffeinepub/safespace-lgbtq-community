# Mobile Wrapper Branding Assets

This document describes how to use the generated branding assets when packaging SafeSpace as Android (APK) or iOS (IPA) web-view wrapper applications.

## Generated Assets

The following branding assets are available in the `frontend/public/assets/generated/` directory:

### App Icon
- **File**: `app-icon.dim_1024x1024.png`
- **Dimensions**: 1024×1024 pixels
- **Usage**: Application icon for both Android and iOS
- **Description**: Colorful gradient icon with abstract design matching the app's vibrant theme

### Splash Screen
- **File**: `splash-screen.dim_2732x2732.png`
- **Dimensions**: 2732×2732 pixels
- **Usage**: Launch/splash screen for both Android and iOS
- **Description**: Colorful gradient background with subtle abstract shapes

## How to Use in Web-View Wrappers

### For Android (APK)

When creating an Android web-view wrapper (e.g., using Capacitor, Cordova, or similar tools):

1. **App Icon**: Copy `app-icon.dim_1024x1024.png` to your Android project's icon resources
   - Generate adaptive icons using Android Studio or online tools
   - Place in `android/app/src/main/res/` directories (mipmap-*)

2. **Splash Screen**: Copy `splash-screen.dim_2732x2732.png` to your splash screen resources
   - Configure in `android/app/src/main/res/drawable/` or via Capacitor/Cordova splash plugin
   - Set appropriate scaling and background color in configuration

### For iOS (IPA)

When creating an iOS web-view wrapper:

1. **App Icon**: Copy `app-icon.dim_1024x1024.png` to your iOS project
   - Add to `Assets.xcassets/AppIcon.appiconset/`
   - iOS will automatically generate required sizes

2. **Splash Screen**: Copy `splash-screen.dim_2732x2732.png` to your launch screen resources
   - Add to `Assets.xcassets/LaunchImage.launchimage/` or configure via storyboard
   - Ensure proper scaling for different device sizes

## Asset Characteristics

- **Style**: Colorful gradient design with vibrant magenta, purple, and cyan tones
- **Theme**: Inclusive, welcoming, and modern aesthetic matching SafeSpace's LGBTQ+ community focus
- **Format**: PNG with transparency support
- **Quality**: High resolution suitable for all device sizes

## Static Asset References

These assets are also referenced in the web application:
- The app icon is linked in `frontend/index.html` as favicon and apple-touch-icon
- Assets are served from `/assets/generated/` path at runtime

## Notes

- These are purely visual branding assets with no sensitive or identifying content
- Assets match the app's colorful gradient theme established in the UI design system
- No backend changes are required for branding asset usage
- Assets are static and do not require dynamic generation or user data
