interface ChatMessage {
  created_at: any;
  message: string;
  type: 'EVENT' | 'SYSTEM' | 'MESSAGE';
  user_id: string;
}

export default ChatMessage;
