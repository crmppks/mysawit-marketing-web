interface ChatRoom {
  id: string;
  is_new?: boolean;
  is_group?: boolean;
  is_starting?: boolean;
  title: object;
  subtitle: object;
  last_seen: object;
  last_sender?: {
    user_id: string;
    message: string;
  };
  avatar: object;
  user_ids: Array<string>;
  updated_at: any;
}

export default ChatRoom;