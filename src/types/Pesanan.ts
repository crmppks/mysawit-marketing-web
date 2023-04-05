import Product from '@/types/Produk';
import AlamatPengiriman from '@/types/AlamatPengiriman';
import Tagihan from '@/types/Tagihan';
import UserKonsumen from './UserKonsumen';

export interface PesananProduk extends Product {
  order_quantity: number;
  order_item_weight: number;
  order_item_price: number;
}

interface Pesanan {
  id: string;
  status:
    | 'VERIFIKASI_PERSYARATAN'
    | 'MENUNGGU_PEMBAYARAN'
    | 'DIKEMAS'
    | 'DIKIRIM'
    | 'SELESAI'
    | 'DIBATALKAN';
  status_diff: string;
  konsumen_id: string;
  konsumen?: UserKonsumen;
  metode_pembayaran?: string;
  catatan: string;
  nomor_resi?: string;
  is_tagihan_completed: boolean;
  is_tagihan_canceled: boolean;
  is_pengiriman_editable: boolean;
  created_at: string;
  updated_at: string;
  total_produk: number;
  items: Array<PesananProduk>;
  tagihan?: Tagihan;
  riwayat?: Array<{
    status:
      | 'VERIFIKASI_PERSYARATAN'
      | 'MENUNGGU_PEMBAYARAN'
      | 'DIKEMAS'
      | 'DIKIRIM'
      | 'SELESAI'
      | 'DIBATALKAN';
    informasi_tambahan: any;
    created_at: string;
  }>;
  informasi_harga: {
    harga_total_bayar: number;
    harga_total_produk: number;
    harga_kode_unik?: number;
    harga_nego?: number;
  };
  informasi_pengiriman?: {
    to: string;
    postal_code: string;
    address?: AlamatPengiriman;
    phone_number: string;
    note: string;
    weight: number;
    courier?: {
      code: string;
      name: string;
    };
    courier_service?: {
      service: string;
      description: string;
      cost: {
        value: number;
        etd: string;
        note: string;
      };
    };
    duration?: {
      estimation: string;
      estimation_unit: 'BULAN' | 'HARI';
      date_from: string;
      date_to: string;
    };
  };
  persyaratan?: {
    status?: 'LULUS' | 'TIDAK-LULUS';
    id: number;
    alamat_id?: number;
    provinsi_id: number;
    kota_kabupaten_id: number;
    kecamatan: string;
    detail_alamat: string;
    created_at: string;
    updated_at: string;
    alamat_lengkap: string;
    informasi_penolakan?: string;
    provinsi: {
      id: number;
      nama: string;
    };
    kota_kabupaten: {
      id: number;
      provinsi_id: number;
      nama: string;
      tipe: string;
      kode_pos: string;
    };
    dokumen_surat_lahan: Array<{
      media_id: number;
      url: string;
      name: string;
      size: number;
    }>;
    dokumen_surat_pernyataan: Array<{
      media_id: number;
      url: string;
      name: string;
      size: number;
    }>;
    dokumen_ktp: Array<{
      media_id: number;
      url: string;
      name: string;
      size: number;
    }>;
  };
}

export default Pesanan;
