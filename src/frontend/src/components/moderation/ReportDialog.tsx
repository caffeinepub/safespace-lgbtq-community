import { useState } from 'react';
import { useReportConfession } from '../../hooks/useQueries';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface ReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contentId: bigint;
  contentType: 'confession' | 'thread' | 'post';
}

export default function ReportDialog({ open, onOpenChange, contentId, contentType }: ReportDialogProps) {
  const [reason, setReason] = useState('');
  const [note, setNote] = useState('');
  const reportMutation = useReportConfession();

  const handleSubmit = async () => {
    if (!reason) {
      toast.error('Please select a reason');
      return;
    }

    try {
      const fullReason = note ? `${reason}: ${note}` : reason;
      await reportMutation.mutateAsync({ confessionId: contentId, reason: fullReason });
      toast.success('Report submitted. Thank you for helping keep our community safe.');
      onOpenChange(false);
      setReason('');
      setNote('');
    } catch (error) {
      toast.error('Failed to submit report');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Report Content</DialogTitle>
          <DialogDescription>
            Help us maintain a safe community by reporting inappropriate content.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Reason</Label>
            <Select value={reason} onValueChange={setReason}>
              <SelectTrigger>
                <SelectValue placeholder="Select a reason" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="harassment">Harassment or bullying</SelectItem>
                <SelectItem value="hate-speech">Hate speech</SelectItem>
                <SelectItem value="spam">Spam or misleading</SelectItem>
                <SelectItem value="inappropriate">Inappropriate content</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Additional details (optional)</Label>
            <Textarea
              placeholder="Provide more context..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={reportMutation.isPending}>
            {reportMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Submit Report
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
