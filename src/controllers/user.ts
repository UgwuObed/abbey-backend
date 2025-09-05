import { Request, Response } from 'express';
import { UserService } from '../services/user';
import { UpdateUserDto } from '../types';
import { sendSuccess, sendNotFound, sendError } from '../utils';
import { asyncHandler } from '../middleware';

export class UserController {
  constructor(private userService: UserService) {}

  getUserById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const user = await this.userService.getUserByIdWithStats(id);

    if (!user) {
      sendNotFound(res, 'User not found');
      return;
    }

    sendSuccess(res, user);
  });

  getUserByUsername = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { username } = req.params;
    const user = await this.userService.getUserByUsername(username);

    if (!user) {
      sendNotFound(res, 'User not found');
      return;
    }

    sendSuccess(res, user);
  });

  updateUser = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const updateData: UpdateUserDto = req.body;

    if (req.user?.id !== id) {
      sendError(res, 'Unauthorized', 403);
      return;
    }

    const user = await this.userService.updateUser(id, updateData);
    sendSuccess(res, user, 'Profile updated successfully');
  });

  deleteUser = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;


    if (req.user?.id !== id) {
      sendError(res, 'Unauthorized', 403);
      return;
    }

    await this.userService.deleteUser(id);
    sendSuccess(res, null, 'Account deleted successfully');
  });

  searchUsers = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { search, page = '1', limit = '10' } = req.query;
    const pageNum = parseInt(page as string);
    const limitNum = Math.min(parseInt(limit as string), 50);

    const skip = (pageNum - 1) * limitNum;
    const users = await this.userService.searchUsers({
      skip,
      take: limitNum,
      search: search as string
    });

    sendSuccess(res, {
      users,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: users.length
      }
    });
  });

  getCurrentUser = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const user = await this.userService.getUserByIdWithStats(req.user!.id);
    
    if (!user) {
      sendNotFound(res, 'User not found');
      return;
    }

    sendSuccess(res, user);
  });
}