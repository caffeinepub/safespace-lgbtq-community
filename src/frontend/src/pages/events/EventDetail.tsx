import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';

export default function EventDetail() {
  const navigate = useNavigate();

  return (
    <div className="p-4 space-y-4">
      <Button variant="ghost" onClick={() => navigate({ to: '/events' })}>
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>
      <Card>
        <CardContent className="pt-4">
          <p className="text-muted-foreground">Event details coming soon</p>
        </CardContent>
      </Card>
    </div>
  );
}
