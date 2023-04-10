import axios from './axios';

export const getSearchPerson = (query: string) => {
  return axios.get(`/chat/person?query=${query}`);
};

export const getPersonInitial = (user_id: string) => {
  return axios.get(`/chat/person/${user_id}`);
};

export const postUploadFile = (param: any) => {
  return axios.post(`/chat/upload`, param);
};
