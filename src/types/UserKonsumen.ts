import UserMarketing from './UserMarketing';

interface UserKonsumen {
  user_id: string;
  no_hp: string;
  tgl_lahir: string;
  nama_atasan_perusahaan: string;
  alamat: string;
  isi_keranjang_count: number;
  isi_favorit_count: number;
  first_name: string;
  last_name: string;
  nama: string;
  username: string;
  email: string;
  avatar: string;
  kategori_konsumen: {
    id: string;
    nama: string;
    parent_id: number;
    created_at: string;
    updated_at: string;
  };
  alamat_pengiriman: any[];
  created_at: string;
  updated_at: string;
  marketing?: UserMarketing;
  kategori_konsumen_cascader: any[];
}

export default UserKonsumen;
