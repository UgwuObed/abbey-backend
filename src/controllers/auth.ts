import { Request, Response } from 'express';
import { AuthService } from '../services/auth';
import { RegisterDto, LoginDto } from '../types';
import { sendSuccess, sendCreated, sendUnauthorized, sendError } from '../utils';
import { asyncHandler } from '../middleware';

export class AuthController {
  constructor(private authService: AuthService) {}

  register = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const registerData: RegisterDto = req.body;
    const authResponse = await this.authService.register(registerData);
    
    sendCreated(res, authResponse, 'User registered successfully');
  });

  login = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const loginData: LoginDto = req.body;
    const authResponse = await this.authService.login(loginData);
    
    if (!authResponse) {
      sendUnauthorized(res, 'Invalid email or password');
      return;
    }

    sendSuccess(res, authResponse, 'Login successful');
  });


  getProfile = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const user = await this.authService.getProfile(req.user!.id);
    
    if (!user) {
      sendUnauthorized(res, 'User not found');
      return;
    }

    sendSuccess(res, user);
  });

  refreshToken = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      sendError(res, 'Refresh token is required', 400);
      return;
    }

    const authResponse = await this.authService.refreshToken(refreshToken);
    
    if (!authResponse) {
      sendUnauthorized(res, 'Invalid refresh token');
      return;
    }

    sendSuccess(res, authResponse, 'Token refreshed successfully');
  });
}