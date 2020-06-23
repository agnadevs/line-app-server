export type User = {
  userName: string;
  firstName?: string;
  lastName?: string;
  userId: string;
  profileImageURL?: string;
  createdAt?: string;
  socketId?: string;
  isRoomAdmin?: boolean;
};

export type ChatMessage = {
  text: string;
  userName: string;
  userId: string;
};

export type RawMessage = {
  user_name: string;
  user_id: string;
  text: string;
  created_date: string;
};

export type RawUser = {
  id: number;
  google_id: string;
  user_name: string;
  first_name: string;
  last_name: string;
  profile_image_url: string;
  created_date: string;
  is_admin?: boolean;
};

export type RawRoom = {
  id: number;
  room_name: string;
  info_text?: string;
  is_private: boolean;
};

export type Room = {
  roomId: number;
  title: string;
  infoText?: string;
  isPrivate: boolean;
};
