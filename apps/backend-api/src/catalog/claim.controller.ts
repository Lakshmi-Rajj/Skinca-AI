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
import { ClaimService } from './claim.service';
import { CreateClaimDto } from './dto/create-claim.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { CurrentTenant } from '../auth/decorators/current-tenant.decorator';
import { AuthenticatedUser } from '../auth/interfaces/auth.interface';

@ApiTags('Claim Management')
@ApiBearerAuth('bearer-auth')
@Controller('claims')
export class ClaimController {
  constructor(private claimService: ClaimService) {}

  @Get()
  @Roles('OWNER', 'ADMIN', 'MANAGER', 'STAFF', 'VIEWER')
  @ApiOperation({ summary: 'List all product claims for tenant' })
  @ApiResponse({ status: 200, description: 'Claims list returned' })
  async findAll(
    @CurrentTenant() tenantId: string,
    @CurrentUser() currentUser: AuthenticatedUser,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
  ): Promise<any> {
    return this.claimService.findAll(tenantId || currentUser.tenantId, {
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 20,
      search,
    });
  }

  @Post()
  @Roles('OWNER', 'ADMIN', 'MANAGER')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new product claim tag' })
  @ApiResponse({ status: 201, description: 'Claim created successfully' })
  async create(
    @CurrentTenant() tenantId: string,
    @CurrentUser() currentUser: AuthenticatedUser,
    @Body() dto: CreateClaimDto,
  ): Promise<any> {
    return this.claimService.create(tenantId || currentUser.tenantId, dto, currentUser.userId);
  }

  @Delete(':id')
  @Roles('OWNER', 'ADMIN')
  @ApiOperation({ summary: 'Delete a product claim tag' })
  @ApiResponse({ status: 200, description: 'Claim deleted' })
  async delete(
    @CurrentTenant() tenantId: string,
    @CurrentUser() currentUser: AuthenticatedUser,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<{ message: string }> {
    return this.claimService.delete(tenantId || currentUser.tenantId, id, currentUser.userId);
  }
}
