import { Controller, Get, Param, Query, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { KnowledgeService } from '../services/knowledge.service';
import { CompatibilityQueryDto } from '../dto/compatibility-query.dto';
import { Roles } from '../../auth/decorators/roles.decorator';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { CurrentTenant } from '../../auth/decorators/current-tenant.decorator';
import { AuthenticatedUser } from '../../auth/interfaces/auth.interface';

@ApiTags('Knowledge Service')
@ApiBearerAuth('bearer-auth')
@Controller('knowledge')
export class KnowledgeController {
  constructor(private knowledgeService: KnowledgeService) {}

  @Get('products/:id')
  @Roles('OWNER', 'ADMIN', 'MANAGER', 'STAFF', 'VIEWER')
  @ApiOperation({ summary: 'Get aggregated knowledge profile for a product' })
  @ApiResponse({ status: 200, description: 'Product knowledge profile returned' })
  async getProductKnowledge(
    @CurrentTenant() tenantId: string,
    @CurrentUser() currentUser: AuthenticatedUser,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<any> {
    return this.knowledgeService.getProductKnowledge(tenantId || currentUser.tenantId, id);
  }

  @Get('ingredients/:id')
  @Roles('OWNER', 'ADMIN', 'MANAGER', 'STAFF', 'VIEWER')
  @ApiOperation({ summary: 'Get scientific knowledge profile for an INCI ingredient' })
  @ApiResponse({ status: 200, description: 'Ingredient knowledge profile returned' })
  async getIngredientKnowledge(@Param('id', ParseUUIDPipe) id: string): Promise<any> {
    return this.knowledgeService.getIngredientKnowledge(id);
  }

  @Get('compatibility')
  @Roles('OWNER', 'ADMIN', 'MANAGER', 'STAFF', 'VIEWER')
  @ApiOperation({ summary: 'Check dermatological compatibility between two active ingredients' })
  @ApiResponse({ status: 200, description: 'Compatibility evaluation result returned' })
  async checkCompatibility(@Query() query: CompatibilityQueryDto): Promise<any> {
    return this.knowledgeService.checkCompatibility(query.inciName1, query.inciName2);
  }

  @Get('products/by-ingredient/:ingredientId')
  @Roles('OWNER', 'ADMIN', 'MANAGER', 'STAFF', 'VIEWER')
  @ApiOperation({ summary: 'Get products containing a specific INCI ingredient' })
  @ApiResponse({ status: 200, description: 'Products containing ingredient returned' })
  async getProductsByIngredient(
    @CurrentTenant() tenantId: string,
    @CurrentUser() currentUser: AuthenticatedUser,
    @Param('ingredientId', ParseUUIDPipe) ingredientId: string,
  ): Promise<any> {
    return this.knowledgeService.getProductsByIngredient(tenantId || currentUser.tenantId, ingredientId);
  }

  @Get('products/by-claim/:claimId')
  @Roles('OWNER', 'ADMIN', 'MANAGER', 'STAFF', 'VIEWER')
  @ApiOperation({ summary: 'Get products matching a specific claim tag' })
  @ApiResponse({ status: 200, description: 'Matching products returned' })
  async getProductsByClaim(
    @CurrentTenant() tenantId: string,
    @CurrentUser() currentUser: AuthenticatedUser,
    @Param('claimId', ParseUUIDPipe) claimId: string,
  ): Promise<any> {
    return this.knowledgeService.getProductsByClaim(tenantId || currentUser.tenantId, claimId);
  }

  @Get('products/pregnancy-safe')
  @Roles('OWNER', 'ADMIN', 'MANAGER', 'STAFF', 'VIEWER')
  @ApiOperation({ summary: 'Get all pregnancy-safe products for tenant' })
  @ApiResponse({ status: 200, description: 'Pregnancy-safe products returned' })
  async getPregnancySafeProducts(
    @CurrentTenant() tenantId: string,
    @CurrentUser() currentUser: AuthenticatedUser,
  ): Promise<any> {
    return this.knowledgeService.getPregnancySafeProducts(tenantId || currentUser.tenantId);
  }

  @Get('products/fragrance-free')
  @Roles('OWNER', 'ADMIN', 'MANAGER', 'STAFF', 'VIEWER')
  @ApiOperation({ summary: 'Get all fragrance-free products for tenant' })
  @ApiResponse({ status: 200, description: 'Fragrance-free products returned' })
  async getFragranceFreeProducts(
    @CurrentTenant() tenantId: string,
    @CurrentUser() currentUser: AuthenticatedUser,
  ): Promise<any> {
    return this.knowledgeService.getFragranceFreeProducts(tenantId || currentUser.tenantId);
  }
}
