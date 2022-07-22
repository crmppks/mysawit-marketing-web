import axios from './axios';

export const getProfile = () => {
  return axios.get('/profile');
};

export const postUpdatePassword = (params: any) => {
  return axios.post('/profile/update-password', params);
};

export const postUpdateProfile = (params: any) => {
  return axios.post('/admin/profile/update', params);
};

export const getPermissions = () => {
  return axios.get('/profile/permissions');
};
