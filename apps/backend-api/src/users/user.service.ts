import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { UserRepository, RoleRepository } from '@platform/database-client';
import { PasswordHasher } from '../auth/utils/password-hasher.util';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InviteUserDto } from './dto/invite-user.dto';
import { UserQueryDto } from './dto/user-query.dto';
import { AuditService } from '../audit/audit.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UserService {
  private userRepository = new UserRepository();
  private roleRepository = new RoleRepository();

  constructor(private auditService: AuditService) {}

  async findAllUsers(tenantId: string, query: UserQueryDto): Promise<{ items: any[]; total: number }> {
    const { items, total } = await this.userRepository.findAll(tenantId, {
      page: query.page,
      limit: query.limit,
      search: query.search,
    });

    const sanitizedItems = items.map((user) => {
      const { passwordHash: _, refreshTokenHash: __, ...userWithoutSecrets } = user;
      return userWithoutSecrets;
    });

    return { items: sanitizedItems, total };
  }

  async createUser(tenantId: string, dto: CreateUserDto, currentUserId: string): Promise<any> {
    const existing = await this.userRepository.findByEmail(tenantId, dto.email);
    if (existing) {
      throw new ConflictException('A user with this email address already exists');
    }

    const role = await this.roleRepository.findById(dto.roleId);
    if (!role) {
      throw new BadRequestException('Specified role does not exist');
    }

    const passwordHash = await PasswordHasher.hash(dto.password);
    const verificationToken = uuidv4();

    const user = await this.userRepository.create({
      tenant: { connect: { id: tenantId } },
      role: { connect: { id: dto.roleId } },
      email: dto.email,
      passwordHash,
      firstName: dto.firstName,
      lastName: dto.lastName,
      verificationToken,
      createdBy: currentUserId,
    });

    await this.auditService.logAction({
      tenantId,
      userId: currentUserId,
      action: 'USER_CREATED',
      entityType: 'USER',
      entityId: user.id,
      payload: { email: user.email, roleId: user.roleId },
    });

    const { passwordHash: _, refreshTokenHash: __, ...userWithoutSecrets } = user;
    return userWithoutSecrets;
  }

  async inviteUser(tenantId: string, dto: InviteUserDto, currentUserId: string): Promise<any> {
    const existing = await this.userRepository.findByEmail(tenantId, dto.email);
    if (existing) {
      throw new ConflictException('A user with this email address already exists');
    }

    const role = await this.roleRepository.findById(dto.roleId);
    if (!role) {
      throw new BadRequestException('Specified role does not exist');
    }

    const inviteToken = uuidv4();
    const temporaryPasswordHash = await PasswordHasher.hash(uuidv4());

    const user = await this.userRepository.create({
      tenant: { connect: { id: tenantId } },
      role: { connect: { id: dto.roleId } },
      email: dto.email,
      passwordHash: temporaryPasswordHash,
      firstName: dto.firstName,
      lastName: dto.lastName,
      verificationToken: inviteToken,
      createdBy: currentUserId,
    });

    await this.auditService.logAction({
      tenantId,
      userId: currentUserId,
      action: 'USER_INVITED',
      entityType: 'USER',
      entityId: user.id,
      payload: { email: user.email, roleId: user.roleId, inviteToken },
    });

    const { passwordHash: _, refreshTokenHash: __, ...userWithoutSecrets } = user;
    return { ...userWithoutSecrets, inviteToken };
  }

  async findUserById(tenantId: string, id: string): Promise<any> {
    const user = await this.userRepository.findById(tenantId, id);
    if (!user || user.deletedAt) {
      throw new NotFoundException('User not found');
    }
    const { passwordHash: _, refreshTokenHash: __, ...userWithoutSecrets } = user;
    return userWithoutSecrets;
  }

  async updateUser(
    tenantId: string,
    id: string,
    dto: UpdateUserDto,
    currentUserId: string,
  ): Promise<any> {
    const user = await this.userRepository.findById(tenantId, id);
    if (!user || user.deletedAt) {
      throw new NotFoundException('User not found');
    }

    if (dto.roleId) {
      const role = await this.roleRepository.findById(dto.roleId);
      if (!role) {
        throw new BadRequestException('Specified role does not exist');
      }
    }

    const updatedUser = await this.userRepository.update(tenantId, id, {
      ...dto,
      updatedBy: currentUserId,
    });

    await this.auditService.logAction({
      tenantId,
      userId: currentUserId,
      action: 'USER_UPDATED',
      entityType: 'USER',
      entityId: id,
      payload: dto as Record<string, unknown>,
    });

    const { passwordHash: _, refreshTokenHash: __, ...userWithoutSecrets } = updatedUser;
    return userWithoutSecrets;
  }

  async deleteUser(tenantId: string, id: string, currentUserId: string): Promise<{ message: string }> {
    const user = await this.userRepository.findById(tenantId, id);
    if (!user || user.deletedAt) {
      throw new NotFoundException('User not found');
    }

    await this.userRepository.softDelete(tenantId, id);

    await this.auditService.logAction({
      tenantId,
      userId: currentUserId,
      action: 'USER_DELETED',
      entityType: 'USER',
      entityId: id,
    });

    return { message: 'User deleted successfully' };
  }
}
