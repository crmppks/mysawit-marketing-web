import axios from './axios';

export const postTambahKonsumen = (values: any) => {
  return axios.post(`/admin/konsumen`, values);
};

export const getSemuaKategoriKonsumenCascader = () => {
  return axios.get('/enums/cascader/kategori-konsumen');
};

export const getDetailKategoriKonsumen = (kategori_id: string) => {
  return axios.get(`/admin/kategori/konsumen/${kategori_id}`);
};

export const getSemuaKategoriKonsumen = () => {
  return axios.get(`/admin/kategori/konsumen`);
};

export const getSemuaKategoriKonsumenOptions = () => {
  return axios.get('/enums/kategori-konsumen');
};

export const getSemuaKonsumen = (params: any, page: number = 1) => {
  if (params) return axios.get(`/admin/konsumen?${params}`);
  return axios.get(`/admin/konsumen?page=${page}`);
};

export const getDetailKonsumen = (konsumen_id: string) => {
  return axios.get(`/admin/konsumen/${konsumen_id}`);
};

export const putResetPasswordKonsumen = (konsumen_id: string) => {
  return axios.put(`/admin/konsumen/${konsumen_id}/reset-password`);
};

export const deleteHapusKonsumen = (konsumen_id: string) => {
  return axios.delete(`/admin/konsumen/${konsumen_id}`);
};

export const postTambahKategoriKonsumen = (values: any) => {
  return axios.post('/admin/kategori/konsumen', values);
};

export const putUpdateKategoriKonsumen = (kategori_id: string, values: any) => {
  return axios.put(`/admin/kategori/konsumen/${kategori_id}`, values);
};

export const deleteHapusKategoriKonsumen = (kategori_id: string) => {
  return axios.delete(`/admin/kategori/konsumen/${kategori_id}`);
};
