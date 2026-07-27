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
import { AuditService } from '../audit/audit.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UserService {
  private userRepository = new UserRepository();
  private roleRepository = new RoleRepository();

  constructor(private auditService: AuditService) {}

  async createUser(tenantId: string, dto: CreateUserDto, currentUserId: string) {
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

  async findUserById(tenantId: string, id: string) {
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
  ) {
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

  async deleteUser(tenantId: string, id: string, currentUserId: string) {
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
