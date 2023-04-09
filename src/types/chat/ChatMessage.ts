import Produk from '../Produk';

interface ChatMessage {
  is_deleted: boolean;
  created_at: any;
  message: string;
  attachment?: {
    type: 'FILE' | 'ORDER' | 'PRODUCT';
    file?: {
      mime: string;
      name: string;
      url: string;
    };
    product?: Produk;
  };
  type: 'EVENT' | 'SYSTEM' | 'MESSAGE';
  user_id: string;
}

export default ChatMessage;
