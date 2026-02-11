import { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useFetchSwipeCandidates, useRecordSwipe } from '../../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { X, Heart, Sparkles, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import LoginButton from '../../components/auth/LoginButton';
import type { Selector } from '../../backend';

export default function SwipeMatching() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { data: candidates, isLoading, error, refetch } = useFetchSwipeCandidates();
  const recordSwipeMutation = useRecordSwipe();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const isAuthenticated = !!identity;
  const currentCandidate = candidates && candidates.length > 0 ? candidates[currentIndex] : null;
  const hasMoreCandidates = candidates && currentIndex < candidates.length;

  useEffect(() => {
    if (candidates && candidates.length > 0) {
      setCurrentIndex(0);
    }
  }, [candidates]);

  const handleSwipe = async (liked: boolean) => {
    if (!currentCandidate || !currentCandidate.pseudonym || isProcessing) return;

    setIsProcessing(true);

    try {
      if (liked) {
        const result = await recordSwipeMutation.mutateAsync(currentCandidate.pseudonym);
        
        // Check if this created a new match
        if (result.matches && result.matches.length > 0) {
          const isNewMatch = result.matches[result.matches.length - 1] === currentCandidate.pseudonym;
          if (isNewMatch) {
            toast.success(`It's a match with ${currentCandidate.pseudonym}! 🎉`);
          }
        }
      }

      // Move to next candidate
      if (currentIndex < (candidates?.length || 0) - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        // No more candidates, refetch
        await refetch();
      }
    } catch (error) {
      toast.error('Failed to record your choice. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="p-4 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Find Matches</CardTitle>
            <CardDescription>Sign in to start matching</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertDescription>
                Connect with other community members through mutual matching.
              </AlertDescription>
            </Alert>
            <LoginButton />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-4 space-y-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 space-y-4">
        <Button variant="ghost" onClick={() => navigate({ to: '/matches' })}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Matches
        </Button>
        <Alert variant="destructive">
          <AlertDescription>Failed to load candidates. Please try again later.</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!hasMoreCandidates || !currentCandidate) {
    return (
      <div className="p-4 space-y-4">
        <Button variant="ghost" onClick={() => navigate({ to: '/matches' })}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Matches
        </Button>

        <Card>
          <CardContent className="pt-6 text-center space-y-4">
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-muted-foreground" />
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-1">No more profiles</h3>
              <p className="text-sm text-muted-foreground">
                You've seen all available profiles. Check back later for new members!
              </p>
            </div>
            <Button onClick={() => navigate({ to: '/matches' })}>
              View your matches
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={() => navigate({ to: '/matches' })}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <p className="text-sm text-muted-foreground">
          {currentIndex + 1} of {candidates?.length || 0}
        </p>
      </div>

      <Card className="overflow-hidden">
        <div className="h-64 bg-gradient-to-br from-primary/20 via-accent/20 to-secondary/20 flex items-center justify-center">
          <div className="w-32 h-32 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center border-4 border-primary/30">
            <span className="text-6xl font-bold text-primary">
              {currentCandidate.pseudonym?.charAt(0).toUpperCase() || '?'}
            </span>
          </div>
        </div>
        <CardHeader>
          <CardTitle className="text-2xl">{currentCandidate.pseudonym || 'Anonymous'}</CardTitle>
          <CardDescription>Community member</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertDescription>
              If you both like each other, you'll be able to start a private encrypted chat.
            </AlertDescription>
          </Alert>

          <div className="flex gap-3">
            <Button
              variant="outline"
              size="lg"
              className="flex-1 h-16"
              onClick={() => handleSwipe(false)}
              disabled={isProcessing}
            >
              <X className="w-6 h-6 mr-2" />
              Pass
            </Button>
            <Button
              size="lg"
              className="flex-1 h-16 bg-gradient-to-r from-primary to-accent"
              onClick={() => handleSwipe(true)}
              disabled={isProcessing}
            >
              <Heart className="w-6 h-6 mr-2" />
              Like
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
