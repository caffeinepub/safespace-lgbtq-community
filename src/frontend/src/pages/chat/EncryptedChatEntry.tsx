import { useNavigate, useParams } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Lock, ArrowLeft, MessageCircle } from 'lucide-react';

export default function EncryptedChatEntry() {
  const navigate = useNavigate();
  const { matchId } = useParams({ strict: false });

  const decodedMatchId = matchId ? decodeURIComponent(matchId) : 'Unknown';

  return (
    <div className="p-4 space-y-4">
      <Button variant="ghost" onClick={() => navigate({ to: '/matches' })}>
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Matches
      </Button>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
              <span className="text-lg font-semibold">
                {decodedMatchId.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <CardTitle>{decodedMatchId}</CardTitle>
              <CardDescription>Encrypted chat</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <Lock className="w-4 h-4" />
            <AlertDescription>
              This is an end-to-end encrypted chat. Only you and {decodedMatchId} can read these messages.
            </AlertDescription>
          </Alert>

          <div className="text-center py-8 space-y-4">
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                <MessageCircle className="w-8 h-8 text-muted-foreground" />
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-1">Chat interface coming soon</h3>
              <p className="text-sm text-muted-foreground">
                The encrypted messaging feature is being finalized. You'll be able to send secure messages here soon.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
