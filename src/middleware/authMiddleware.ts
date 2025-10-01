import { Request, Response, NextFunction } from 'express';
import { TokenUtils } from '../utils/tokenutils';

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Access token required' 
      });
    }

    // Verify token signature and check blacklist
    const payload = TokenUtils.verifyToken(token);
    if (!payload) {
      return res.status(403).json({ 
        success: false, 
        message: 'Invalid, expired, or logged out token' 
      });
    }

    // Add user to request object
    req.user = {
      id: payload.userId,
      email: payload.email
    };

    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Internal server error during authentication' 
    });
  }
};