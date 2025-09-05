import { UserFollowRepository, UserRepository } from '../repositories';
import { FollowResponse, FollowerResponse, FollowingResponse } from '../types';
import { AppError } from '../middleware';

export class FollowService {
  constructor(
    private userFollowRepository: UserFollowRepository,
    private userRepository: UserRepository
  ) {}

  async followUser(followerId: string, followingId: string): Promise<FollowResponse> {
    if (followerId === followingId) {
      throw new AppError('Cannot follow yourself', 400);
    }

    const userToFollow = await this.userRepository.findById(followingId);
    if (!userToFollow) {
      throw new AppError('User to follow not found', 404);
    }

    const isAlreadyFollowing = await this.userFollowRepository.isFollowing(followerId, followingId);
    if (isAlreadyFollowing) {
      throw new AppError('Already following this user', 400);
    }

    const follow = await this.userFollowRepository.follow(followerId, followingId);
    return {
      id: follow.id,
      followerId: follow.followerId,
      followingId: follow.followingId,
      createdAt: follow.createdAt
    };
  }

  async unfollowUser(followerId: string, followingId: string): Promise<void> {
    if (followerId === followingId) {
      throw new AppError('Cannot unfollow yourself', 400);
    }

    const isFollowing = await this.userFollowRepository.isFollowing(followerId, followingId);
    if (!isFollowing) {
      throw new AppError('Not following this user', 400);
    }

    await this.userFollowRepository.unfollow(followerId, followingId);
  }

  async getFollowers(userId: string, options: { page?: number; limit?: number } = {}): Promise<{
    followers: FollowerResponse[];
    pagination: { page: number; limit: number; total: number };
  }> {
    const { page = 1, limit = 10 } = options;
    const skip = (page - 1) * limit;

    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    const followers = await this.userFollowRepository.getFollowers(userId, { skip, take: limit });

    return {
      followers: followers.map((follow: { id: any; followerId: any; createdAt: any; follower: any; }) => ({
        id: follow.id,
        followerId: follow.followerId,
        createdAt: follow.createdAt,
        follower: follow.follower
      })),
      pagination: {
        page,
        limit,
        total: followers.length
      }
    };
  }

  async getFollowing(userId: string, options: { page?: number; limit?: number } = {}): Promise<{
    following: FollowingResponse[];
    pagination: { page: number; limit: number; total: number };
  }> {
    const { page = 1, limit = 10 } = options;
    const skip = (page - 1) * limit;

    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    const following = await this.userFollowRepository.getFollowing(userId, { skip, take: limit });

    return {
      following: following.map((follow: { id: any; followingId: any; createdAt: any; following: any; }) => ({
        id: follow.id,
        followingId: follow.followingId,
        createdAt: follow.createdAt,
        following: follow.following
      })),
      pagination: {
        page,
        limit,
        total: following.length
      }
    };
  }

  async isFollowing(followerId: string, followingId: string): Promise<boolean> {
    return this.userFollowRepository.isFollowing(followerId, followingId);
  }

  async getFollowCounts(userId: string) {
    return this.userFollowRepository.getFollowCounts(userId);
  }
}