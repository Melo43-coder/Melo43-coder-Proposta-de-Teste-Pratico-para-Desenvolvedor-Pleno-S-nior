// src/infrastructure/cache/mock-cache.service.ts
import { CacheService } from '../../../domain/services/cache-service-interface';

export class MockCacheService implements CacheService {
  private cache = new Map<string, any>();

  async get<T>(key: string): Promise<T | null> {
    console.log(`[MOCK] Getting cache for key: ${key}`);
    return this.cache.get(key) || null;
  }

  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    console.log(`[MOCK] Setting cache for key: ${key}, TTL: ${ttl || 'indefinite'}`);
    this.cache.set(key, value);
  }

  async delete(key: string): Promise<void> {
    console.log(`[MOCK] Deleting cache for key: ${key}`);
    this.cache.delete(key);
  }

  async invalidatePattern(pattern: string): Promise<void> {
    console.log(`[MOCK] Invalidating cache pattern: ${pattern}`);
    // Implementação simples para desenvolvimento
    const regex = new RegExp(pattern.replace('*', '.*'));
    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        this.cache.delete(key);
      }
    }
  }
}