import KategoriProduk from '@/types/Kategori';
import UserMarketing from './UserMarketing';
import Diskon from './Diskon';

interface Produk {
  id: string;
  nama: string;
  slug: string;
  harga: number;
  harga_diff: string;
  harga_display: number;
  berat: number;
  unit: string;
  jumlah_terjual: number;
  jumlah_stok: number;
  jumlah_lihat: number;
  jumlah_ulasan: number;
  jumlah_bintang: number;
  nilai: number;
  deskripsi: string;
  informasi_tambahan: any;
  created_at: string;
  updated_at: string;
  banner: string;
  banners: {
    small: string;
    medium: string;
  };
  kategori: KategoriProduk;
  marketing: UserMarketing;
  kategori_cascader: any[];
  stok?: Array<{
    id: number;
    jumlah: number;
    available_at: string;
    updated_at?: string;
  }>;
  is_active: boolean;
  diskon?: Diskon[];
  diskon_aktif?: Diskon;
}

export default Produk;
