import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../types/express';
import { TokenUtils } from '../utils/tokenutils';

export class AuthController {
  // Logout endpoint
  static async logout(req: AuthenticatedRequest, res: Response) {
    try {
      const authHeader = req.headers['authorization'];
      const token = authHeader && authHeader.split(' ')[1];

      if (!token) {
        return res.status(400).json({
          success: false,
          message: 'Token is required for logout'
        });
      }

      // Add token to blacklist
      TokenUtils.addToBlacklist(token);

      res.json({
        success: true,
        message: 'Successfully logged out'
      });
    } catch (error) {
      console.error('Logout error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error during logout'
      });
    }
  }

  // Optional: Login endpoint for testing
  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      // Simple mock authentication (replace with real auth logic)
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Email and password are required'
        });
      }

      // Mock user validation - in real app, check against database
      const mockUser = {
        id: 'user-123',
        email: email,
        name: 'Test User'
      };

      // Generate token
      const token = TokenUtils.generateToken({
        userId: mockUser.id,
        email: mockUser.email
      });

      res.json({
        success: true,
        message: 'Login successful',
        data: {
          token,
          user: mockUser
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error during login'
      });
    }
  }

  // Optional: Verify token endpoint
  static async verify(req: AuthenticatedRequest, res: Response) {
    res.json({
      success: true,
      message: 'Token is valid',
      user: req.user
    });
  }
}