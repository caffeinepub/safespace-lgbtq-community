import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';
import { toast } from 'sonner';

export default function NewThread() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');

  const handleSubmit = () => {
    if (!title.trim() || !content.trim() || !category) {
      toast.error('Please fill in all fields');
      return;
    }
    toast.success('Discussion created (feature coming soon)');
    navigate({ to: '/discussions' });
  };

  return (
    <div className="p-4">
      <Card>
        <CardHeader>
          <CardTitle>Start a Discussion</CardTitle>
          <CardDescription>Share your thoughts and connect with others</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <Info className="w-4 h-4" />
            <AlertDescription className="text-xs">
              All discussions are anonymous and moderated for safety.
            </AlertDescription>
          </Alert>
          <div className="space-y-2">
            <Label>Title</Label>
            <Input
              placeholder="What's on your mind?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dating">Dating Advice</SelectItem>
                <SelectItem value="coming-out">Coming Out</SelectItem>
                <SelectItem value="friendship">Friendship</SelectItem>
                <SelectItem value="mental-health">Mental Health</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Your thoughts</Label>
            <Textarea
              placeholder="Share more details..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={6}
            />
          </div>
        </CardContent>
        <CardFooter className="flex gap-2">
          <Button variant="outline" onClick={() => navigate({ to: '/discussions' })} className="flex-1">
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="flex-1">
            Create Discussion
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
