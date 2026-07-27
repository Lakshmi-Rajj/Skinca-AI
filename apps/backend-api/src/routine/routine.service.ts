import { Injectable, NotFoundException } from '@nestjs/common';
import { CustomerService } from '../customer/customer.service';
import { RecommendationService } from '../recommendation/recommendation.service';
import { AIExplanationService } from '../ai-explanation/ai-explanation.service';
import { MorningRoutineBuilder } from './builders/morning-routine.builder';
import { EveningRoutineBuilder } from './builders/evening-routine.builder';
import { GenerateRoutineRequestDto } from './dto/routine-request.dto';
import { PersonalizedRoutineResponseDto } from './dto/routine-response.dto';
import { validateRoutineStructure } from './validators/routine.validator';
import { RoutineRepository } from '@platform/database-client';
import { SkinTypeEnum } from '../recommendation/dto/recommendation-request.dto';

@Injectable()
export class RoutineService {
  private routineRepo = new RoutineRepository();

  constructor(
    private customerService: CustomerService,
    private recommendationService: RecommendationService,
    private aiExplanationService: AIExplanationService,
    private morningBuilder: MorningRoutineBuilder,
    private eveningBuilder: EveningRoutineBuilder,
  ) {}

  async generateRoutine(
    tenantId: string,
    dto: GenerateRoutineRequestDto,
  ): Promise<PersonalizedRoutineResponseDto> {
    // 1. Service boundary: Fetch customer profile
    const customer = await this.customerService.getCustomerById(tenantId, dto.customerId);
    const activeSkinProfile = await this.customerService.getCurrentSkinProfile(tenantId, dto.customerId);

    const skinTypeStr = (activeSkinProfile.skinType || 'COMBINATION').toUpperCase();
    const skinTypeEnum = Object.values(SkinTypeEnum).includes(skinTypeStr as SkinTypeEnum)
      ? (skinTypeStr as SkinTypeEnum)
      : SkinTypeEnum.COMBINATION;

    // 2. Service boundary: Execute deterministic recommendation engine
    const recommendationResult = await this.recommendationService.generateRecommendation(tenantId, {
      skinType: skinTypeEnum,
      skinConcerns: activeSkinProfile.concerns || [],
      isPregnant: activeSkinProfile.sensitivity === 'PREGNANT',
    });

    // 3. Assemble Builders
    const morningSteps = this.morningBuilder.buildMorningRoutine(
      recommendationResult.recommendedProducts,
      dto.routineType,
    );
    const eveningSteps = this.eveningBuilder.buildEveningRoutine(
      recommendationResult.recommendedProducts,
      dto.routineType,
    );

    // 4. Validate Routine Structure
    const warnings = validateRoutineStructure(morningSteps, eveningSteps);

    // 5. Service boundary: Generate AI explanations
    const explanation = await this.aiExplanationService.generateExplanation(tenantId, {
      recommendationResult,
      customerProfile: {
        skinType: skinTypeEnum,
        skinConcerns: activeSkinProfile.concerns || [],
      },
      language: dto.language || 'en',
    });

    // 6. Record Routine History in database
    const savedRoutine = await this.routineRepo.create({
      tenantId,
      customerId: dto.customerId,
      routineType: dto.routineType || 'STANDARD',
      engineVersion: 'v4.1.0',
      morningSteps,
      eveningSteps,
      warnings,
      explanation,
    });

    return {
      routineId: savedRoutine.id,
      customerId: savedRoutine.customerId,
      routineType: savedRoutine.routineType,
      morningRoutine: morningSteps,
      eveningRoutine: eveningSteps,
      warnings,
      explanation,
      generatedAt: savedRoutine.createdAt,
    };
  }

  async getRoutineById(tenantId: string, id: string): Promise<any> {
    const routine = await this.routineRepo.findById(tenantId, id);
    if (!routine) {
      throw new NotFoundException(`Personalized routine ${id} not found`);
    }
    return routine;
  }

  async getCustomerRoutines(tenantId: string, customerId: string): Promise<any[]> {
    await this.customerService.getCustomerById(tenantId, customerId);
    return this.routineRepo.getCustomerRoutines(tenantId, customerId);
  }
}
