import { Injectable } from '@nestjs/common';
import { logger } from '@platform/logger';

@Injectable()
export class KnowledgeCacheService {
  private memoryCache = new Map<string, { value: any; expiresAt: number }>();
  private readonly DEFAULT_TTL_SECONDS = 300; // 5 minutes

  async get<T>(key: string): Promise<T | null> {
    const cached = this.memoryCache.get(key);
    if (!cached) {
      return null;
    }

    if (Date.now() > cached.expiresAt) {
      this.memoryCache.delete(key);
      return null;
    }

    logger.debug({ key }, 'KnowledgeCache HIT');
    return cached.value as T;
  }

  async set(key: string, value: any, ttlSeconds = this.DEFAULT_TTL_SECONDS): Promise<void> {
    const expiresAt = Date.now() + ttlSeconds * 1000;
    this.memoryCache.set(key, { value, expiresAt });
    logger.debug({ key, ttlSeconds }, 'KnowledgeCache SET');
  }

  async invalidatePrefix(prefix: string): Promise<void> {
    for (const key of this.memoryCache.keys()) {
      if (key.startsWith(prefix)) {
        this.memoryCache.delete(key);
      }
    }
    logger.info({ prefix }, 'KnowledgeCache invalidated by prefix');
  }

  async clear(): Promise<void> {
    this.memoryCache.clear();
    logger.info('KnowledgeCache cleared');
  }
}
