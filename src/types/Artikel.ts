interface Artikel {
  id: string;
  status: 'AKTIF' | 'NON_AKTIF';
  judul: string;
  kalimat_pembuka: string;
  created_at: string;
  updated_at: string;
  banner: string;
  isi: string;
  jumlah_suka: number;
  jumlah_baca: number;
  diskusi_count: number;
}

export default Artikel;
