export function getAnonymousLabel(pseudonym?: string | null): string {
  if (pseudonym && pseudonym.trim()) {
    return pseudonym;
  }
  return 'Anonymous';
}

export function formatTimestamp(timestamp: bigint): string {
  const date = new Date(Number(timestamp) / 1000000);
  return date.toLocaleString();
}

export function redactPrincipal(principal: string): string {
  if (principal.length <= 10) return '***';
  return `${principal.slice(0, 5)}...${principal.slice(-5)}`;
}
