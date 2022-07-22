import axios from './axios';

export const getSemuaFAQ = () => {
  return axios.get('/admin/faq');
};

export const putUpdateFAQ = (faq_id: number, values: any) => {
  return axios.put(`/admin/faq/${faq_id}`, values);
};

export const postTambahFAQ = (values: any) => {
  return axios.post('/admin/faq', values);
};

export const deleteFAQ = (faq_id: number) => {
  return axios.delete(`/admin/faq/${faq_id}`);
};
