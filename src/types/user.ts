export interface CreateUserDto {
  email: string;
  username: string;
  password: string;
  firstName?: string;
  lastName?: string;
  bio?: string;
}

export interface UpdateUserDto {
  firstName?: string;
  lastName?: string;
  bio?: string;
  avatar?: string;
}

export interface UserResponse {
  id: string;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  bio?: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserWithStats extends UserResponse {
  followingCount: number;
  followersCount: number;
  postsCount: number;
}