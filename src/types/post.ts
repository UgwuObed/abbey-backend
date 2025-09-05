export interface CreatePostDto {
  content: string;
}

export interface UpdatePostDto {
  content?: string;
}

export interface PostResponse {
  id: string;
  content: string;
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
  author: {
    id: string;
    username: string;
    firstName?: string | null;
    lastName?: string | null;
    avatar?: string | null;
  };
}


export interface FeedOptions {
  page?: number;
  limit?: number;
  cursor?: string;
}