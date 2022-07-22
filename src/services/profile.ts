import axios from './axios';

export const getProfileDetail = () => {
  return axios.get('/profile/marketing');
};

export const postUpdatePassword = (params: any) => {
  return axios.post('/profile/update-password', params);
};

export const postUpdateProfile = (params: any) => {
  return axios.post('/profile/update/marketing', params);
};

export const getPermissions = () => {
  return axios.get('/profile/permissions');
};
