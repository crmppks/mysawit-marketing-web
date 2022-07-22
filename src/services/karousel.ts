import axios from './axios';

export const getSemuaKarousel = () => {
  return axios.get(`/admin/karousel`);
};

export const postUrutkanKarousel = (params: {
  prev_id: number | undefined;
  new_id: number | undefined;
}) => {
  return axios.post(`/admin/karousel/urutkan`, params);
};

export const deleteHapusKarousel = (id: number) => {
  return axios.delete(`/admin/karousel/${id}`);
};

export const postTambahKarousel = (params: any) => {
  return axios.post(`/admin/karousel`, params);
};

export const putUpdateKarousel = (id: number, params: any) => {
  return axios.post(`/admin/karousel/${id}`, params);
};
