import axios from './axios';

export const postStoreFCMToken = (token: string) => {
  return axios.post(`/fcm`, {
    user_tipe: 'App\\UserMarketing',
    token,
  });
};

export const getSemuaNotifikasi = () => {
  return axios.get(`/notifikasi`);
};

export const getJumlahBadgeNotifikasi = () => {
  return axios.get('/notifikasi/badge');
};

export const putReadNotifikasi = (id: string) => {
  return axios.put(`/notifikasi/${id}`);
};
