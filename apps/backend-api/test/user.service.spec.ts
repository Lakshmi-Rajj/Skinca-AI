import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../src/users/user.service';
import { AuditService } from '../src/audit/audit.service';

describe('UserService Unit Tests', () => {
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: AuditService,
          useValue: {
            logAction: jest.fn().mockResolvedValue({ id: 'audit_123' }),
          },
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });
});
