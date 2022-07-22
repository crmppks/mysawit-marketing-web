import { message } from 'antd';
import axios from 'axios';
import nProgress from 'nprogress';
import Cookies from 'js-cookie';
import { store } from '@/store/index';
import { clearSesiAction } from '@/store/actions/sesi';

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL_API,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    Authorization: `Bearer ${Cookies.get(process.env.REACT_APP_ACCESS_TOKEN!)}`,
    'X-MySawit-Refresh-Token': Cookies.get(process.env.REACT_APP_REFRESH_TOKEN!)!,
    'X-MySawit-Role': 'MARKETING',
  },
});

axiosInstance.interceptors.request.use((config) => {
  nProgress.start();

  return {
    ...config,
    headers: {
      ...config.headers,
      Authorization: `Bearer ${Cookies.get(process.env.REACT_APP_ACCESS_TOKEN!)}`,
      'X-MySawit-Refresh-Token': Cookies.get(process.env.REACT_APP_REFRESH_TOKEN!),
    },
  };
});

axiosInstance.interceptors.response.use(
  (response) => {
    nProgress.done();
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      Cookies.set(process.env.REACT_APP_ACCESS_TOKEN!, error.response.data.access_token, {
        expires: 1,
        sameSite: 'Strict',
      });
      axiosInstance.defaults.headers.common[
        'Authorization'
      ] = `Bearer ${error.response.data.access_token}`;
      return axiosInstance(originalRequest);
    }

    if (error?.response?.status === 401 && originalRequest._retry) {
      store.dispatch(clearSesiAction());
    }

    message.error(error?.response?.data?.message || error.message);
    nProgress.done();
    return Promise.reject(error);
  },
);

export default axiosInstance;
