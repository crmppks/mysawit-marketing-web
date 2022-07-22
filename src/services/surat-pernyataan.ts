import axios from './axios';

export const postUploadSuratPernyataan = (params: any) => {
  return axios.post('/admin/surat-pernyataan', params);
};
