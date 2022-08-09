import User from '@/types/User';

type UlasanProduk = {
  id: number;
  produk_id: string;
  user_id: string;
  nilai: number;
  komentar: string;
  created_at: string;
  created_at_diff: string;
  user: User;
  sub_komentar: UlasanProduk[];
  reply_to: number;
  rated_at: string;
};

export default UlasanProduk;
