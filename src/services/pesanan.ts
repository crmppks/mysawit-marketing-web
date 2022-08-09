import axios from './axios';

export const getMarketingKecambah = (
  params: any = null,
  next_page_url: string = null,
) => {
  if (next_page_url) return axios.get(`${next_page_url}&${params}`);
  return axios.get(`/enums/marketing?${params}`);
};

export const getAllPesanan = () => {
  return axios.get(`/marketing/pesanan`);
};

export const getDetailPesanan = (pesanan_id: string) => {
  return axios.get(`/marketing/pesanan/${pesanan_id}`);
};

export const getPesananByKategori = (
  kategori: string,
  page: number = 1,
  filter: any = null,
) => {
  if (filter)
    return axios.get(`/marketing/pesanan/kategori/${kategori}?page=${page}&${filter}`);
  return axios.get(`/marketing/pesanan/kategori/${kategori}?page=${page}`);
};

export const getOrderInsight = () => {
  return axios.get('/marketing/pesanan/insight');
};

export const postConfirmPesananVerification = (pesanan_id: string, params: any) => {
  return axios.post(`/marketing/pesanan/${pesanan_id}/konfirmasi-verifikasi`, params);
};

export const postConfirmPesananShipment = (pesanan_id: string, params: any) => {
  return axios.post(`/marketing/pesanan/${pesanan_id}/konfirmasi-pengiriman`, params);
};
