import { PrismaClient } from '@prisma/client';
import { CreateUserDto, UpdateUserDto } from '../types';

export class UserRepository {
  constructor(private prisma: PrismaClient) {}

  async create(data: CreateUserDto) {
    return this.prisma.user.create({
      data
    });
  }

  async findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id }
    });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email }
    });
  }

  async findByUsername(username: string) {
    return this.prisma.user.findUnique({
      where: { username }
    });
  }

  async findByIdWithStats(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            followers: true,
            following: true,
            posts: true
          }
        }
      }
    });
  }

  async findByIdWithPosts(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      include: {
        posts: {
          orderBy: { createdAt: 'desc' }
        }
      }
    });
  }

  async update(id: string, data: UpdateUserDto) {
    return this.prisma.user.update({
      where: { id },
      data
    });
  }

  async delete(id: string) {
    return this.prisma.user.delete({
      where: { id }
    });
  }

  async findMany(options: {
    skip?: number;
    take?: number;
    search?: string;
  } = {}) {
    const { skip = 0, take = 10, search } = options;

    const where = search
      ? {
          OR: [
            { username: { contains: search, mode: 'insensitive' as const } },
            { firstName: { contains: search, mode: 'insensitive' as const } },
            { lastName: { contains: search, mode: 'insensitive' as const } }
          ]
        }
      : {};

    return this.prisma.user.findMany({
      where,
      skip,
      take,
      orderBy: { createdAt: 'desc' }
    });
  }

  async checkEmailExists(email: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      select: { id: true }
    });
    return !!user;
  }

  async checkUsernameExists(username: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { username },
      select: { id: true }
    });
    return !!user;
  }
}