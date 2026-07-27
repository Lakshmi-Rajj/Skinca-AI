import {
  Controller,
  Get,
  Put,
  Param,
  Query,
  Body,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { IngredientWithAliases } from '@platform/database-client';
import { IngredientService, PaginatedIngredientsResult } from './ingredient.service';
import { IngredientQueryDto } from './dto/ingredient-query.dto';
import { UpdateFormulationDto } from './dto/update-formulation.dto';
import { Public } from '../auth/decorators/public.decorator';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { CurrentTenant } from '../auth/decorators/current-tenant.decorator';
import { AuthenticatedUser } from '../auth/interfaces/auth.interface';

@ApiTags('Ingredient')
@Controller('ingredients')
export class IngredientController {
  constructor(private ingredientService: IngredientService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'List and filter global INCI ingredients (Paginated)' })
  @ApiResponse({ status: 200, description: 'Paginated ingredient list retrieved' })
  async findAll(@Query() query: IngredientQueryDto): Promise<PaginatedIngredientsResult> {
    return this.ingredientService.findAll(query);
  }

  @Public()
  @Get('search')
  @ApiOperation({ summary: 'Search global INCI ingredients by name, display title, or trade alias' })
  @ApiResponse({ status: 200, description: 'Search results returned' })
  async search(@Query() query: IngredientQueryDto): Promise<PaginatedIngredientsResult> {
    return this.ingredientService.search(query);
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get global INCI ingredient specification by ID' })
  @ApiResponse({ status: 200, description: 'Ingredient details found' })
  @ApiResponse({ status: 404, description: 'Ingredient not found' })
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<IngredientWithAliases> {
    return this.ingredientService.findById(id);
  }
}

@ApiTags('Catalog')
@ApiBearerAuth('bearer-auth')
@Controller('products')
export class ProductFormulationController {
  constructor(private ingredientService: IngredientService) {}

  @Put(':id/formulation')
  @Permissions('catalog:product:write')
  @ApiOperation({ summary: 'Map ordered INCI formulation ingredients to product' })
  @ApiResponse({ status: 200, description: 'Product formulation updated successfully' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async updateFormulation(
    @CurrentTenant() tenantId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateFormulationDto,
    @CurrentUser() currentUser: AuthenticatedUser,
  ): Promise<any> {
    return this.ingredientService.updateProductFormulation(
      tenantId || currentUser.tenantId,
      id,
      dto,
      currentUser,
    );
  }
}
