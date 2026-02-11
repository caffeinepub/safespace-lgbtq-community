import { useState, useEffect } from 'react';

const COMPLIANCE_KEY = 'safespace_compliance_accepted';

export function useComplianceGate() {
  const [hasAccepted, setHasAccepted] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const accepted = localStorage.getItem(COMPLIANCE_KEY);
    setHasAccepted(accepted === 'true');
    setIsLoading(false);
  }, []);

  const accept = () => {
    localStorage.setItem(COMPLIANCE_KEY, 'true');
    setHasAccepted(true);
  };

  const reset = () => {
    localStorage.removeItem(COMPLIANCE_KEY);
    setHasAccepted(false);
  };

  return { hasAccepted, accept, reset, isLoading };
}
