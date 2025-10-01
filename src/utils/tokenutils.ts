import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// In-memory blacklist for logged out tokens (use Redis in production)
const tokenBlacklist = new Set<string>();

export interface TokenPayload {
  userId: string;
  email: string;
}

export class TokenUtils {
  static generateToken(payload: TokenPayload): string {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
  }

  static verifyToken(token: string): TokenPayload | null {
    try {
      // Check if token is blacklisted
      if (tokenBlacklist.has(token)) {
        return null;
      }
      return jwt.verify(token, JWT_SECRET) as TokenPayload;
    } catch (error) {
      return null;
    }
  }

  static addToBlacklist(token: string): void {
    tokenBlacklist.add(token);
  }

  static isBlacklisted(token: string): boolean {
    return tokenBlacklist.has(token);
  }

  // Optional: Clean up expired tokens from blacklist periodically
  static cleanBlacklist(): void {
    // In a production app, you might want to implement cleanup logic
    // or use Redis with TTL instead
  }
}