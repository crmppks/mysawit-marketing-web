import axios from './axios';

export const getStrukturMarketing = () => {
  return axios.get(`/admin/struktur/marketing`);
};

export const getStrukturProduk = () => {
  return axios.get(`/admin/struktur/produk`);
};

export const getStrukturKonsumen = () => {
  return axios.get(`/admin/struktur/konsumen`);
};
