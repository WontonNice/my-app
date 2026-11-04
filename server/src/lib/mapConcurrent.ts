/** Ordered results with bounded upstream load. Stop scheduling after a failure. */
export async function mapConcurrent<T, R>(items: T[], limit: number, run: (item: T) => Promise<R>): Promise<R[]> {
  if (!Number.isInteger(limit) || limit < 1) throw new Error("Concurrency must be positive");
  const results: R[] = new Array(items.length);
  let next = 0, failed = false;
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (!failed && next < items.length) {
      const index = next++;
      try { results[index] = await run(items[index]); }
      catch (error) { failed = true; throw error; }
    }
  }));
  return results;
}
