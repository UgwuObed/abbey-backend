import { Request, Response } from 'express';
import { FollowService } from '../services/follow';
import { sendSuccess, sendNotFound, sendError, sendCreated } from '../utils';
import { asyncHandler } from '../middleware';

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    username: string;
  };
}

export class FollowController {
  constructor(private followService: FollowService) {}

  followUser = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id: followingId } = req.params;
    const authReq = req as AuthenticatedRequest;
    const followerId = authReq.user!.id;

    const follow = await this.followService.followUser(followerId, followingId);
    sendCreated(res, follow, 'User followed successfully');
  });

  unfollowUser = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id: followingId } = req.params;
    const authReq = req as AuthenticatedRequest;
    const followerId = authReq.user!.id;

    await this.followService.unfollowUser(followerId, followingId);
    sendSuccess(res, null, 'User unfollowed successfully');
  });

  getFollowers = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id: userId } = req.params;
    const { page = '1', limit = '10' } = req.query;
    
    const pageNum = parseInt(page as string);
    const limitNum = Math.min(parseInt(limit as string), 50);

    const result = await this.followService.getFollowers(userId, {
      page: pageNum,
      limit: limitNum
    });

    sendSuccess(res, result);
  });

  getFollowing = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id: userId } = req.params;
    const { page = '1', limit = '10' } = req.query;
    
    const pageNum = parseInt(page as string);
    const limitNum = Math.min(parseInt(limit as string), 50);

    const result = await this.followService.getFollowing(userId, {
      page: pageNum,
      limit: limitNum
    });

    sendSuccess(res, result);
  });

  checkFollowStatus = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id: followingId } = req.params;
    const authReq = req as AuthenticatedRequest;
    const followerId = authReq.user!.id;

    const isFollowing = await this.followService.isFollowing(followerId, followingId);
    sendSuccess(res, { isFollowing });
  });
}