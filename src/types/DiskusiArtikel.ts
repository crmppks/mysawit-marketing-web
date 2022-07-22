import User from './User';

interface DiskusiArtikel {
  id: number;
  artikel_id: string;
  user_id: string;
  komentar: string;
  created_at: string;
  updated_at: string;
  sub_komentar: DiskusiArtikel[];
  user: User;
}

export default DiskusiArtikel;
