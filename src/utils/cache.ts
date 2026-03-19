import NodeCache from 'node-cache';

// Cache com TTL padrão de 1 hora (3600 segundos)
const cache = new NodeCache({ stdTTL: 3600, checkperiod: 120 });

export function getCached<T>(key: string): T | undefined {
  return cache.get<T>(key);
}

export function setCache<T>(key: string, value: T, ttl?: number): void {
  if (ttl === undefined) {
    cache.set(key, value);
  } else {
    cache.set(key, value, ttl);
  }
}

export function delCache(key: string): void {
  cache.del(key);
}

export function flushCache(): void {
  cache.flushAll();
}
