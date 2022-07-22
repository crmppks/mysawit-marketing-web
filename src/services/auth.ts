import axios from './axios';

export const postAuthMasuk = (data: { id: string; password: string }) => {
  return axios.post('/auth/sign-in', { ...data, role: 'MARKETING' });
};

export const postAuthLupaPassword = (params: any) => {
  return axios.post('/auth/forgot-password', params);
};

export const postAuthResetPassword = (params: any) => {
  return axios.post('/auth/reset-password', params);
};
