"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockCacheService = void 0;
class MockCacheService {
    constructor() {
        this.cache = new Map();
    }
    async get(key) {
        console.log(`[MOCK] Getting cache for key: ${key}`);
        return this.cache.get(key) || null;
    }
    async set(key, value, ttl) {
        console.log(`[MOCK] Setting cache for key: ${key}, TTL: ${ttl || 'indefinite'}`);
        this.cache.set(key, value);
    }
    async delete(key) {
        console.log(`[MOCK] Deleting cache for key: ${key}`);
        this.cache.delete(key);
    }
    async invalidatePattern(pattern) {
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
exports.MockCacheService = MockCacheService;
