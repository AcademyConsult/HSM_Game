interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
}

export function createRateLimiter(config: RateLimitConfig) {
  const requests = new Map<string, number[]>();

  const cleanupInterval = setInterval(() => {
    const now = Date.now();
    for (const [ip, timestamps] of requests) {
      const valid = timestamps.filter((t) => now - t < config.windowMs);
      if (valid.length === 0) {
        requests.delete(ip);
      } else {
        requests.set(ip, valid);
      }
    }
  }, 60_000);

  if (cleanupInterval.unref) {
    cleanupInterval.unref();
  }

  return function isRateLimited(ip: string): boolean {
    const now = Date.now();
    const timestamps = requests.get(ip) ?? [];
    const valid = timestamps.filter((t) => now - t < config.windowMs);

    if (valid.length >= config.maxRequests) {
      requests.set(ip, valid);
      return true;
    }

    valid.push(now);
    requests.set(ip, valid);
    return false;
  };
}

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  return request.headers.get("x-real-ip") ?? "unknown";
}
