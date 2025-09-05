import { PrismaClient } from '@prisma/client';

export class UserFollowRepository {
  constructor(private prisma: PrismaClient) {}

  async follow(followerId: string, followingId: string) {
    return this.prisma.userFollow.create({
      data: {
        followerId,
        followingId
      }
    });
  }

  async unfollow(followerId: string, followingId: string) {
    return this.prisma.userFollow.delete({
      where: {
        followerId_followingId: {
          followerId,
          followingId
        }
      }
    });
  }

  async isFollowing(followerId: string, followingId: string): Promise<boolean> {
    const follow = await this.prisma.userFollow.findUnique({
      where: {
        followerId_followingId: {
          followerId,
          followingId
        }
      }
    });
    return !!follow;
  }

  async getFollowers(userId: string, options: { skip?: number; take?: number } = {}) {
    const { skip = 0, take = 10 } = options;
    
    return this.prisma.userFollow.findMany({
      where: { followingId: userId },
      include: {
        follower: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatar: true
          }
        }
      },
      skip,
      take,
      orderBy: { createdAt: 'desc' }
    });
  }

  async getFollowing(userId: string, options: { skip?: number; take?: number } = {}) {
    const { skip = 0, take = 10 } = options;
    
    return this.prisma.userFollow.findMany({
      where: { followerId: userId },
      include: {
        following: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatar: true
          }
        }
      },
      skip,
      take,
      orderBy: { createdAt: 'desc' }
    });
  }

  async getFollowCounts(userId: string) {
    const [followersCount, followingCount] = await Promise.all([
      this.prisma.userFollow.count({
        where: { followingId: userId }
      }),
      this.prisma.userFollow.count({
        where: { followerId: userId }
      })
    ]);

    return { followersCount, followingCount };
  }
}