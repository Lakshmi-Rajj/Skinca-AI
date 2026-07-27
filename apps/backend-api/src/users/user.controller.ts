import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Query,
  Body,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InviteUserDto } from './dto/invite-user.dto';
import { UserQueryDto } from './dto/user-query.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { CurrentTenant } from '../auth/decorators/current-tenant.decorator';
import { AuthenticatedUser } from '../auth/interfaces/auth.interface';

@ApiTags('User Management')
@ApiBearerAuth('bearer-auth')
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  @Roles('OWNER', 'ADMIN', 'MANAGER', 'STAFF')
  @ApiOperation({ summary: 'List tenant users with pagination and search filters' })
  @ApiResponse({ status: 200, description: 'Paginated user list returned' })
  async findAllUsers(
    @CurrentTenant() tenantId: string,
    @CurrentUser() currentUser: AuthenticatedUser,
    @Query() query: UserQueryDto,
  ): Promise<{ items: any[]; total: number }> {
    return this.userService.findAllUsers(tenantId || currentUser.tenantId, query);
  }

  @Post()
  @Roles('OWNER', 'ADMIN')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new tenant user account' })
  @ApiResponse({ status: 201, description: 'User account created successfully' })
  async createUser(
    @CurrentTenant() tenantId: string,
    @CurrentUser() currentUser: AuthenticatedUser,
    @Body() dto: CreateUserDto,
  ): Promise<any> {
    return this.userService.createUser(tenantId || currentUser.tenantId, dto, currentUser.userId);
  }

  @Post('invite')
  @Roles('OWNER', 'ADMIN')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Invite a new team member to the tenant workspace' })
  @ApiResponse({ status: 201, description: 'User invitation sent successfully' })
  async inviteUser(
    @CurrentTenant() tenantId: string,
    @CurrentUser() currentUser: AuthenticatedUser,
    @Body() dto: InviteUserDto,
  ): Promise<any> {
    return this.userService.inviteUser(tenantId || currentUser.tenantId, dto, currentUser.userId);
  }

  @Get(':id')
  @Roles('OWNER', 'ADMIN', 'MANAGER', 'STAFF')
  @ApiOperation({ summary: 'Retrieve user account details by ID' })
  @ApiResponse({ status: 200, description: 'User details returned' })
  async getUserById(
    @CurrentTenant() tenantId: string,
    @CurrentUser() currentUser: AuthenticatedUser,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<any> {
    return this.userService.findUserById(tenantId || currentUser.tenantId, id);
  }

  @Patch(':id')
  @Roles('OWNER', 'ADMIN')
  @ApiOperation({ summary: 'Update user account information and role assignment' })
  @ApiResponse({ status: 200, description: 'User account updated successfully' })
  async updateUser(
    @CurrentTenant() tenantId: string,
    @CurrentUser() currentUser: AuthenticatedUser,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateUserDto,
  ): Promise<any> {
    return this.userService.updateUser(tenantId || currentUser.tenantId, id, dto, currentUser.userId);
  }

  @Delete(':id')
  @Roles('OWNER', 'ADMIN')
  @ApiOperation({ summary: 'Soft delete a tenant user account' })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  async deleteUser(
    @CurrentTenant() tenantId: string,
    @CurrentUser() currentUser: AuthenticatedUser,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<{ message: string }> {
    return this.userService.deleteUser(tenantId || currentUser.tenantId, id, currentUser.userId);
  }
}
