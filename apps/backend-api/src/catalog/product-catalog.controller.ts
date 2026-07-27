import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Query,
  Body,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
  Res,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Response } from 'express';
import { ProductCatalogService } from './product-catalog.service';
import { CreateProductDto } from './dto/create-product.dto';
import { BulkImportDto } from './dto/bulk-import.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { CurrentTenant } from '../auth/decorators/current-tenant.decorator';
import { AuthenticatedUser } from '../auth/interfaces/auth.interface';

@ApiTags('Product & Ingredient Catalog')
@ApiBearerAuth('bearer-auth')
@Controller()
export class ProductCatalogController {
  constructor(private catalogService: ProductCatalogService) {}

  @Get('products')
  @Roles('OWNER', 'ADMIN', 'MANAGER', 'STAFF', 'VIEWER')
  @ApiOperation({ summary: 'Search products with full-text search, filters, pagination, and sorting' })
  @ApiResponse({ status: 200, description: 'Paginated product search results returned' })
  async searchProducts(
    @CurrentTenant() tenantId: string,
    @CurrentUser() currentUser: AuthenticatedUser,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
    @Query('status') status?: any,
    @Query('categoryId') categoryId?: string,
    @Query('brandId') brandId?: string,
    @Query('claimId') claimId?: string,
    @Query('ingredientId') ingredientId?: string,
    @Query('sortBy') sortBy?: any,
    @Query('sortOrder') sortOrder?: any,
  ): Promise<any> {
    return this.catalogService.searchProducts(tenantId || currentUser.tenantId, {
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 20,
      search,
      status,
      categoryId,
      brandId,
      claimId,
      ingredientId,
      sortBy,
      sortOrder,
    });
  }

  @Post('products')
  @Roles('OWNER', 'ADMIN', 'MANAGER')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new catalog product' })
  @ApiResponse({ status: 201, description: 'Product created successfully' })
  async createProduct(
    @CurrentTenant() tenantId: string,
    @CurrentUser() currentUser: AuthenticatedUser,
    @Body() dto: CreateProductDto,
  ): Promise<any> {
    return this.catalogService.createProduct(tenantId || currentUser.tenantId, dto, currentUser.userId);
  }

  @Get('products/:id')
  @Roles('OWNER', 'ADMIN', 'MANAGER', 'STAFF', 'VIEWER')
  @ApiOperation({ summary: 'Get product details by ID' })
  @ApiResponse({ status: 200, description: 'Product details returned' })
  async getProductById(
    @CurrentTenant() tenantId: string,
    @CurrentUser() currentUser: AuthenticatedUser,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<any> {
    return this.catalogService.findProductById(tenantId || currentUser.tenantId, id);
  }

  @Delete('products/:id')
  @Roles('OWNER', 'ADMIN')
  @ApiOperation({ summary: 'Archive a catalog product' })
  @ApiResponse({ status: 200, description: 'Product archived' })
  async archiveProduct(
    @CurrentTenant() tenantId: string,
    @CurrentUser() currentUser: AuthenticatedUser,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<{ message: string }> {
    return this.catalogService.archiveProduct(tenantId || currentUser.tenantId, id, currentUser.userId);
  }

  @Post('products/import')
  @Roles('OWNER', 'ADMIN', 'MANAGER')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Bulk import products into tenant catalog' })
  @ApiResponse({ status: 200, description: 'Products bulk imported' })
  async bulkImportProducts(
    @CurrentTenant() tenantId: string,
    @CurrentUser() currentUser: AuthenticatedUser,
    @Body() dto: BulkImportDto,
  ): Promise<{ importedCount: number }> {
    return this.catalogService.bulkImportProducts(tenantId || currentUser.tenantId, dto, currentUser.userId);
  }

  @Get('products/export')
  @Roles('OWNER', 'ADMIN', 'MANAGER')
  @ApiOperation({ summary: 'Bulk export tenant products' })
  @ApiResponse({ status: 200, description: 'Product records returned for export' })
  async bulkExportProducts(
    @CurrentTenant() tenantId: string,
    @CurrentUser() currentUser: AuthenticatedUser,
  ): Promise<any[]> {
    return this.catalogService.bulkExportProducts(tenantId || currentUser.tenantId);
  }

  @Get('ingredients')
  @Roles('OWNER', 'ADMIN', 'MANAGER', 'STAFF', 'VIEWER')
  @ApiOperation({ summary: 'Search INCI ingredients library' })
  @ApiResponse({ status: 200, description: 'Ingredients returned' })
  async searchIngredients(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
  ): Promise<any> {
    return this.catalogService.searchIngredients({
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 20,
      search,
    });
  }

  @Get('ingredients/:id')
  @Roles('OWNER', 'ADMIN', 'MANAGER', 'STAFF', 'VIEWER')
  @ApiOperation({ summary: 'Get INCI ingredient details' })
  @ApiResponse({ status: 200, description: 'Ingredient details returned' })
  async getIngredientById(@Param('id', ParseUUIDPipe) id: string): Promise<any> {
    return this.catalogService.findIngredientById(id);
  }

  @Post('ingredients/import')
  @Roles('OWNER', 'ADMIN')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Bulk import INCI ingredients' })
  @ApiResponse({ status: 200, description: 'Ingredients imported' })
  async bulkImportIngredients(
    @CurrentUser() currentUser: AuthenticatedUser,
    @Body() dto: BulkImportDto,
  ): Promise<{ importedCount: number }> {
    return this.catalogService.bulkImportIngredients(dto, currentUser.userId);
  }

  @Get('ingredients/export')
  @Roles('OWNER', 'ADMIN', 'MANAGER')
  @ApiOperation({ summary: 'Bulk export INCI ingredients' })
  @ApiResponse({ status: 200, description: 'Ingredients exported' })
  async bulkExportIngredients(): Promise<any[]> {
    return this.catalogService.bulkExportIngredients();
  }
}
