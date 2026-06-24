export interface CommentUser {
  _id: string;
  username: string;
  profileImage?: string;
}

export interface CommentType {
  _id: string;
  comment: string;
  createdAt: string;
  commentedBy: CommentUser;
  parentComment?: string | null;

  taggedUser?: {
    _id: string;
    username: string;
  } | null;

  replies?: CommentType[];
}
