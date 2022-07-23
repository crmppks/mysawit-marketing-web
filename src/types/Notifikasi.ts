interface Notifikasi {
  id: string;
  type: string;
  notifiable_type: 'App\\UserMarketing' | 'App\\UserKonsumen' | 'App\\User';
  notifiable_id: string | number;
  data: {
    reference_type: 'App\\Pesanan';
    reference_id: string | number;
    title: string;
    body: string;
  };
  read_at?: string;
  created_at: string;
  updated_at: string;
}

export default Notifikasi;
