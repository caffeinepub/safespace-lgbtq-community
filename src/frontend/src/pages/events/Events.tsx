import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Plus } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { useIsCallerAdmin } from '../../hooks/useQueries';

export default function Events() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<'all' | 'online' | 'offline'>('all');
  const { data: isAdmin } = useIsCallerAdmin();

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Upcoming Events</h2>
          <p className="text-sm text-muted-foreground">Connect with the community</p>
        </div>
        {isAdmin && (
          <Button onClick={() => navigate({ to: '/events/new' })} size="icon" className="rounded-full">
            <Plus className="w-5 h-5" />
          </Button>
        )}
      </div>

      <div className="flex gap-2">
        <Badge
          variant={filter === 'all' ? 'default' : 'outline'}
          className="cursor-pointer"
          onClick={() => setFilter('all')}
        >
          All
        </Badge>
        <Badge
          variant={filter === 'online' ? 'default' : 'outline'}
          className="cursor-pointer"
          onClick={() => setFilter('online')}
        >
          Online
        </Badge>
        <Badge
          variant={filter === 'offline' ? 'default' : 'outline'}
          className="cursor-pointer"
          onClick={() => setFilter('offline')}
        >
          In-Person
        </Badge>
      </div>

      <div className="text-center py-12 space-y-4">
        <Calendar className="w-16 h-16 mx-auto text-muted-foreground/50" />
        <div>
          <h3 className="font-medium text-lg">No upcoming events</h3>
          <p className="text-sm text-muted-foreground mt-1">Check back soon for community events</p>
        </div>
      </div>
    </div>
  );
}
