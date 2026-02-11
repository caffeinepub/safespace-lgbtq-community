import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, MessageCircle } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';

export default function Discussions() {
  const navigate = useNavigate();

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Discussion Rooms</h2>
          <p className="text-sm text-muted-foreground">Connect with the community</p>
        </div>
        <Button onClick={() => navigate({ to: '/discussions/new' })} size="icon" className="rounded-full">
          <Plus className="w-5 h-5" />
        </Button>
      </div>

      <div className="flex gap-2 flex-wrap">
        <Badge variant="outline">All</Badge>
        <Badge variant="outline">Dating Advice</Badge>
        <Badge variant="outline">Coming Out</Badge>
        <Badge variant="outline">Friendship</Badge>
        <Badge variant="outline">Mental Health</Badge>
      </div>

      <div className="text-center py-12 space-y-4">
        <MessageCircle className="w-16 h-16 mx-auto text-muted-foreground/50" />
        <div>
          <h3 className="font-medium text-lg">No discussions yet</h3>
          <p className="text-sm text-muted-foreground mt-1">Start a conversation with the community</p>
        </div>
        <Button onClick={() => navigate({ to: '/discussions/new' })}>
          Start a Discussion
        </Button>
      </div>
    </div>
  );
}
