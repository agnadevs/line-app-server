export type User = {
  userName: string;
  firstName?: string;
  lastName?: string;
  userId: string;
  profileImageURL?: string;
  createdAt?: string;
  socketId?: string;
};

export type ChatMessage = {
  text: string;
  userName: string;
  userId: string;
  timestamp: string;
  roomId: string;
};
