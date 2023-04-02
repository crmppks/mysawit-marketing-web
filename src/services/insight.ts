import axios from './axios';

export const getOrderInsight = () => {
  return axios.get('/marketing/insight/pesanan');
};
