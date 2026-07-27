import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { SkinProfileDto } from './dto/skin-profile.dto';
import { AssessmentSubmissionDto } from './dto/assessment.dto';
import { RecordRecommendationHistoryDto } from './dto/history.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { CurrentTenant } from '../auth/decorators/current-tenant.decorator';
import { AuthenticatedUser } from '../auth/interfaces/auth.interface';

@ApiTags('Customer & Skin Profile')
@ApiBearerAuth('bearer-auth')
@Controller()
export class CustomerController {
  constructor(private customerService: CustomerService) {}

  @Post('customers')
  @Roles('OWNER', 'ADMIN', 'MANAGER', 'STAFF')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a customer account' })
  async createCustomer(
    @CurrentTenant() tenantId: string,
    @CurrentUser() currentUser: AuthenticatedUser,
    @Body() dto: CreateCustomerDto,
  ): Promise<any> {
    return this.customerService.createCustomer(tenantId || currentUser.tenantId, dto);
  }

  @Get('customers/:id')
  @Roles('OWNER', 'ADMIN', 'MANAGER', 'STAFF', 'VIEWER')
  @ApiOperation({ summary: 'Get customer profile details by ID' })
  async getCustomerById(
    @CurrentTenant() tenantId: string,
    @CurrentUser() currentUser: AuthenticatedUser,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<any> {
    return this.customerService.getCustomerById(tenantId || currentUser.tenantId, id);
  }

  @Put('customers/:id')
  @Roles('OWNER', 'ADMIN', 'MANAGER', 'STAFF')
  @ApiOperation({ summary: 'Update customer details' })
  async updateCustomer(
    @CurrentTenant() tenantId: string,
    @CurrentUser() currentUser: AuthenticatedUser,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateCustomerDto,
  ): Promise<any> {
    return this.customerService.updateCustomer(tenantId || currentUser.tenantId, id, dto);
  }

  @Delete('customers/:id')
  @Roles('OWNER', 'ADMIN')
  @ApiOperation({ summary: 'Delete customer account' })
  async deleteCustomer(
    @CurrentTenant() tenantId: string,
    @CurrentUser() currentUser: AuthenticatedUser,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<any> {
    return this.customerService.deleteCustomer(tenantId || currentUser.tenantId, id);
  }

  @Post('customers/:id/profile')
  @Roles('OWNER', 'ADMIN', 'MANAGER', 'STAFF')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new skin profile version for customer' })
  async createSkinProfileVersion(
    @CurrentTenant() tenantId: string,
    @CurrentUser() currentUser: AuthenticatedUser,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: SkinProfileDto,
  ): Promise<any> {
    return this.customerService.createSkinProfileVersion(tenantId || currentUser.tenantId, id, dto);
  }

  @Get('customers/:id/profile')
  @Roles('OWNER', 'ADMIN', 'MANAGER', 'STAFF', 'VIEWER')
  @ApiOperation({ summary: 'Get current skin profile for customer' })
  async getCurrentSkinProfile(
    @CurrentTenant() tenantId: string,
    @CurrentUser() currentUser: AuthenticatedUser,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<any> {
    return this.customerService.getCurrentSkinProfile(tenantId || currentUser.tenantId, id);
  }

  @Get('customers/:id/profile/history')
  @Roles('OWNER', 'ADMIN', 'MANAGER', 'STAFF', 'VIEWER')
  @ApiOperation({ summary: 'Get skin profile version history' })
  async getSkinProfileHistory(
    @CurrentTenant() tenantId: string,
    @CurrentUser() currentUser: AuthenticatedUser,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<any[]> {
    return this.customerService.getSkinProfileHistory(tenantId || currentUser.tenantId, id);
  }

  @Post('assessment')
  @Roles('OWNER', 'ADMIN', 'MANAGER', 'STAFF')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Submit skin assessment questionnaire' })
  async submitAssessment(
    @CurrentTenant() tenantId: string,
    @CurrentUser() currentUser: AuthenticatedUser,
    @Body() dto: AssessmentSubmissionDto,
  ): Promise<any> {
    return this.customerService.submitAssessment(tenantId || currentUser.tenantId, dto);
  }

  @Get('assessment/:id')
  @Roles('OWNER', 'ADMIN', 'MANAGER', 'STAFF', 'VIEWER')
  @ApiOperation({ summary: 'Get assessment details by ID' })
  async getAssessmentById(@Param('id', ParseUUIDPipe) id: string): Promise<any> {
    return this.customerService.getAssessmentById(id);
  }

  @Get('customers/:id/assessment-history')
  @Roles('OWNER', 'ADMIN', 'MANAGER', 'STAFF', 'VIEWER')
  @ApiOperation({ summary: 'Get customer assessment questionnaire history' })
  async getCustomerAssessmentHistory(
    @CurrentTenant() tenantId: string,
    @CurrentUser() currentUser: AuthenticatedUser,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<any[]> {
    return this.customerService.getCustomerAssessmentHistory(tenantId || currentUser.tenantId, id);
  }

  @Post('customers/:id/recommendation-history')
  @Roles('OWNER', 'ADMIN', 'MANAGER', 'STAFF')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Record recommendation history entry for customer' })
  async recordRecommendationHistory(
    @CurrentTenant() tenantId: string,
    @CurrentUser() currentUser: AuthenticatedUser,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: RecordRecommendationHistoryDto,
  ): Promise<any> {
    return this.customerService.recordRecommendationHistory(tenantId || currentUser.tenantId, id, dto);
  }

  @Get('customers/:id/recommendation-history')
  @Roles('OWNER', 'ADMIN', 'MANAGER', 'STAFF', 'VIEWER')
  @ApiOperation({ summary: 'Get customer recommendation history' })
  async getCustomerRecommendationHistory(
    @CurrentTenant() tenantId: string,
    @CurrentUser() currentUser: AuthenticatedUser,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<any[]> {
    return this.customerService.getCustomerRecommendationHistory(tenantId || currentUser.tenantId, id);
  }
}
