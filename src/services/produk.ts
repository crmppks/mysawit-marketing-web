import axios from './axios';

export const getUlasanProduk = (product_id: string, page: number = 1) => {
  return axios.get(`/produk/${product_id}/ulasan?page=${page}`);
};

export const getRatingProduk = (product_id: string) => {
  return axios.get(`/produk/${product_id}/rating`);
};

export const getDetailProduk = (produk_id: string) => {
  return axios.get(`/marketing/produk/${produk_id}`);
};

export const getDetailProdukWithStok = (produk_id: string) => {
  return axios.get(`/marketing/produk/${produk_id}/stok`);
};

export const getSemuaProduk = (
  next_page_url: string | null = null,
  kategori_id: string | null = null,
) => {
  if (next_page_url) return axios.get(next_page_url);
  if (kategori_id) return axios.get(`/marketing/produk?kategori_id=${kategori_id}`);
  return axios.get(`/marketing/produk`);
};

export const getSemuaFilteredProduk = (params: any, page: number = 1) => {
  if (params) return axios.get(`/marketing/produk?${params}`);
  return axios.get(`/marketing/produk?page=${page}`);
};

export const postSimpanTanggapanProduk = (produk_id: string, values: any) => {
  return axios.post(`/marketing/produk/${produk_id}/tanggapan`, values);
};

export const deleteHapusTanggapanProduk = (produk_id: string, tanggapan_id: number) => {
  return axios.delete(`/marketing/produk/${produk_id}/tanggapan/${tanggapan_id}`);
};

export const getSemuaKategoriProduk = () => {
  return axios.get(`/marketing/kategori/produk`);
};

export const getKategoriProdukDetail = (kategori_id: string) => {
  return axios.get(`/marketing/kategori/produk/${kategori_id}`);
};

export const getSemuaKategoriProdukCascader = () => {
  return axios.get('/enums/cascader/kategori-produk');
};

export const getSemuaKategoriProdukOptions = () => {
  return axios.get(`/enums/kategori-produk`);
};

export const postCariProduk = (query: string = '') => {
  return axios.post(`/produk?q=${query}`);
};
