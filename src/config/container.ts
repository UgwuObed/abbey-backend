import { PrismaClient } from '@prisma/client';

import { UserRepository, UserFollowRepository, PostRepository } from '../repositories';
import { UserService, AuthService, FollowService, PostService } from '../services';
import { UserController, AuthController, FollowController, PostController } from '../controllers';

export class Container {
  private static instance: Container;
  
  public readonly prisma: PrismaClient;
  
  public readonly userRepository: UserRepository;
  public readonly userFollowRepository: UserFollowRepository;
  public readonly postRepository: PostRepository;
  
  public readonly userService: UserService;
  public readonly authService: AuthService;
  public readonly followService: FollowService;
  public readonly postService: PostService;
  
  public readonly userController: UserController;
  public readonly authController: AuthController;
  public readonly followController: FollowController;
  public readonly postController: PostController;

  private constructor() {
    this.prisma = new PrismaClient();
    
    this.userRepository = new UserRepository(this.prisma);
    this.userFollowRepository = new UserFollowRepository(this.prisma);
    this.postRepository = new PostRepository(this.prisma);
    
    this.userService = new UserService(this.userRepository);
    this.authService = new AuthService(this.userService);
    this.followService = new FollowService(this.userFollowRepository, this.userRepository);
    this.postService = new PostService(this.postRepository);
    
    this.userController = new UserController(this.userService);
    this.authController = new AuthController(this.authService);
    this.followController = new FollowController(this.followService);
    this.postController = new PostController(this.postService);
  }

  public static getInstance(): Container {
    if (!Container.instance) {
      Container.instance = new Container();
    }
    return Container.instance;
  }

  public async disconnect(): Promise<void> {
    await this.prisma.$disconnect();
  }
}

export const container = Container.getInstance();