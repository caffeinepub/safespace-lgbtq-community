# Specification

## Summary
**Goal:** Provide real, working in-app download links for Android (APK) and iOS (IPA) on the Downloads screen.

**Planned changes:**
- Add the mobile wrapper artifacts to `frontend/public/assets/mobile/dist/SafeSpace.apk` and `frontend/public/assets/mobile/dist/SafeSpace.ipa` so they are served at `/assets/mobile/dist/SafeSpace.apk` and `/assets/mobile/dist/SafeSpace.ipa`.
- Update the `/downloads` page to show enabled download buttons when each artifact is present and ensure downloads use the correct filenames.
- When an artifact is available, display a visible, selectable/copyable direct URL for each artifact on the `/downloads` page.

**User-visible outcome:** Visiting `/downloads` shows working download buttons for Android and iOS, and also shows copyable direct URLs to the APK and IPA files.
