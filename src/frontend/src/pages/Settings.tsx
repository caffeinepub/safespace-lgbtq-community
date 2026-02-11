import { useNavigate } from '@tanstack/react-router';
import { useGetCallerUserProfile, useSaveCallerUserProfile } from '../hooks/useQueries';
import { useComplianceGate } from '../hooks/useComplianceGate';
import { useQuickTour } from '../hooks/useQuickTour';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, HelpCircle, Compass } from 'lucide-react';
import { toast } from 'sonner';
import type { UserProfile } from '../backend';

export default function Settings() {
  const navigate = useNavigate();
  const { data: userProfile } = useGetCallerUserProfile();
  const saveMutation = useSaveCallerUserProfile();
  const { reset: resetCompliance } = useComplianceGate();
  const { reset: resetQuickTour } = useQuickTour();

  const handleToggle = async (field: keyof UserProfile, value: boolean) => {
    if (!userProfile) return;

    const updatedProfile: UserProfile = {
      ...userProfile,
      [field]: value,
    };

    try {
      await saveMutation.mutateAsync(updatedProfile);
      toast.success('Settings updated');
    } catch (error) {
      toast.error('Failed to update settings');
    }
  };

  const handleReplayQuickTour = () => {
    resetQuickTour();
    toast.success('Quick Tour will show on next refresh');
    // Trigger a page reload to show the tour
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  return (
    <div className="p-4 space-y-4">
      <Button variant="ghost" onClick={() => navigate({ to: '/profile' })}>
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>

      <div>
        <h2 className="text-xl font-semibold">Settings</h2>
        <p className="text-sm text-muted-foreground">Manage your preferences</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Privacy</CardTitle>
          <CardDescription>Control your visibility and data</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Anonymous Posting</Label>
              <p className="text-xs text-muted-foreground">Post without revealing your identity</p>
            </div>
            <Switch
              checked={userProfile?.anonymousPosting ?? true}
              onCheckedChange={(checked) => handleToggle('anonymousPosting', checked)}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Hide Profile</Label>
              <p className="text-xs text-muted-foreground">Make your profile private</p>
            </div>
            <Switch
              checked={userProfile?.hideProfile ?? false}
              onCheckedChange={(checked) => handleToggle('hideProfile', checked)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Notifications</CardTitle>
          <CardDescription>Manage how you receive updates</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Push Notifications</Label>
            <Switch checked={userProfile?.notificationPrefs?.push ?? false} disabled />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <Label>Email Notifications</Label>
            <Switch checked={userProfile?.notificationPrefs?.email ?? false} disabled />
          </div>
          <p className="text-xs text-muted-foreground">Notification features coming soon</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Support</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button variant="outline" className="w-full justify-start" onClick={() => navigate({ to: '/help' })}>
            <HelpCircle className="w-4 h-4 mr-2" />
            Help & Safety Guidelines
          </Button>
          <Button variant="outline" className="w-full justify-start" onClick={handleReplayQuickTour}>
            <Compass className="w-4 h-4 mr-2" />
            Replay Quick Tour
          </Button>
          <Button variant="outline" className="w-full justify-start" onClick={resetCompliance}>
            View Safety Information
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
