import { PrismaClient } from '@prisma/client';
import { CreatePostDto, UpdatePostDto } from '../types';

export class PostRepository {
  constructor(private prisma: PrismaClient) {}

  async create(data: CreatePostDto & { authorId: string }) {
    return this.prisma.post.create({
      data,
      include: {
        author: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatar: true
          }
        }
      }
    });
  }

  async findById(id: string) {
    return this.prisma.post.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatar: true
          }
        }
      }
    });
  }

  async findByAuthorId(authorId: string, options: { skip?: number; take?: number } = {}) {
    const { skip = 0, take = 10 } = options;
    
    return this.prisma.post.findMany({
      where: { authorId },
      include: {
        author: {
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

  async getFeed(userId: string, options: { skip?: number; take?: number } = {}) {
    const { skip = 0, take = 10 } = options;

    return this.prisma.post.findMany({
      where: {
        OR: [
          { authorId: userId },
          {
            author: {
              followers: {
                some: {
                  followerId: userId
                }
              }
            }
          }
        ]
      },
      include: {
        author: {
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

  async update(id: string, data: UpdatePostDto) {
    return this.prisma.post.update({
      where: { id },
      data,
      include: {
        author: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatar: true
          }
        }
      }
    });
  }

  async delete(id: string) {
    return this.prisma.post.delete({
      where: { id }
    });
  }

  async findMany(options: { skip?: number; take?: number } = {}) {
    const { skip = 0, take = 10 } = options;
    
    return this.prisma.post.findMany({
      include: {
        author: {
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
}