import { Request, Response } from 'express';
import { PostService } from '../services/post';
import { CreatePostDto, UpdatePostDto } from '../types';
import { sendSuccess, sendNotFound, sendError, sendCreated } from '../utils';
import { asyncHandler } from '../middleware';

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    username: string;
  };
}

export class PostController {
  constructor(private postService: PostService) {}

  createPost = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const authReq = req as AuthenticatedRequest;
    const authorId = authReq.user!.id;
    const postData: CreatePostDto = req.body;

    const post = await this.postService.createPost(authorId, postData);
    sendCreated(res, post, 'Post created successfully');
  });

  getPostById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const post = await this.postService.getPostById(id);

    if (!post) {
      sendNotFound(res, 'Post not found');
      return;
    }

    sendSuccess(res, post);
  });

  getFeed = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const authReq = req as AuthenticatedRequest;
    const userId = authReq.user!.id;
    const { page = '1', limit = '10' } = req.query;
    
    const pageNum = parseInt(page as string);
    const limitNum = Math.min(parseInt(limit as string), 50);

    const result = await this.postService.getFeed(userId, {
      page: pageNum,
      limit: limitNum
    });

    sendSuccess(res, result);
  });

  getUserPosts = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id: authorId } = req.params;
    const { page = '1', limit = '10' } = req.query;
    
    const pageNum = parseInt(page as string);
    const limitNum = Math.min(parseInt(limit as string), 50);

    const result = await this.postService.getUserPosts(authorId, {
      page: pageNum,
      limit: limitNum
    });

    sendSuccess(res, result);
  });

  updatePost = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const authReq = req as AuthenticatedRequest;
    const authorId = authReq.user!.id;
    const updateData: UpdatePostDto = req.body;

    const post = await this.postService.updatePost(id, authorId, updateData);
    sendSuccess(res, post, 'Post updated successfully');
  });

  deletePost = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const authReq = req as AuthenticatedRequest;
    const authorId = authReq.user!.id;

    await this.postService.deletePost(id, authorId);
    sendSuccess(res, null, 'Post deleted successfully');
  });

  getAllPosts = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { page = '1', limit = '10' } = req.query;
    
    const pageNum = parseInt(page as string);
    const limitNum = Math.min(parseInt(limit as string), 50);

    const result = await this.postService.getAllPosts({
      page: pageNum,
      limit: limitNum
    });

    sendSuccess(res, result);
  });
}