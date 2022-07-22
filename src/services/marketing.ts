import axios from './axios';

export const postTambahMarketing = (params: any) => {
  return axios.post('/admin/marketing', params);
};

export const putUpdateMarketing = (marketing_id: string, params: any) => {
  return axios.put(`/admin/marketing/${marketing_id}`, params);
};

export const getSemuaMarketing = (next_page_url: string | null = null) => {
  if (next_page_url) return axios.get(next_page_url);
  return axios.get('/admin/marketing');
};

export const getDetailMarketing = (marketing_id: string) => {
  return axios.get(`/admin/marketing/${marketing_id}`);
};

export const getCekEskalasiMarketing = (
  marketing_id: string,
  next_page_url: string | null = null,
) => {
  if (next_page_url) return axios.get(next_page_url);
  return axios.get(`/admin/marketing/${marketing_id}/cek-eskalasi`);
};

export const putDeaktivasiMarketing = (marketing_id: string, params: any) => {
  return axios.put(`/admin/marketing/${marketing_id}/deaktivasi`, params);
};

export const putAktivasiMarketing = (marketing_id: string) => {
  return axios.put(`/admin/marketing/${marketing_id}/aktivasi`);
};

export const putResetPasswordMarketing = (marketing_id: string) => {
  return axios.put(`/admin/marketing/${marketing_id}/reset-password`);
};

export const deleteHapusMarketing = (marketing_id: string, params: any = {}) => {
  return axios.post(`/admin/marketing/${marketing_id}`, params);
};

export const getJabatanMarketing = () => {
  return axios.get('/enums/jabatan-marketing');
};

export const getDaftarAtasan = () => {
  return axios.get(`/admin/marketing/atasan`);
};
