import Cookies from 'js-cookie';
import axios from './axios';

export const getChartPenjualanProduk = (tipe: string, value: string) => {
  return axios.get(
    `/marketing/pesanan/chart/penjualan-by-produk?tipe=${tipe}&value=${value}`,
  );
};

export const getChartPenjualanKategori = (tipe: string, value: string) => {
  return axios.get(
    `/marketing/pesanan/chart/penjualan-by-kategori?tipe=${tipe}&value=${value}`,
  );
};

export const getReportPenjualanProduk = (
  params: any,
  page: number = 1,
  tipe: string,
  value: string = null,
) => {
  if (params)
    return axios.get(
      `/marketing/pesanan/laporan/data?${params}&page=${page}&tipe=${tipe}&value=${value}`,
    );
  return axios.get(
    `/marketing/pesanan/laporan/data?page=${page}&tipe=${tipe}&value=${value}`,
  );
};

export const getExportReportPenjualanProduk = (tipe: string, value: string) => {
  return `${
    process.env.REACT_APP_BASE_URL_API
  }/marketing/pesanan/laporan/export?tipe=${tipe}&value=${value}&token=${Cookies.get(
    process.env.REACT_APP_ACCESS_TOKEN!,
  )}`;
};
