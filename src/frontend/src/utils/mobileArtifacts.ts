// Mobile wrapper artifact paths and metadata
export const MOBILE_ARTIFACTS = {
  android: {
    filename: 'SafeSpace.apk',
    path: '/assets/mobile/dist/SafeSpace.apk',
    label: 'Android APK',
    platform: 'Android',
  },
  ios: {
    filename: 'SafeSpace.ipa',
    path: '/assets/mobile/dist/SafeSpace.ipa',
    label: 'iOS IPA',
    platform: 'iOS',
  },
} as const;

export const BUILD_GUIDE_PATH = '/mobile/MOBILE_BUILD.md';
export const DIST_DIRECTORY = 'frontend/public/assets/mobile/dist/';

/**
 * Check if a mobile artifact file exists by attempting to fetch it.
 * Uses HEAD request with cache-busting to avoid stale results.
 */
export async function checkArtifactExists(artifactPath: string): Promise<boolean> {
  try {
    // Add cache-busting query parameter to avoid stale cached responses
    const cacheBuster = `?t=${Date.now()}`;
    const response = await fetch(artifactPath + cacheBuster, { 
      method: 'HEAD',
      cache: 'no-cache',
    });
    return response.ok;
  } catch {
    return false;
  }
}
