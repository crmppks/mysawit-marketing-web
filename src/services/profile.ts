import axios from './axios';

export const getProfileDetail = () => {
  return axios.get('/profile/marketing');
};

export const postUpdatePassword = (params: any) => {
  return axios.post('/profile/update-password', params);
};

export const postUpdateProfile = (params: any) => {
  return axios.post('/profile/marketing/update', params);
};

export const postToggleStatus = (is_aktif: boolean) => {
  return axios.post(`/marketing/profile/status`, {
    is_aktif,
  });
};

export const getPermissions = () => {
  return axios.get('/profile/permissions');
};
