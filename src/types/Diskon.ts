interface Diskon {
  id: number;
  is_aktif: boolean;
  tipe_diskon: 'PERSENTASE' | 'NOMINAL';
  nilai: number;
  dimulai_pada: string;
  berakhir_pada: string;
  kode_voucher: string;
}

export default Diskon;
