import { useState, useEffect } from 'react';

const QUICK_TOUR_KEY = 'safespace_quick_tour_completed';

export function useQuickTour() {
  const [hasCompleted, setHasCompleted] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const completed = localStorage.getItem(QUICK_TOUR_KEY);
    setHasCompleted(completed === 'true');
    setIsLoading(false);
  }, []);

  const complete = () => {
    localStorage.setItem(QUICK_TOUR_KEY, 'true');
    setHasCompleted(true);
  };

  const reset = () => {
    localStorage.removeItem(QUICK_TOUR_KEY);
    setHasCompleted(false);
  };

  return { hasCompleted, complete, reset, isLoading };
}
