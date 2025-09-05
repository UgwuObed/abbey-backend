export interface FollowResponse {
  id: string;
  followerId: string;
  followingId: string;
  createdAt: Date;
}

export interface FollowerResponse {
  id: string;
  followerId: string;
  createdAt: Date;
  follower: {
    id: string;
    username: string;
    firstName?: string;
    lastName?: string;
    avatar?: string;
  };
}

export interface FollowingResponse {
  id: string;
  followingId: string;
  createdAt: Date;
  following: {
    id: string;
    username: string;
    firstName?: string;
    lastName?: string;
    avatar?: string;
  };
}