import * as bcrypt from 'bcryptjs';

export class PasswordHasher {
  private static readonly SALT_ROUNDS = 10;

  static async hash(password: string): Promise<string> {
    return bcrypt.hash(password, PasswordHasher.SALT_ROUNDS);
  }

  static async compare(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
