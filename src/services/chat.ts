import axios from './axios';

export const getSearchPerson = (query: string) => {
  return axios.get(`/chat/person?query=${query}`);
};
