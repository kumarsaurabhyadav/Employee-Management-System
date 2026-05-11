/** Minimum time the full-page / section loader stays visible after fetch completes. */
export const LOADER_DELAY_MS = 1000;

/**
 * Runs an async function, then waits (if needed) so total time is at least LOADER_DELAY_MS.
 */
export async function withMinLoader(asyncFn) {
  const t0 = Date.now();
  const result = await asyncFn();
  const elapsed = Date.now() - t0;
  if (elapsed < LOADER_DELAY_MS) {
    await new Promise((r) => setTimeout(r, LOADER_DELAY_MS - elapsed));
  }
  return result;
}
