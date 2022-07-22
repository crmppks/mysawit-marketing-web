import KategoriProduk from './Kategori';

interface UserMarketing {
  id: number;
  is_aktif: boolean;
  user_id: string;
  kategori_produk_id: string;
  kode_marketing: string;
  nik: string;
  no_hp: string;
  jumlah_target: number;
  jabatan: string;
  alamat: string;
  nama: string;
  username: string;
  email: string;
  avatar: string;
  kategori_produk: KategoriProduk;
  atasan: UserMarketing;
  anggota_count: number;
  konsumen_count: number;
  created_at: string;
  updated_at: string;
  kategori_produk_cascader: any[];
}

export default UserMarketing;
