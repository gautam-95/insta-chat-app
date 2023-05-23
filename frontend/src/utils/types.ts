export type UserContext = {
  user: User;
  setUser: (user: User) => void;
  selectedChat: Chat;
  setSelectedChat: (chat: Chat | null) => void;
  chats: Chat[];
  setChats: (chats: Chat[]) => void;
  notifications: ChatMessage[];
  setNotifications: (notificationMessage: ChatMessage[]) => void;
};

export type User = {
  _id: string;
  email: string;
  name: string;
  pic: string;
  token: string;
};

export type Chat = {
  _id: string;
  chatName: string;
  isGroupChat: boolean;
  users: User[];
  groupAdmin: User;
  latestMessage: ChatMessage;
  createdAt: string;
  updatedAt: string;
};

export type ChatMessage = {
  _id: string;
  content: string;
  sender: User;
  chat: Chat;
  createdAt: string;
  updatedAt: string;
}

