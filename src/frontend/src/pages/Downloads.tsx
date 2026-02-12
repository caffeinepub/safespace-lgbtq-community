import { useEffect, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, Download, Smartphone, Info, ExternalLink, Copy, Check } from 'lucide-react';
import { MOBILE_ARTIFACTS, checkArtifactExists, DIST_DIRECTORY, BUILD_GUIDE_PATH } from '../utils/mobileArtifacts';

type ArtifactStatus = {
  android: boolean;
  ios: boolean;
  loading: boolean;
};

export default function Downloads() {
  const navigate = useNavigate();
  const [artifactStatus, setArtifactStatus] = useState<ArtifactStatus>({
    android: false,
    ios: false,
    loading: true,
  });
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  useEffect(() => {
    async function checkArtifacts() {
      const [androidExists, iosExists] = await Promise.all([
        checkArtifactExists(MOBILE_ARTIFACTS.android.path),
        checkArtifactExists(MOBILE_ARTIFACTS.ios.path),
      ]);

      setArtifactStatus({
        android: androidExists,
        ios: iosExists,
        loading: false,
      });
    }

    checkArtifacts();
  }, []);

  const handleDownload = (artifactPath: string, filename: string) => {
    const link = document.createElement('a');
    link.href = artifactPath;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyUrl = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedUrl(url);
      setTimeout(() => setCopiedUrl(null), 2000);
    } catch (error) {
      console.error('Failed to copy URL:', error);
    }
  };

  const getFullUrl = (path: string) => {
    return `${window.location.origin}${path}`;
  };

  return (
    <div className="p-4 space-y-4">
      <Button variant="ghost" onClick={() => navigate({ to: '/settings' })}>
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>

      <div>
        <h2 className="text-xl font-semibold">Mobile App Downloads</h2>
        <p className="text-sm text-muted-foreground">Native mobile wrapper packages for SafeSpace</p>
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          These are unsigned mobile wrapper applications for local testing and development. They load the SafeSpace web app in a native WebView.
        </AlertDescription>
      </Alert>

      {artifactStatus.loading ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">Checking for available downloads...</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {/* Android APK */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Smartphone className="w-5 h-5" />
                {MOBILE_ARTIFACTS.android.label}
              </CardTitle>
              <CardDescription>Unsigned Android application package</CardDescription>
            </CardHeader>
            <CardContent>
              {artifactStatus.android ? (
                <div className="space-y-3">
                  <Button
                    className="w-full"
                    onClick={() => handleDownload(MOBILE_ARTIFACTS.android.path, MOBILE_ARTIFACTS.android.filename)}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download {MOBILE_ARTIFACTS.android.filename}
                  </Button>
                  
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-muted-foreground">Direct URL:</p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-muted px-3 py-2 rounded-md">
                        <code className="text-xs break-all select-all">
                          {getFullUrl(MOBILE_ARTIFACTS.android.path)}
                        </code>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCopyUrl(getFullUrl(MOBILE_ARTIFACTS.android.path))}
                      >
                        {copiedUrl === getFullUrl(MOBILE_ARTIFACTS.android.path) ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    The Android APK is not available yet. To build it locally:
                  </p>
                  <ol className="text-sm text-muted-foreground list-decimal list-inside space-y-1 ml-2">
                    <li>Follow the build instructions in the mobile build guide</li>
                    <li>Run the Android build commands to generate the unsigned APK</li>
                    <li>Copy the resulting APK file to <code className="text-xs bg-muted px-1 py-0.5 rounded">{DIST_DIRECTORY}</code> as <code className="text-xs bg-muted px-1 py-0.5 rounded">{MOBILE_ARTIFACTS.android.filename}</code></li>
                    <li>Refresh this page to see the download link</li>
                  </ol>
                  <div className="flex items-center gap-2 mt-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(BUILD_GUIDE_PATH, '_blank')}
                    >
                      <ExternalLink className="w-3 h-3 mr-1" />
                      View Build Guide
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* iOS IPA */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Smartphone className="w-5 h-5" />
                {MOBILE_ARTIFACTS.ios.label}
              </CardTitle>
              <CardDescription>Unsigned iOS application package</CardDescription>
            </CardHeader>
            <CardContent>
              {artifactStatus.ios ? (
                <div className="space-y-3">
                  <Button
                    className="w-full"
                    onClick={() => handleDownload(MOBILE_ARTIFACTS.ios.path, MOBILE_ARTIFACTS.ios.filename)}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download {MOBILE_ARTIFACTS.ios.filename}
                  </Button>
                  
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-muted-foreground">Direct URL:</p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-muted px-3 py-2 rounded-md">
                        <code className="text-xs break-all select-all">
                          {getFullUrl(MOBILE_ARTIFACTS.ios.path)}
                        </code>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCopyUrl(getFullUrl(MOBILE_ARTIFACTS.ios.path))}
                      >
                        {copiedUrl === getFullUrl(MOBILE_ARTIFACTS.ios.path) ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    The iOS IPA is not available yet. To build it locally:
                  </p>
                  <ol className="text-sm text-muted-foreground list-decimal list-inside space-y-1 ml-2">
                    <li>Follow the build instructions in the mobile build guide</li>
                    <li>Run the iOS build commands to generate the unsigned IPA</li>
                    <li>Copy the resulting IPA file to <code className="text-xs bg-muted px-1 py-0.5 rounded">{DIST_DIRECTORY}</code> as <code className="text-xs bg-muted px-1 py-0.5 rounded">{MOBILE_ARTIFACTS.ios.filename}</code></li>
                    <li>Refresh this page to see the download link</li>
                  </ol>
                  <div className="flex items-center gap-2 mt-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(BUILD_GUIDE_PATH, '_blank')}
                    >
                      <ExternalLink className="w-3 h-3 mr-1" />
                      View Build Guide
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription className="text-xs">
          <strong>Important:</strong> These unsigned packages are for development and testing only. For production deployment,
          you must sign the packages with your developer certificates and submit them to the respective app stores.
        </AlertDescription>
      </Alert>

      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="text-sm">Need Help?</CardTitle>
        </CardHeader>
        <CardContent className="text-xs text-muted-foreground space-y-2">
          <p>
            For detailed build instructions, prerequisites, troubleshooting, and production distribution guidance, see the comprehensive mobile build guide.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(BUILD_GUIDE_PATH, '_blank')}
          >
            <ExternalLink className="w-3 h-3 mr-1" />
            Open Mobile Build Guide
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
