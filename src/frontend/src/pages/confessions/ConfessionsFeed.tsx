import { useNavigate } from '@tanstack/react-router';
import { useGetApprovedConfessions } from '../../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import ConfessionCard from '../../components/confessions/ConfessionCard';
import { Plus, Heart } from 'lucide-react';

export default function ConfessionsFeed() {
  const navigate = useNavigate();
  const { data: confessions, isLoading, error } = useGetApprovedConfessions();

  if (isLoading) {
    return (
      <div className="p-4 space-y-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-32 w-full" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <Alert variant="destructive">
          <AlertDescription>Failed to load confessions. Please try again.</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Confession Wall</h2>
          <p className="text-sm text-muted-foreground">Share your thoughts anonymously</p>
        </div>
        <Button onClick={() => navigate({ to: '/confessions/new' })} size="icon" className="rounded-full">
          <Plus className="w-5 h-5" />
        </Button>
      </div>

      {!confessions || confessions.length === 0 ? (
        <div className="text-center py-12 space-y-4">
          <Heart className="w-16 h-16 mx-auto text-muted-foreground/50" />
          <div>
            <h3 className="font-medium text-lg">No confessions yet</h3>
            <p className="text-sm text-muted-foreground mt-1">Be the first to share your story</p>
          </div>
          <Button onClick={() => navigate({ to: '/confessions/new' })}>
            Share a Confession
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {confessions.map((confession) => (
            <ConfessionCard key={confession.id.toString()} confession={confession} />
          ))}
        </div>
      )}
    </div>
  );
}
