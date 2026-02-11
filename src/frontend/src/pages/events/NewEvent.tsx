import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import RequireAdmin from '../../components/auth/RequireAdmin';
import { toast } from 'sonner';

export default function NewEvent() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [eventType, setEventType] = useState('');
  const [location, setLocation] = useState('');

  const handleSubmit = () => {
    if (!title.trim() || !description.trim() || !eventType) {
      toast.error('Please fill in all required fields');
      return;
    }
    toast.success('Event created (feature coming soon)');
    navigate({ to: '/events' });
  };

  return (
    <RequireAdmin>
      <div className="p-4">
        <Card>
          <CardHeader>
            <CardTitle>Create Event</CardTitle>
            <CardDescription>Add a new community event</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Event Title</Label>
              <Input placeholder="Pride Meetup" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Event Type</Label>
              <Select value={eventType} onValueChange={setEventType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="online">Online</SelectItem>
                  <SelectItem value="offline">In-Person</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {eventType === 'offline' && (
              <div className="space-y-2">
                <Label>Location</Label>
                <Input placeholder="City, State" value={location} onChange={(e) => setLocation(e.target.value)} />
              </div>
            )}
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                placeholder="Event details..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
              />
            </div>
          </CardContent>
          <CardFooter className="flex gap-2">
            <Button variant="outline" onClick={() => navigate({ to: '/events' })} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleSubmit} className="flex-1">
              Create Event
            </Button>
          </CardFooter>
        </Card>
      </div>
    </RequireAdmin>
  );
}
