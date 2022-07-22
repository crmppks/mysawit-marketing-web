interface UserAdmin {
  id: string;
  nama: string;
  email: string;
  username: string;
  tgl_lahir: string;
  jenis_kelamin: 'PRIA' | 'WANITA';
  email_verified_at: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  avatar: string;
}

export default UserAdmin;
