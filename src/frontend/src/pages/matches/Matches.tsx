import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useGetUserMatches } from '../../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { MessageCircle, Sparkles, Heart } from 'lucide-react';
import LoginButton from '../../components/auth/LoginButton';

export default function Matches() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { data: matches, isLoading, error } = useGetUserMatches();

  const isAuthenticated = !!identity;

  if (!isAuthenticated) {
    return (
      <div className="p-4 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Matches</CardTitle>
            <CardDescription>Sign in to view your matches</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertDescription>
                Connect with other community members through mutual matching and start private conversations.
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
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <Alert variant="destructive">
          <AlertDescription>Failed to load matches. Please try again later.</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Your Matches</h2>
          <p className="text-sm text-muted-foreground">Connect with mutual matches</p>
        </div>
      </div>

      <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
        <CardContent className="pt-6">
          <Button
            onClick={() => navigate({ to: '/matches/swipe' })}
            className="w-full"
            size="lg"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Find matches
          </Button>
        </CardContent>
      </Card>

      {!matches || matches.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center space-y-4">
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                <Heart className="w-8 h-8 text-muted-foreground" />
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-1">No matches yet</h3>
              <p className="text-sm text-muted-foreground">
                Start swiping to find people you'd like to connect with
              </p>
            </div>
            <Button
              onClick={() => navigate({ to: '/matches/swipe' })}
              variant="outline"
            >
              Start matching
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {matches.map((matchPseudonym, index) => (
            <Card key={index} className="hover:border-primary/50 transition-colors">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                      <span className="text-lg font-semibold">
                        {matchPseudonym.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold">{matchPseudonym}</h3>
                      <p className="text-xs text-muted-foreground">Mutual match</p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => navigate({ to: `/chat/${encodeURIComponent(matchPseudonym)}` })}
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Open chat
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
