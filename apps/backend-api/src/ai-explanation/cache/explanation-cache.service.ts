import { Injectable } from '@nestjs/common';
import { RecommendationExplanationResponse } from '../dto/explanation-response.dto';
import { logger } from '@platform/logger';

@Injectable()
export class ExplanationCacheService {
  private cache = new Map<string, { value: RecommendationExplanationResponse; expiresAt: number }>();
  private readonly TTL_MS = 24 * 60 * 60 * 1000; // 24 Hours

  async get(key: string): Promise<RecommendationExplanationResponse | null> {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    logger.debug({ key }, 'ExplanationCache HIT');
    return { ...entry.value, cached: true };
  }

  async set(key: string, value: RecommendationExplanationResponse): Promise<void> {
    const expiresAt = Date.now() + this.TTL_MS;
    this.cache.set(key, { value, expiresAt });
    logger.debug({ key }, 'ExplanationCache SET (24h TTL)');
  }
}
