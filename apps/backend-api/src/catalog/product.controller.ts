import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ProductWithDetails, Product } from '@platform/database-client';
import { ProductService, PaginatedProductsResult } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductQueryDto } from './dto/product-query.dto';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { CurrentTenant } from '../auth/decorators/current-tenant.decorator';
import { AuthenticatedUser } from '../auth/interfaces/auth.interface';

@ApiTags('Catalog')
@ApiBearerAuth('bearer-auth')
@Controller('products')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Post()
  @Permissions('catalog:product:write')
  @ApiOperation({ summary: 'Create a new skincare product in tenant catalog' })
  @ApiResponse({ status: 201, description: 'Product created successfully' })
  @ApiResponse({ status: 409, description: 'SKU already registered for tenant' })
  async create(
    @CurrentTenant() tenantId: string,
    @Body() dto: CreateProductDto,
    @CurrentUser() currentUser: AuthenticatedUser,
  ): Promise<ProductWithDetails> {
    return this.productService.create(tenantId || currentUser.tenantId, dto, currentUser);
  }

  @Get()
  @Permissions('catalog:product:read')
  @ApiOperation({ summary: 'List and search products in tenant catalog (Paginated)' })
  @ApiResponse({ status: 200, description: 'Paginated product list retrieved' })
  async findAll(
    @CurrentTenant() tenantId: string,
    @Query() query: ProductQueryDto,
    @CurrentUser() currentUser: AuthenticatedUser,
  ): Promise<PaginatedProductsResult> {
    return this.productService.findAll(tenantId || currentUser.tenantId, query);
  }

  @Get(':id')
  @Permissions('catalog:product:read')
  @ApiOperation({ summary: 'Get product details by ID' })
  @ApiResponse({ status: 200, description: 'Product details found' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async findOne(
    @CurrentTenant() tenantId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() currentUser: AuthenticatedUser,
  ): Promise<ProductWithDetails> {
    return this.productService.findById(tenantId || currentUser.tenantId, id);
  }

  @Patch(':id')
  @Permissions('catalog:product:write')
  @ApiOperation({ summary: 'Update product details, status, or category' })
  @ApiResponse({ status: 200, description: 'Product updated successfully' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async update(
    @CurrentTenant() tenantId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateProductDto,
    @CurrentUser() currentUser: AuthenticatedUser,
  ): Promise<ProductWithDetails> {
    return this.productService.update(tenantId || currentUser.tenantId, id, dto, currentUser);
  }

  @Delete(':id')
  @Permissions('catalog:product:write')
  @ApiOperation({ summary: 'Soft delete product from tenant catalog' })
  @ApiResponse({ status: 200, description: 'Product soft deleted' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async softDelete(
    @CurrentTenant() tenantId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() currentUser: AuthenticatedUser,
  ): Promise<Product> {
    return this.productService.softDelete(tenantId || currentUser.tenantId, id, currentUser);
  }
}
