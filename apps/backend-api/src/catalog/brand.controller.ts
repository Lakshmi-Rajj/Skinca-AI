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
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { BrandService } from './brand.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { CurrentTenant } from '../auth/decorators/current-tenant.decorator';
import { AuthenticatedUser } from '../auth/interfaces/auth.interface';

@ApiTags('Brand Management')
@ApiBearerAuth('bearer-auth')
@Controller('brands')
export class BrandController {
  constructor(private brandService: BrandService) {}

  @Get()
  @Roles('OWNER', 'ADMIN', 'MANAGER', 'STAFF', 'VIEWER')
  @ApiOperation({ summary: 'List all brands for tenant' })
  @ApiResponse({ status: 200, description: 'Brand list returned' })
  async findAll(
    @CurrentTenant() tenantId: string,
    @CurrentUser() currentUser: AuthenticatedUser,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
  ): Promise<any> {
    return this.brandService.findAll(tenantId || currentUser.tenantId, {
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 20,
      search,
    });
  }

  @Post()
  @Roles('OWNER', 'ADMIN', 'MANAGER')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new skincare brand' })
  @ApiResponse({ status: 201, description: 'Brand created successfully' })
  async create(
    @CurrentTenant() tenantId: string,
    @CurrentUser() currentUser: AuthenticatedUser,
    @Body() dto: CreateBrandDto,
  ): Promise<any> {
    return this.brandService.create(tenantId || currentUser.tenantId, dto, currentUser.userId);
  }

  @Delete(':id')
  @Roles('OWNER', 'ADMIN')
  @ApiOperation({ summary: 'Archive a skincare brand' })
  @ApiResponse({ status: 200, description: 'Brand archived' })
  async delete(
    @CurrentTenant() tenantId: string,
    @CurrentUser() currentUser: AuthenticatedUser,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<{ message: string }> {
    return this.brandService.delete(tenantId || currentUser.tenantId, id, currentUser.userId);
  }
}
