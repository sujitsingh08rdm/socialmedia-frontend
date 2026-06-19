export interface userProfileInfoType {
  _id: string;
  username: string;
  email: string;
  profileImage?: string | null;
  postCount: number;
  followersCount: number;
  followingCount: number;
  bio?: string | null;
  isFollowing: boolean;
}
