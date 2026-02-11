import { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useGetCallerUserProfile, useSaveCallerUserProfile, useIsCallerAdmin } from '../../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Settings, Shield, Loader2, Heart } from 'lucide-react';
import { toast } from 'sonner';
import LoginButton from '../../components/auth/LoginButton';
import type { UserProfile } from '../../backend';

export default function Profile() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const { data: isAdmin } = useIsCallerAdmin();
  const saveMutation = useSaveCallerUserProfile();

  const [pseudonym, setPseudonym] = useState('');
  const [pronouns, setPronouns] = useState('');
  const [interests, setInterests] = useState('');

  const isAuthenticated = !!identity;

  useEffect(() => {
    if (userProfile) {
      setPseudonym(userProfile.pseudonym || '');
      setPronouns(userProfile.pronouns || '');
      setInterests(userProfile.interests.join(', '));
    }
  }, [userProfile]);

  const handleSave = async () => {
    if (!pseudonym.trim()) {
      toast.error('Please enter a pseudonym');
      return;
    }

    const profile: UserProfile = {
      pseudonym: pseudonym.trim(),
      pronouns: pronouns.trim() || undefined,
      interests: interests.split(',').map((i) => i.trim()).filter(Boolean),
      hideProfile: userProfile?.hideProfile || false,
      anonymousPosting: userProfile?.anonymousPosting ?? true,
      notificationPrefs: userProfile?.notificationPrefs || { email: false, sms: false, push: false },
    };

    try {
      await saveMutation.mutateAsync(profile);
      toast.success('Profile saved successfully');
    } catch (error) {
      toast.error('Failed to save profile');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="p-4 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>Sign in to create your profile</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertDescription>
                Your profile is private and only used to personalize your experience. All posts remain anonymous.
              </AlertDescription>
            </Alert>
            <LoginButton />
          </CardContent>
        </Card>
      </div>
    );
  }

  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  if (profileLoading) {
    return (
      <div className="p-4 space-y-4">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Profile</h2>
          <p className="text-sm text-muted-foreground">Manage your identity</p>
        </div>
        <Button variant="ghost" size="icon" onClick={() => navigate({ to: '/settings' })}>
          <Settings className="w-5 h-5" />
        </Button>
      </div>

      {showProfileSetup && (
        <Alert>
          <AlertDescription>Welcome! Please set up your profile to get started.</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Your Information</CardTitle>
          <CardDescription>This information is private and never shared publicly</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Pseudonym *</Label>
            <Input
              placeholder="Choose a name"
              value={pseudonym}
              onChange={(e) => setPseudonym(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Pronouns (optional)</Label>
            <Input
              placeholder="e.g., they/them, she/her, he/him"
              value={pronouns}
              onChange={(e) => setPronouns(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Interests (optional)</Label>
            <Input
              placeholder="Separate with commas"
              value={interests}
              onChange={(e) => setInterests(e.target.value)}
            />
          </div>
          <Button onClick={handleSave} disabled={saveMutation.isPending} className="w-full">
            {saveMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Save Profile
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Heart className="w-4 h-4" />
            Matches
          </CardTitle>
          <CardDescription>Connect with other community members</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => navigate({ to: '/matches' })} variant="outline" className="w-full">
            View Matches
          </Button>
        </CardContent>
      </Card>

      {isAdmin && (
        <Card className="border-primary/50">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Moderator Access
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate({ to: '/moderator' })} variant="outline" className="w-full">
              Open Moderator Dashboard
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="pt-4">
        <LoginButton />
      </div>
    </div>
  );
}
