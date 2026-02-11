import { useState } from 'react';
import { useGetReportedConfessions, useUpdateConfessionStatus, useRecordModerationAction } from '../../hooks/useQueries';
import RequireAdmin from '../../components/auth/RequireAdmin';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { CheckCircle, XCircle, EyeOff, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import { ContentType, ContentStatus, ModerationActionType, type Confession } from '../../backend';

export default function ModeratorDashboard() {
  return (
    <RequireAdmin>
      <ModeratorDashboardContent />
    </RequireAdmin>
  );
}

function ModeratorDashboardContent() {
  const { data: reportedConfessions, isLoading } = useGetReportedConfessions();
  const updateStatusMutation = useUpdateConfessionStatus();
  const recordActionMutation = useRecordModerationAction();
  const [selectedConfession, setSelectedConfession] = useState<bigint | null>(null);
  const [moderationNote, setModerationNote] = useState('');

  const handleModeration = async (
    confession: Confession,
    status: ContentStatus,
    actionType: ModerationActionType
  ) => {
    try {
      await updateStatusMutation.mutateAsync({ id: confession.id, status });
      await recordActionMutation.mutateAsync({
        contentId: confession.id,
        contentType: ContentType.confession,
        actionType: actionType,
        note: moderationNote || undefined,
      });
      toast.success(`Confession ${status}`);
      setSelectedConfession(null);
      setModerationNote('');
    } catch (error) {
      toast.error('Failed to update confession');
    }
  };

  if (isLoading) {
    return (
      <div className="p-4 space-y-4">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <div>
        <h2 className="text-xl font-semibold">Moderator Dashboard</h2>
        <p className="text-sm text-muted-foreground">Review and manage reported content</p>
      </div>

      <Tabs defaultValue="reported">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="reported">
            Reported ({reportedConfessions?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
        </TabsList>

        <TabsContent value="reported" className="space-y-3 mt-4">
          {!reportedConfessions || reportedConfessions.length === 0 ? (
            <Alert>
              <AlertDescription>No reported content to review</AlertDescription>
            </Alert>
          ) : (
            reportedConfessions.map((confession) => (
              <Card key={confession.id.toString()}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-sm font-medium">
                        Confession #{confession.id.toString()}
                      </CardTitle>
                      <CardDescription className="text-xs">
                        {formatDistanceToNow(new Date(Number(confession.timestamp) / 1000000), { addSuffix: true })}
                      </CardDescription>
                    </div>
                    <Badge variant="destructive">
                      <AlertTriangle className="w-3 h-3 mr-1" />
                      {confession.reports.length} report{confession.reports.length !== 1 ? 's' : ''}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm">{confession.content}</p>

                  {confession.reports.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-xs font-medium">Reports:</p>
                      {confession.reports.map((report, idx) => (
                        <div key={idx} className="text-xs text-muted-foreground bg-muted p-2 rounded">
                          {report.reason}
                        </div>
                      ))}
                    </div>
                  )}

                  {selectedConfession === confession.id && (
                    <Textarea
                      placeholder="Add moderation note (optional)"
                      value={moderationNote}
                      onChange={(e) => setModerationNote(e.target.value)}
                      rows={2}
                      className="text-sm"
                    />
                  )}

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedConfession(confession.id);
                        handleModeration(confession, ContentStatus.approved, ModerationActionType.approve);
                      }}
                      disabled={updateStatusMutation.isPending}
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedConfession(confession.id);
                        handleModeration(confession, ContentStatus.hidden, ModerationActionType.hide);
                      }}
                      disabled={updateStatusMutation.isPending}
                    >
                      <EyeOff className="w-4 h-4 mr-1" />
                      Hide
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => {
                        setSelectedConfession(confession.id);
                        handleModeration(confession, ContentStatus.rejected, ModerationActionType.reject);
                      }}
                      disabled={updateStatusMutation.isPending}
                    >
                      <XCircle className="w-4 h-4 mr-1" />
                      Reject
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="pending" className="mt-4">
          <Alert>
            <AlertDescription>Pending queue coming soon</AlertDescription>
          </Alert>
        </TabsContent>
      </Tabs>
    </div>
  );
}
