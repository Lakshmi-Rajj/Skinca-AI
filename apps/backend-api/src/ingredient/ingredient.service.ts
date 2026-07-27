import { Injectable, NotFoundException } from '@nestjs/common';
import { IngredientRepository, IngredientWithAliases } from '@platform/database-client';
import { AuditService } from '../audit/audit.service';
import { IngredientQueryDto } from './dto/ingredient-query.dto';
import { UpdateFormulationDto } from './dto/update-formulation.dto';
import { AuthenticatedUser } from '../auth/interfaces/auth.interface';

export interface PaginatedIngredientsResult {
  items: IngredientWithAliases[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

@Injectable()
export class IngredientService {
  private ingredientRepository = new IngredientRepository();

  constructor(private auditService: AuditService) {}

  async findAll(query: IngredientQueryDto): Promise<PaginatedIngredientsResult> {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const { items, total } = await this.ingredientRepository.findAll(query);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findById(id: string): Promise<IngredientWithAliases> {
    const ingredient = await this.ingredientRepository.findById(id);
    if (!ingredient) {
      throw new NotFoundException(`Ingredient with ID ${id} not found in global knowledge base`);
    }
    return ingredient;
  }

  async search(query: IngredientQueryDto): Promise<PaginatedIngredientsResult> {
    return this.findAll(query);
  }

  async updateProductFormulation(
    tenantId: string,
    productId: string,
    dto: UpdateFormulationDto,
    currentUser?: AuthenticatedUser,
  ): Promise<any> {
    const updatedProduct = await this.ingredientRepository.updateProductFormulation(
      productId,
      dto.ingredients,
    );

    await this.auditService.logAction({
      tenantId,
      userId: currentUser?.userId,
      action: 'FORMULATION_UPDATED',
      entityType: 'PRODUCT',
      entityId: productId,
      payload: { ingredientCount: dto.ingredients.length },
    });

    return updatedProduct;
  }
}
