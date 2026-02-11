import { useState } from 'react';
import { useQuickTour } from '../../hooks/useQuickTour';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Navigation, Flag, ChevronRight, ChevronLeft } from 'lucide-react';

const tourSteps = [
  {
    icon: Shield,
    title: 'Your Privacy Matters',
    description: 'SafeSpace is built with your privacy in mind. All confessions and posts are anonymous by default. Your identity is never revealed unless you choose to share it in your profile.',
    details: 'You can browse, post, and interact without worrying about being identified. We believe everyone deserves a safe space to express themselves freely.',
  },
  {
    icon: Navigation,
    title: 'Navigate with Ease',
    description: 'Use the bottom navigation bar to explore different sections of SafeSpace.',
    details: 'Tap Confessions to read and share anonymous thoughts, Discussions for community conversations, Resources for helpful links, Events to find gatherings, and Profile to manage your settings.',
  },
  {
    icon: Flag,
    title: 'Keep Our Space Safe',
    description: 'If you see content that violates our community guidelines or makes you uncomfortable, you can report it.',
    details: 'Every confession and post has a report button. Our moderation team reviews all reports to ensure SafeSpace remains supportive and welcoming for everyone.',
  },
];

export default function QuickTour() {
  const { complete } = useQuickTour();
  const [currentStep, setCurrentStep] = useState(0);

  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === tourSteps.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      complete();
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(0, prev - 1));
  };

  const handleSkip = () => {
    complete();
  };

  const step = tourSteps[currentStep];
  const Icon = step.icon;

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
            <Icon className="w-10 h-10 text-primary" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-center gap-1.5 mb-2">
              {tourSteps.map((_, index) => (
                <div
                  key={index}
                  className={`h-1.5 rounded-full transition-all ${
                    index === currentStep
                      ? 'w-8 bg-primary'
                      : index < currentStep
                      ? 'w-1.5 bg-primary/50'
                      : 'w-1.5 bg-muted'
                  }`}
                />
              ))}
            </div>
            <CardTitle className="text-2xl">{step.title}</CardTitle>
            <CardDescription className="text-base">{step.description}</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground leading-relaxed">{step.details}</p>
        </CardContent>
        <CardFooter className="flex flex-col gap-3">
          <div className="flex gap-2 w-full">
            {!isFirstStep && (
              <Button variant="outline" onClick={handlePrevious} className="flex-1">
                <ChevronLeft className="w-4 h-4 mr-1" />
                Previous
              </Button>
            )}
            <Button onClick={handleNext} className="flex-1">
              {isLastStep ? 'Start Exploring' : 'Next'}
              {!isLastStep && <ChevronRight className="w-4 h-4 ml-1" />}
            </Button>
          </div>
          <Button variant="ghost" onClick={handleSkip} className="w-full text-muted-foreground">
            Skip Tour
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
