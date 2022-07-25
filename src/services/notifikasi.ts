import axios from './axios';

export const postStoreFCMToken = (token: string) => {
  return axios.post(`/fcm`, {
    user_tipe: 'App\\UserMarketing',
    token,
  });
};

export const getSemuaNotifikasi = (next_page_url: string = null) => {
  if (next_page_url) return axios.get(next_page_url);
  return axios.get(`/notifikasi`);
};

export const getJumlahBadgeNotifikasi = () => {
  return axios.get('/notifikasi/badge');
};

export const postReadsNotifikasi = (notification_ids: string[]) => {
  return axios.post(`/notifikasi/reads`, {
    notification_ids,
  });
};
