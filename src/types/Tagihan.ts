interface Tagihan {
  id: string;
  status: 'DIBUAT' | 'DIBAYAR' | 'DIBATALKAN' | 'DIKONFIRMASI';
  user_id: string;
  nilai: number;
  nilai_diff: string;
  deskripsi: string;
  model_tagihan: any;
  metode_pembayaran: string;
  metode_pembayaran_code: 'qris' | 'gopay' | 'bank_transfer' | 'echannel' | 'manual';
  payload_pg: {
    payment_type: 'qris' | 'gopay' | 'bank_transfer' | 'echannel' | 'manual';
    bank_transfer?: {
      bank: 'bca' | 'bri' | 'bni';
      va_number: number;
    };
    manual: {
      bank: string;
      id: number;
      no_rekening: string;
      atas_nama: string;
      logo: string;
    };
    echannel?: {
      bill_info1: string;
      bill_info2: string;
    };
    item_details: Array<{
      id: string;
      slug?: string;
      price: number;
      quantity: string;
      name: string;
    }>;
  };
  response_pg: {
    status_code: number;
    status_message: string;
    transaction_id: string;
    order_id: string;
    merchant_id: string;
    gross_amount: string;
    currency: string;
    payment_type: 'qris' | 'gopay' | 'bank_transfer' | 'echannel';
    transaction_time: string;
    transaction_status: string;
    va_numbers?: Array<{
      bank: string;
      va_number: number;
    }>;
    bill_key?: number;
    biller_code?: number;
    actions?: Array<{
      name: 'generate-qr-code' | 'deeplink-redirect' | 'get-status' | 'cancel';
      method: string;
      url: string;
    }>;
    qr_string?: string;
    acquirer?: string;
    fraud_status?: string;
  };
  created_at: string;
  update_at: string;
  expired_at: string;
  is_finished: boolean;
  is_canceled: boolean;
  is_waiting: boolean;
  user: {
    id: string;
    nama: string;
    email: string;
    no_hp: string;
  };
  riwayat: Array<{
    id: number;
    tagihan_id: string;
    status: string;
    response_pg: any;
    created_at: string;
  }>;
  reference_type: string;
  reference_id: string;
}

export default Tagihan;
