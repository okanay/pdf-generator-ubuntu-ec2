interface Hits {
  [key: string]: number;
}

export function memoryStore(windowMs: number) {
  let hits: Hits = {};
  let resetTime = Date.now() + windowMs;

  const interval = setInterval(() => {
    hits = {};
    resetTime = Date.now() + windowMs;
  }, windowMs);

  process.on("exit", () => {
    clearInterval(interval);
  });

  return {
    increment: (key: string): number => {
      const now = Date.now();
      if (now > resetTime) {
        hits = {};
        resetTime = now + windowMs;
      }
      if (!hits[key]) hits[key] = 0;
      hits[key]++;
      return hits[key];
    },
  };
}
