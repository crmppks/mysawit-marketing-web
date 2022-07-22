import axios from './axios';

export const getAlamatProvinsi = () => {
  return axios.get(`/enums/provinsi`);
};

export const getAlamatKotaKabupaten = (provinsi_id: number | null = null) => {
  if (provinsi_id) return axios.get(`/enums/kota-kabupaten?provinsi_id=${provinsi_id}`);
  return axios.get(`/enums/kota-kabupaten`);
};
