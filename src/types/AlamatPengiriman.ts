type AlamatPengiriman = {
  id: number;
  label: string;
  no_hp: string;
  no_hp_lengkap: string;
  kode_pos: string;
  provinsi_id: number;
  kota_kabupaten_id: number;
  kecamatan: number;
  nama_jalan_dll: string;
  alamat_lengkap: string;
  is_utama: boolean;
  selected?: boolean;
};

export default AlamatPengiriman;
