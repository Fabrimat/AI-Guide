export type Tier = 'light' | 'better' | 'best';
/**
 * Best-effort recommended tier from device signals. Web APIs do not expose
 * GPU VRAM, so this is a heuristic on RAM (navigator.deviceMemory, GiB,
 * Chromium-only and coarse) + mobile detection. We never auto-recommend
 * 'best' (can't confirm a strong GPU from the web); the user can still pick it.
 */
export function recommendedTier(): Tier {
  const mem = (navigator as unknown as { deviceMemory?: number }).deviceMemory;
  const mobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  if (mobile) return 'light';
  if (typeof mem === 'number' && mem >= 8) return 'better';
  return 'light';
}
