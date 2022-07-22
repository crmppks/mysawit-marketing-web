import axios from './axios';

export const getSemuaNotifikasi = () => {
  return axios.get(`/notifikasi`);
};

export const getJumlahBadgeNotifikasi = () => {
  return axios.get('/notifikasi/badge');
};

export const putReadNotifikasi = (id: string) => {
  return axios.put(`/notifikasi/${id}`);
};
