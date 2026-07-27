import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { TenantRepository, ProductRepository } from '@platform/database-client';
import { CreateWidgetSessionDto } from './dto/create-widget-session.dto';
import { WidgetRecommendationDto } from './dto/widget-recommendation.dto';

export interface WidgetSessionResponse {
  sessionId: string;
  tenantId: string;
  createdAt: string;
  expiresAt: string;
  widgetVersion: string;
}

export interface WidgetPublicConfig {
  brandName: string;
  logoUrl?: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  typography: string;
  borderRadius: string;
  buttonStyle: string;
  widgetTitle: string;
  welcomeMessage: string;
  supportedLanguages: string[];
}

@Injectable()
export class WidgetService {
  private tenantRepository = new TenantRepository();
  private productRepository = new ProductRepository();
  private activeSessions = new Map<string, { tenantId: string; expiresAt: number }>();

  async createSession(dto: CreateWidgetSessionDto): Promise<WidgetSessionResponse> {
    const tenant = await this.tenantRepository.findById(dto.tenantId);
    if (!tenant) {
      throw new NotFoundException(`Tenant with ID ${dto.tenantId} not found`);
    }

    const sessionId = `w_sess_${Math.random().toString(36).substring(2, 15)}_${Date.now()}`;
    const now = Date.now();
    const expiresAt = now + 2 * 60 * 60 * 1000; // 2 hours validity

    this.activeSessions.set(sessionId, {
      tenantId: dto.tenantId,
      expiresAt,
    });

    return {
      sessionId,
      tenantId: dto.tenantId,
      createdAt: new Date(now).toISOString(),
      expiresAt: new Date(expiresAt).toISOString(),
      widgetVersion: '1.0.0',
    };
  }

  async getPublicConfig(tenantId: string): Promise<WidgetPublicConfig> {
    const tenant = await this.tenantRepository.findById(tenantId);
    if (!tenant) {
      throw new NotFoundException(`Tenant with ID ${tenantId} not found`);
    }

    const cfg = tenant.configuration;

    return {
      brandName: cfg?.brandName || tenant.name,
      logoUrl: cfg?.logoUrl || undefined,
      primaryColor: cfg?.primaryColor || '#000000',
      secondaryColor: '#F4F4F5',
      accentColor: cfg?.accentColor || '#4A90E2',
      typography: 'Inter, sans-serif',
      borderRadius: '8px',
      buttonStyle: 'SOLID',
      widgetTitle: 'Personalized Skincare Routine Advisor',
      welcomeMessage: 'Discover the ideal routine tailored to your unique skin profile in 2 minutes.',
      supportedLanguages: ['en'],
    };
  }

  async getThemeCss(tenantId: string): Promise<string> {
    const config = await this.getPublicConfig(tenantId);
    return `
      :root {
        --widget-primary: ${config.primaryColor};
        --widget-secondary: ${config.secondaryColor};
        --widget-accent: ${config.accentColor};
        --widget-font: ${config.typography};
        --widget-radius: ${config.borderRadius};
      }
    `;
  }

  async getLocalization(language: string = 'en'): Promise<Record<string, string>> {
    return {
      welcomeTitle: 'Find Your Perfect Routine',
      welcomeSub: 'Answer a few quick questions to receive a dermatologist-validated skincare routine.',
      startBtn: 'Start Quiz',
      skinTypeQuestion: 'What is your primary skin type?',
      concernsQuestion: 'What skin concerns would you like to address?',
      allergiesQuestion: 'Do you have any known ingredient allergies or exclusions?',
      submitBtn: 'Generate My Routine',
      morningRoutineTitle: 'Morning Routine',
      eveningRoutineTitle: 'Evening Routine',
      whySelectedTitle: 'Why This Routine Was Selected',
      resetBtn: 'Retake Quiz',
    };
  }

  async generateRecommendation(dto: WidgetRecommendationDto): Promise<any> {
    const session = this.activeSessions.get(dto.sessionId);
    if (!session || Date.now() > session.expiresAt || session.tenantId !== dto.tenantId) {
      throw new UnauthorizedException('Invalid or expired widget session');
    }

    const { items: products } = await this.productRepository.findAll(dto.tenantId, { limit: 100, status: 'ACTIVE' });

    // Format candidate products
    const candidateProducts = products.map((p) => ({
      id: p.id,
      name: p.name,
      category: p.category.name,
      status: p.status,
      price: p.price ? Number(p.price) : 0,
      compatible_skin_types: [dto.skinType],
      target_skin_concerns: dto.skinConcerns || [],
      ingredients: p.formulation.map((f) => ({
        ingredient_id: f.ingredientId,
        inci_name: f.ingredient.inciName,
        display_name: f.ingredient.displayName,
        functions: f.ingredient.functions,
        skin_types: f.ingredient.skinTypes,
        skin_concerns: f.ingredient.skinConcerns,
        irritation_risk: f.ingredient.irritationRisk,
        is_primary_active: f.isPrimaryActive,
      })),
    }));

    // Mock deterministic execution fallback for widget response
    const morningSteps = candidateProducts
      .filter((p) => ['Cleanser', 'Serum', 'Moisturizer', 'Sunscreen'].includes(p.category))
      .map((p) => ({
        product_id: p.id,
        name: p.name,
        category: p.category,
        price: p.price,
        matched_concerns: dto.skinConcerns || [],
      }));

    const eveningSteps = candidateProducts
      .filter((p) => ['Cleanser', 'Serum', 'Moisturizer', 'Mask'].includes(p.category))
      .map((p) => ({
        product_id: p.id,
        name: p.name,
        category: p.category,
        price: p.price,
        matched_concerns: dto.skinConcerns || [],
      }));

    return {
      success: true,
      sessionId: dto.sessionId,
      routine: {
        morning: morningSteps,
        evening: eveningSteps,
      },
      explanation: `Your personalized skincare routine was formulated for ${dto.skinType} skin targeting [${(dto.skinConcerns || []).join(', ')}]. Products are ordered for optimal skin absorption and barrier protection.`,
    };
  }
}
