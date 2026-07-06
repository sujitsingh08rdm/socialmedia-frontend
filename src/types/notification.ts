export interface Notification {
  _id: string;
  type: "LIKE_POST";
  sender: {
    _id: string;
    username: string;
    profileImage?: string;
  };
  post: {
    _id: string;
  };
  recipient: string;
  isRead: boolean;

  createdAt: string;
}
