# Specification

## Summary
**Goal:** Refresh the app UI with a colorful gradient-forward theme while keeping all existing layouts/routes unchanged, and add simple mobile wrapper branding assets (icon + splash) with usage documentation for Android/iOS packaging.

**Planned changes:**
- Update global theme styling (colors, fonts, CSS variables) to a colorful gradient look with readable contrast in both light and dark mode, without changing any screen layouts or routes.
- Restyle buttons (primary and outline variants) to match the new gradient theme, including hover/active/focus states, while continuing to use existing Shadcn components (no edits inside `frontend/src/components/ui`).
- Apply the refreshed styling consistently to shared layout elements (MobileScaffold header visuals and BottomNav active-state styling) without changing their structure, labels, or icons.
- Generate and add default mobile branding images (app icon and splash screen) under `frontend/public/assets/generated`.
- Add a short in-repo English doc describing how to use the generated icon and splash assets when building Android (APK) and iOS (IPA) web-view wrappers.

**User-visible outcome:** The app retains the same navigation and screens but has a more attractive colorful gradient UI, plus included default icon and splash assets with guidance for Android/iOS web-view wrapper builds.
