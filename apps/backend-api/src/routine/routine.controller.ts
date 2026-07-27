import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { RoutineService } from './routine.service';
import { GenerateRoutineRequestDto } from './dto/routine-request.dto';
import { PersonalizedRoutineResponseDto } from './dto/routine-response.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { CurrentTenant } from '../auth/decorators/current-tenant.decorator';
import { AuthenticatedUser } from '../auth/interfaces/auth.interface';

@ApiTags('Routine Builder')
@ApiBearerAuth('bearer-auth')
@Controller()
export class RoutineController {
  constructor(private routineService: RoutineService) {}

  @Post('routines/generate')
  @Roles('OWNER', 'ADMIN', 'MANAGER', 'STAFF')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Generate personalized skincare routine' })
  @ApiResponse({ status: 201, description: 'Personalized routine created successfully' })
  async generateRoutine(
    @CurrentTenant() tenantId: string,
    @CurrentUser() currentUser: AuthenticatedUser,
    @Body() dto: GenerateRoutineRequestDto,
  ): Promise<PersonalizedRoutineResponseDto> {
    return this.routineService.generateRoutine(tenantId || currentUser.tenantId, dto);
  }

  @Get('routines/:id')
  @Roles('OWNER', 'ADMIN', 'MANAGER', 'STAFF', 'VIEWER')
  @ApiOperation({ summary: 'Get personalized routine details by ID' })
  async getRoutineById(
    @CurrentTenant() tenantId: string,
    @CurrentUser() currentUser: AuthenticatedUser,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<any> {
    return this.routineService.getRoutineById(tenantId || currentUser.tenantId, id);
  }

  @Get('customers/:id/routines')
  @Roles('OWNER', 'ADMIN', 'MANAGER', 'STAFF', 'VIEWER')
  @ApiOperation({ summary: 'Get customer routine generation history' })
  async getCustomerRoutines(
    @CurrentTenant() tenantId: string,
    @CurrentUser() currentUser: AuthenticatedUser,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<any[]> {
    return this.routineService.getCustomerRoutines(tenantId || currentUser.tenantId, id);
  }
}
