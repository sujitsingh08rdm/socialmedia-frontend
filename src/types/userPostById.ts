export interface PostOwner {
  _id: string;
  username: string;
  profileImage?: string;
}

export interface PostComment {
  _id: string;
  post: string;
  comment: string;
  commentedBy: string;
  parentComment: string | null;
  taggedUser: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PostLikeUser {
  _id: string;
  username: string;
  profileImage?: string;
}

export interface UserPostByIdType {
  _id: string;
  content: string;
  image?: string;
  video?: string;
  videoThumbnail?: string;

  owner: PostOwner;

  likes: PostLikeUser[];
  comments: PostComment[];

  createdAt: string;
  updatedAt: string;
}
