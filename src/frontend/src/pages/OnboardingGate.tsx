import { useState } from 'react';
import { useComplianceGate } from '../hooks/useComplianceGate';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Heart, Shield, Users } from 'lucide-react';

export default function OnboardingGate() {
  const { accept } = useComplianceGate();
  const [ageConfirmed, setAgeConfirmed] = useState(false);
  const [guidelinesConfirmed, setGuidelinesConfirmed] = useState(false);
  const [error, setError] = useState('');

  const handleContinue = () => {
    if (!ageConfirmed || !guidelinesConfirmed) {
      setError('Please confirm both checkboxes to continue');
      return;
    }
    accept();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
            <Heart className="w-10 h-10 text-primary" />
          </div>
          <CardTitle className="text-2xl">Welcome to SafeSpace</CardTitle>
          <CardDescription className="text-base">
            A safe and anonymous community for LGBTQ+ individuals to connect, share, and support each other.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex gap-3">
              <Shield className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div className="text-sm text-muted-foreground">
                <strong className="text-foreground">Privacy First:</strong> Your identity is protected. All posts are anonymous by default.
              </div>
            </div>
            <div className="flex gap-3">
              <Users className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div className="text-sm text-muted-foreground">
                <strong className="text-foreground">Moderated Community:</strong> Content is reviewed to ensure a safe and supportive environment.
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t">
            <div className="flex items-start gap-3">
              <Checkbox
                id="age"
                checked={ageConfirmed}
                onCheckedChange={(checked) => setAgeConfirmed(checked === true)}
              />
              <label htmlFor="age" className="text-sm leading-relaxed cursor-pointer">
                I confirm that I am 18 years of age or older
              </label>
            </div>
            <div className="flex items-start gap-3">
              <Checkbox
                id="guidelines"
                checked={guidelinesConfirmed}
                onCheckedChange={(checked) => setGuidelinesConfirmed(checked === true)}
              />
              <label htmlFor="guidelines" className="text-sm leading-relaxed cursor-pointer">
                I agree to use this platform respectfully and understand that inappropriate content will be moderated
              </label>
            </div>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter>
          <Button onClick={handleContinue} className="w-full" size="lg">
            Enter SafeSpace
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
