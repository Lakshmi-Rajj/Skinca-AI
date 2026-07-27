import * as bcrypt from 'bcryptjs';

export class PasswordHasher {
  private static readonly SALT_ROUNDS = 12;

  static async hash(plainText: string): Promise<string> {
    return bcrypt.hash(plainText, this.SALT_ROUNDS);
  }

  static async verify(plainText: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plainText, hash);
  }
}
