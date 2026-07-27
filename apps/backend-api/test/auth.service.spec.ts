import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '../src/auth/auth.service';
import { AuditService } from '../src/audit/audit.service';
import { PasswordHasher } from '../src/auth/utils/password-hasher.util';

describe('AuthService & PasswordHasher Unit Tests', () => {
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: {
            sign: () => 'mock_jwt_token',
            verify: () => ({ sub: 'user_123', tenantId: 'tenant_123' }),
          },
        },
        {
          provide: AuditService,
          useValue: {
            logAction: jest.fn().mockResolvedValue({ id: 'audit_123' }),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('PasswordHasher', () => {
    it('should correctly hash and verify passwords using bcrypt', async () => {
      const rawPassword = 'SecureTestPassword123!';
      const hash = await PasswordHasher.hash(rawPassword);

      expect(hash).toBeDefined();
      expect(hash).not.toEqual(rawPassword);

      const isValid = await PasswordHasher.verify(rawPassword, hash);
      expect(isValid).toBe(true);

      const isInvalid = await PasswordHasher.verify('WrongPassword', hash);
      expect(isInvalid).toBe(false);
    });
  });
});
