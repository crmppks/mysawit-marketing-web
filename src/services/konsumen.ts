import axios from './axios';

export const getSemuaKategoriKonsumenCascader = () => {
  return axios.get('/enums/cascader/kategori-konsumen');
};

export const getDetailKategoriKonsumen = (kategori_id: string) => {
  return axios.get(`/admin/kategori/konsumen/${kategori_id}`);
};

export const getSemuaKategoriKonsumen = () => {
  return axios.get(`/marketing/kategori/konsumen`);
};

export const getSemuaKategoriKonsumenOptions = () => {
  return axios.get('/enums/kategori-konsumen');
};

export const getSemuaKonsumen = (params: any, page: number = 1) => {
  if (params) return axios.get(`/marketing/konsumen?${params}`);
  return axios.get(`/marketing/konsumen?page=${page}`);
};

export const getDetailKonsumen = (konsumen_id: string) => {
  return axios.get(`/marketing/konsumen/${konsumen_id}`);
};
