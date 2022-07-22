import axios from './axios';

export const getDashbordCounters = () => {
  return axios.get('/admin/dashboard/counters');
};
