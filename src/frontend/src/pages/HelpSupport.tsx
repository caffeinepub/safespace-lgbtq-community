import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { ArrowLeft, AlertTriangle } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';

export default function HelpSupport() {
  const navigate = useNavigate();

  return (
    <div className="p-4 space-y-4">
      <Button variant="ghost" onClick={() => navigate({ to: '/settings' })}>
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>

      <div>
        <h2 className="text-xl font-semibold">Help & Support</h2>
        <p className="text-sm text-muted-foreground">Safety guidelines and resources</p>
      </div>

      <Alert>
        <AlertTriangle className="w-4 h-4" />
        <AlertDescription>
          If you're in crisis, please contact The Trevor Project at 1-866-488-7386 or text START to 678-678.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Community Guidelines</CardTitle>
          <CardDescription>How to keep SafeSpace safe for everyone</CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="respect">
              <AccordionTrigger>Be Respectful</AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">
                Treat all community members with kindness and respect. Harassment, bullying, and hate speech are not
                tolerated and will result in content removal.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="privacy">
              <AccordionTrigger>Protect Privacy</AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">
                Never share personal information about yourself or others. This includes real names, addresses, phone
                numbers, or identifying details.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="reporting">
              <AccordionTrigger>Report Concerns</AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">
                If you see content that violates our guidelines, please report it. Our moderation team reviews all
                reports and takes appropriate action.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="moderation">
              <AccordionTrigger>Content Moderation</AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">
                All posts are reviewed before appearing publicly. This helps maintain a safe environment. Content that
                violates guidelines will be hidden or removed.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">How to Report Content</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>1. Click the "Report" button on any confession or discussion post</p>
          <p>2. Select the reason for your report</p>
          <p>3. Optionally provide additional context</p>
          <p>4. Submit your report for moderator review</p>
          <p className="pt-2 text-xs">
            Reports are anonymous and help us maintain a safe community. Thank you for helping keep SafeSpace safe.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
