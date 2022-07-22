import axios from './axios';

export const getSemuaArtikel = (
  status: 'AKTIF' | 'NON_AKTIF',
  next_page_url: string | null = null,
) => {
  if (next_page_url) return axios.get(next_page_url);
  return axios.get(`/admin/artikel/status/${status}`);
};

export const postTambahArtikel = (values: any) => {
  return axios.post('/admin/artikel', values);
};

export const putUpdateArtikel = (id: string, values: any) => {
  return axios.post(`/admin/artikel/${id}`, values);
};

export const getDetailArtikel = (id: string) => {
  return axios.get(`/admin/artikel/${id}`);
};

export const getDiskusiArtikel = (id: string, next_page_url: string | null = null) => {
  if (next_page_url) return axios.get(next_page_url);
  return axios.get(`/admin/artikel/${id}/diskusi`);
};

export const deleteHapusArtikel = (id: string) => {
  return axios.delete(`/admin/artikel/${id}`);
};

export const putSimpanDraftArtikel = (id: string) => {
  return axios.put(`/admin/artikel/${id}/draft`);
};

export const putSimpanPublikasiArtikel = (id: string) => {
  return axios.put(`/admin/artikel/${id}/publikasi`);
};

export const postSimpanKomentarArtikel = (id: string, params: any) => {
  return axios.post(`/admin/artikel/${id}/komentar`, params);
};

export const deleteHapusKomentarArtikel = (artikel_id: string, komentar_id: number) => {
  return axios.delete(`/admin/artikel/${artikel_id}/komentar/${komentar_id}`);
};
