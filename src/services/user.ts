import { UserRepository } from '../repositories/user';
import { CreateUserDto, UpdateUserDto, UserResponse, UserWithStats } from '../types';
import { hashPassword, comparePassword } from '../utils';
import { AppError } from '../middleware';

export class UserService {
  constructor(private userRepository: UserRepository) {}

  async createUser(userData: CreateUserDto): Promise<UserResponse> {
    const existingEmail = await this.userRepository.checkEmailExists(userData.email);
    if (existingEmail) {
      throw new AppError('Email already exists', 400);
    }

    const existingUsername = await this.userRepository.checkUsernameExists(userData.username);
    if (existingUsername) {
      throw new AppError('Username already exists', 400);
    }

    const hashedPassword = await hashPassword(userData.password);


    const user = await this.userRepository.create({
      ...userData,
      password: hashedPassword
    });

    return this.toUserResponse(user);
  }

  async getUserById(id: string): Promise<UserResponse | null> {
    const user = await this.userRepository.findById(id);
    if (!user) return null;
    
    return this.toUserResponse(user);
  }

  async getUserByIdWithStats(id: string): Promise<UserWithStats | null> {
    const result = await this.userRepository.findByIdWithStats(id);
    if (!result) return null;

    return {
      ...this.toUserResponse(result),
      followingCount: result._count.following,
      followersCount: result._count.followers,
      postsCount: result._count.posts
    };
  }

  async getUserByEmail(email: string): Promise<UserResponse | null> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) return null;
    
    return this.toUserResponse(user);
  }

  async getUserByUsername(username: string): Promise<UserResponse | null> {
    const user = await this.userRepository.findByUsername(username);
    if (!user) return null;
    
    return this.toUserResponse(user);
  }

  async updateUser(id: string, updateData: UpdateUserDto): Promise<UserResponse> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    const updatedUser = await this.userRepository.update(id, updateData);
    return this.toUserResponse(updatedUser);
  }

  async deleteUser(id: string): Promise<void> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    await this.userRepository.delete(id);
  }

  async searchUsers(options: {
    skip?: number;
    take?: number;
    search?: string;
  } = {}): Promise<UserResponse[]> {
    const users = await this.userRepository.findMany(options);
    return users.map((user: any) => this.toUserResponse(user));
  }

  async validateUserPassword(email: string, password: string): Promise<UserResponse | null> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) return null;

    const isValidPassword = await comparePassword(password, user.password);
    if (!isValidPassword) return null;

    return this.toUserResponse(user);
  }

  private toUserResponse(user: any): UserResponse {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}