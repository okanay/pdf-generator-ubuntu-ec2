// memory-store.ts
class MemoryStore {
  private timestamps: Map<string, number[]> = new Map();

  constructor(
    private duration: number,
    private maxRequests: number,
  ) {}

  // Bir istek eklendiğinde çağrılır
  add(key: string): boolean {
    const now = Date.now();
    if (!this.timestamps.has(key)) {
      this.timestamps.set(key, [now]);
      return true;
    }

    const times = this.timestamps
      .get(key)!
      .filter((t) => now - t < this.duration);
    times.push(now);

    if (times.length > this.maxRequests) {
      // Eğer maksimum istek sayısı aşıldıysa false döner
      return false;
    }

    this.timestamps.set(key, times);
    return true;
  }

  // Süresi dolmuş istekleri temizle
  cleanup() {
    const now = Date.now();
    this.timestamps.forEach((times, key) => {
      const filteredTimes = times.filter((t) => now - t < this.duration);
      if (filteredTimes.length === 0) {
        this.timestamps.delete(key);
      } else {
        this.timestamps.set(key, filteredTimes);
      }
    });
  }
}

const rateLimit = Number(process.env.RATE_LIMIT) || 1;
const rateTimeLimit = Number(process.env.RATE_LIMIT_TIME_SECOND) * 1000 || 2000;

export const store = new MemoryStore(rateTimeLimit, rateLimit);
