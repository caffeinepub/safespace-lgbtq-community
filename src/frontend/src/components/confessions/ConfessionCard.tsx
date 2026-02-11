import { useState } from 'react';
import type { Confession } from '../../backend';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Flag } from 'lucide-react';
import ReportDialog from '../moderation/ReportDialog';
import { formatDistanceToNow } from 'date-fns';

interface ConfessionCardProps {
  confession: Confession;
}

export default function ConfessionCard({ confession }: ConfessionCardProps) {
  const [showReportDialog, setShowReportDialog] = useState(false);

  const timestamp = new Date(Number(confession.timestamp) / 1000000);

  return (
    <>
      <Card>
        <CardContent className="pt-4 space-y-3">
          <p className="text-sm leading-relaxed">{confession.content}</p>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Anonymous • {formatDistanceToNow(timestamp, { addSuffix: true })}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowReportDialog(true)}
              className="h-7 text-xs"
            >
              <Flag className="w-3 h-3 mr-1" />
              Report
            </Button>
          </div>
        </CardContent>
      </Card>
      <ReportDialog
        open={showReportDialog}
        onOpenChange={setShowReportDialog}
        contentId={confession.id}
        contentType="confession"
      />
    </>
  );
}
