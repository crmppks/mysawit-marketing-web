import axios from './axios';

export const getSemuaMarketing = (next_page_url: string | null = null) => {
  if (next_page_url) return axios.get(next_page_url);
  return axios.get('/marketing/kolega');
};

export const getDetailMarketing = (marketing_id: string) => {
  return axios.get(`/marketing/kolega/${marketing_id}`);
};
