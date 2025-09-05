import { UserService } from './user';
import { RegisterDto, LoginDto, AuthResponse, UserResponse } from '../types';
import { generateToken, verifyToken } from '../utils';

export class AuthService {
  constructor(private userService: UserService) {}

  async register(userData: RegisterDto): Promise<AuthResponse> {
    const user = await this.userService.createUser(userData);
    
    const token = generateToken({
      userId: user.id,
      email: user.email,
      username: user.username
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName
      },
      token
    };
  }

  async login(loginData: LoginDto): Promise<AuthResponse | null> {
    const user = await this.userService.validateUserPassword(
      loginData.email, 
      loginData.password
    );

    if (!user) {
      return null;
    }

    const token = generateToken({
      userId: user.id,
      email: user.email,
      username: user.username
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName
      },
      token
    };
  }

  async getProfile(userId: string): Promise<UserResponse | null> {
    return this.userService.getUserByIdWithStats(userId);
  }

  async refreshToken(refreshToken: string): Promise<AuthResponse | null> {
    try {
      const decoded = verifyToken(refreshToken);
      const user = await this.userService.getUserById(decoded.userId);
      
      if (!user) {
        return null;
      }

      const newToken = generateToken({
        userId: user.id,
        email: user.email,
        username: user.username
      });

      return {
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName
        },
        token: newToken
      };
    } catch (error) {
      return null;
    }
  }
}