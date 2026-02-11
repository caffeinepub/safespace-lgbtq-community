import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useSubmitConfession } from '../../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Info } from 'lucide-react';
import { toast } from 'sonner';

export default function NewConfession() {
  const navigate = useNavigate();
  const [content, setContent] = useState('');
  const submitMutation = useSubmitConfession();

  const handleSubmit = async () => {
    if (!content.trim()) {
      toast.error('Please write something before submitting');
      return;
    }

    try {
      await submitMutation.mutateAsync(content);
      toast.success('Confession submitted for review');
      navigate({ to: '/confessions' });
    } catch (error) {
      toast.error('Failed to submit confession');
    }
  };

  return (
    <div className="p-4">
      <Card>
        <CardHeader>
          <CardTitle>Share Your Story</CardTitle>
          <CardDescription>Your confession will be posted anonymously after review</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <Info className="w-4 h-4" />
            <AlertDescription className="text-xs">
              All confessions are reviewed by moderators before appearing publicly to ensure a safe environment.
            </AlertDescription>
          </Alert>
          <Textarea
            placeholder="Share what's on your mind... This is a safe space."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={8}
            className="resize-none"
          />
        </CardContent>
        <CardFooter className="flex gap-2">
          <Button variant="outline" onClick={() => navigate({ to: '/confessions' })} className="flex-1">
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={submitMutation.isPending} className="flex-1">
            {submitMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Submit
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
