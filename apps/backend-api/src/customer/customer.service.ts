import { Injectable, NotFoundException } from '@nestjs/common';
import {
  CustomerRepository,
  SkinProfileRepository,
  AssessmentRepository,
  RecommendationHistoryRepository,
} from '@platform/database-client';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { SkinProfileDto } from './dto/skin-profile.dto';
import { AssessmentSubmissionDto } from './dto/assessment.dto';
import { RecordRecommendationHistoryDto } from './dto/history.dto';
import { validateSkinProfileData } from './validators/profile.validator';

@Injectable()
export class CustomerService {
  private customerRepo = new CustomerRepository();
  private profileRepo = new SkinProfileRepository();
  private assessmentRepo = new AssessmentRepository();
  private historyRepo = new RecommendationHistoryRepository();

  async createCustomer(tenantId: string, dto: CreateCustomerDto): Promise<any> {
    return this.customerRepo.create({
      tenantId,
      firstName: dto.firstName,
      lastName: dto.lastName,
      email: dto.email,
      phone: dto.phone,
    });
  }

  async getCustomerById(tenantId: string, id: string): Promise<any> {
    const customer = await this.customerRepo.findById(tenantId, id);
    if (!customer) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }
    return customer;
  }

  async updateCustomer(tenantId: string, id: string, dto: UpdateCustomerDto): Promise<any> {
    await this.getCustomerById(tenantId, id);
    return this.customerRepo.update(tenantId, id, dto);
  }

  async deleteCustomer(tenantId: string, id: string): Promise<any> {
    await this.getCustomerById(tenantId, id);
    return this.customerRepo.delete(tenantId, id);
  }

  async createSkinProfileVersion(tenantId: string, customerId: string, dto: SkinProfileDto): Promise<any> {
    await this.getCustomerById(tenantId, customerId);
    validateSkinProfileData(dto);

    return this.profileRepo.createNewVersion({
      customerId,
      skinType: dto.skinType,
      concerns: dto.concerns || [],
      sensitivity: dto.sensitivity,
      hydrationLevel: dto.hydrationLevel,
      acneSeverity: dto.acneSeverity,
      pigmentationLevel: dto.pigmentationLevel,
      wrinkleLevel: dto.wrinkleLevel,
    });
  }

  async getCurrentSkinProfile(tenantId: string, customerId: string): Promise<any> {
    await this.getCustomerById(tenantId, customerId);
    const profile = await this.profileRepo.getCurrentProfile(customerId);
    if (!profile) {
      throw new NotFoundException(`No active skin profile found for customer ${customerId}`);
    }
    return profile;
  }

  async getSkinProfileHistory(tenantId: string, customerId: string): Promise<any[]> {
    await this.getCustomerById(tenantId, customerId);
    return this.profileRepo.getProfileHistory(customerId);
  }

  async submitAssessment(tenantId: string, dto: AssessmentSubmissionDto): Promise<any> {
    await this.getCustomerById(tenantId, dto.customerId);

    const calculatedSkinType = dto.questionnaireAnswers.skinType || 'COMBINATION';
    const calculatedConcerns = dto.questionnaireAnswers.primaryConcern
      ? [dto.questionnaireAnswers.primaryConcern, dto.questionnaireAnswers.secondaryConcern].filter(Boolean)
      : [];

    const calculatedProfile = {
      skinType: calculatedSkinType,
      concerns: calculatedConcerns,
      sensitivity: dto.questionnaireAnswers.sensitivity || 'MODERATE',
    };

    const assessment = await this.assessmentRepo.create({
      customerId: dto.customerId,
      questionnaireAnswers: dto.questionnaireAnswers,
      calculatedProfile,
    });

    const skinProfile = await this.profileRepo.createNewVersion({
      customerId: dto.customerId,
      skinType: calculatedSkinType,
      concerns: calculatedConcerns,
      sensitivity: calculatedProfile.sensitivity,
    });

    return { assessment, skinProfile };
  }

  async getAssessmentById(id: string): Promise<any> {
    const assessment = await this.assessmentRepo.findById(id);
    if (!assessment) {
      throw new NotFoundException(`Assessment record ${id} not found`);
    }
    return assessment;
  }

  async getCustomerAssessmentHistory(tenantId: string, customerId: string): Promise<any[]> {
    await this.getCustomerById(tenantId, customerId);
    return this.assessmentRepo.getCustomerAssessmentHistory(customerId);
  }

  async recordRecommendationHistory(
    tenantId: string,
    customerId: string,
    dto: RecordRecommendationHistoryDto,
  ): Promise<any> {
    await this.getCustomerById(tenantId, customerId);
    return this.historyRepo.create({
      customerId,
      recommendationId: dto.recommendationId,
      engineVersion: dto.engineVersion,
      confidenceScore: dto.confidenceScore,
      accepted: dto.accepted,
      feedback: dto.feedback,
      products: dto.products,
    });
  }

  async getCustomerRecommendationHistory(tenantId: string, customerId: string): Promise<any[]> {
    await this.getCustomerById(tenantId, customerId);
    return this.historyRepo.getCustomerHistory(customerId);
  }
}
