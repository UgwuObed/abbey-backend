import { PostRepository } from '../repositories';
import { CreatePostDto, UpdatePostDto, PostResponse } from '../types';
import { AppError } from '../middleware';

export class PostService {
  constructor(private postRepository: PostRepository) {}

  async createPost(authorId: string, postData: CreatePostDto): Promise<PostResponse> {
    if (!postData.content || postData.content.trim().length === 0) {
      throw new AppError('Post content is required', 400);
    }

    if (postData.content.length > 2000) {
      throw new AppError('Post content cannot exceed 2000 characters', 400);
    }

    const post = await this.postRepository.create({
      ...postData,
      content: postData.content.trim(),
      authorId
    });

    return {
      id: post.id,
      content: post.content,
      authorId: post.authorId,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      author: post.author
    };
  }

  async getPostById(id: string): Promise<PostResponse | null> {
    const post = await this.postRepository.findById(id);
    if (!post) return null;

    return {
      id: post.id,
      content: post.content,
      authorId: post.authorId,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      author: post.author
    };
  }

  async getUserPosts(authorId: string, options: { page?: number; limit?: number } = {}): Promise<{
    posts: PostResponse[];
    pagination: { page: number; limit: number; total: number };
  }> {
    const { page = 1, limit = 10 } = options;
    const skip = (page - 1) * limit;

    const posts = await this.postRepository.findByAuthorId(authorId, { skip, take: limit });

    return {
      posts: posts.map((post: { id: any; content: any; authorId: any; createdAt: any; updatedAt: any; author: any; }) => ({
        id: post.id,
        content: post.content,
        authorId: post.authorId,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
        author: post.author
      })),
      pagination: {
        page,
        limit,
        total: posts.length
      }
    };
  }

  async getFeed(userId: string, options: { page?: number; limit?: number } = {}): Promise<{
    posts: PostResponse[];
    pagination: { page: number; limit: number; total: number };
  }> {
    const { page = 1, limit = 10 } = options;
    const skip = (page - 1) * limit;

    const posts = await this.postRepository.getFeed(userId, { skip, take: limit });

    return {
      posts: posts.map((post: { id: any; content: any; authorId: any; createdAt: any; updatedAt: any; author: any; }) => ({
        id: post.id,
        content: post.content,
        authorId: post.authorId,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
        author: post.author
      })),
      pagination: {
        page,
        limit,
        total: posts.length
      }
    };
  }

  async updatePost(id: string, authorId: string, updateData: UpdatePostDto): Promise<PostResponse> {
    const existingPost = await this.postRepository.findById(id);
    if (!existingPost) {
      throw new AppError('Post not found', 404);
    }

    if (existingPost.authorId !== authorId) {
      throw new AppError('You can only edit your own posts', 403);
    }

    if (updateData.content !== undefined) {
      if (!updateData.content || updateData.content.trim().length === 0) {
        throw new AppError('Post content cannot be empty', 400);
      }

      if (updateData.content.length > 2000) {
        throw new AppError('Post content cannot exceed 2000 characters', 400);
      }

      updateData.content = updateData.content.trim();
    }

    const post = await this.postRepository.update(id, updateData);

    return {
      id: post.id,
      content: post.content,
      authorId: post.authorId,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      author: post.author
    };
  }

  async deletePost(id: string, authorId: string): Promise<void> {
    const existingPost = await this.postRepository.findById(id);
    if (!existingPost) {
      throw new AppError('Post not found', 404);
    }

    if (existingPost.authorId !== authorId) {
      throw new AppError('You can only delete your own posts', 403);
    }

    await this.postRepository.delete(id);
  }

  async getAllPosts(options: { page?: number; limit?: number } = {}): Promise<{
    posts: PostResponse[];
    pagination: { page: number; limit: number; total: number };
  }> {
    const { page = 1, limit = 10 } = options;
    const skip = (page - 1) * limit;

    const posts = await this.postRepository.findMany({ skip, take: limit });

    return {
      posts: posts.map((post: { id: any; content: any; authorId: any; createdAt: any; updatedAt: any; author: any; }) => ({
        id: post.id,
        content: post.content,
        authorId: post.authorId,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
        author: post.author
      })),
      pagination: {
        page,
        limit,
        total: posts.length
      }
    };
  }
}