export interface User {
  _id: string;
  username: string;
  profileImage?: string;
}

export interface Conversation {
  _id: string;
  participants: User[];
  lastMessage?: {
    text?: [];
    image?: string;
    sender: User;
  };
  unreadCount: number;
}

export interface Message {
  _id: string;
  text?: string;
  image?: string;
  sender: {
    _id: string;
    username: string;
    profileImage?: string;
  };
  createdAt: string;
}
