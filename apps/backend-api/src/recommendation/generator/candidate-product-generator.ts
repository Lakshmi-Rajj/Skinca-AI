import { Injectable } from '@nestjs/common';
import { KnowledgeService } from '../../knowledge/services/knowledge.service';
import { RecommendationRequestDto } from '../dto/recommendation-request.dto';

@Injectable()
export class CandidateProductGenerator {
  constructor(private knowledgeService: KnowledgeService) {}

  async generateCandidates(tenantId: string, profile: RecommendationRequestDto): Promise<any[]> {
    let candidates = profile.isPregnant
      ? await this.knowledgeService.getPregnancySafeProducts(tenantId)
      : await this.knowledgeService.getFragranceFreeProducts(tenantId);

    if (!candidates || candidates.length === 0) {
      const { items } = await (this.knowledgeService as any).productRepository.findAll(tenantId, { limit: 50 });
      candidates = items;
    }

    return candidates;
  }
}
