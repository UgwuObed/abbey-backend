import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils';
import { sendUnauthorized } from '../utils';

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; 

    if (!token) {
      sendUnauthorized(res, 'Access token is required');
      return;
    }

    const decoded = verifyToken(token);
    req.user = {
      id: decoded.userId,
      email: decoded.email,
      username: decoded.username
    };

    next();
  } catch (error) {
    console.error('Token verification error:', error);
    sendUnauthorized(res, 'Invalid or expired token');
  }
};

export const optionalAuth = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const decoded = verifyToken(token);
      req.user = {
        id: decoded.userId,
        email: decoded.email,
        username: decoded.username
      };
    }

    next();
  } catch (error) {

    next();
  }
};