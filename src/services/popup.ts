import axios from './axios';

export const getSemuaPopup = () => {
  return axios.get(`/admin/popup`);
};

export const postAktifkanPopup = (id: number, data: any) => {
  return axios.post(`/admin/popup/${id}/aktifkan`, data);
};

export const postNonAktifkanPopup = (id: number) => {
  return axios.post(`/admin/popup/${id}/non-aktifkan`);
};

export const deleteHapusPopup = (id: number) => {
  return axios.delete(`/admin/popup/${id}`);
};

export const postTambahPopup = (data: any) => {
  return axios.post(`/admin/popup`, data);
};

export const putUpdatePopup = (id: number, data: any) => {
  return axios.post(`/admin/popup/${id}`, data);
};
