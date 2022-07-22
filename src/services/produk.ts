import axios from './axios';

export const getUlasanProduk = (product_id: string, page: number = 1) => {
  return axios.get(`/produk/${product_id}/ulasan?page=${page}`);
};

export const getRatingProduk = (product_id: string) => {
  return axios.get(`/produk/${product_id}/rating`);
};

export const getDetailProduk = (produk_id: string) => {
  return axios.get(`/admin/produk/${produk_id}`);
};

export const getDetailProdukWithStok = (produk_id: string) => {
  return axios.get(`/admin/produk/${produk_id}/stok`);
};

export const getSemuaProduk = (
  next_page_url: string | null = null,
  kategori_id: string | null = null,
) => {
  if (next_page_url) return axios.get(next_page_url);
  if (kategori_id) return axios.get(`/admin/produk?kategori_id=${kategori_id}`);
  return axios.get(`/admin/produk`);
};

export const getSemuaFilteredProduk = (params: any, page: number = 1) => {
  if (params) return axios.get(`/admin/produk?${params}`);
  return axios.get(`/admin/produk?page=${page}`);
};

export const postTambahProduk = (params: any) => {
  return axios.post('/admin/produk', params, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const putUpdateProduk = (produk_id: string, params: any) => {
  return axios.post(`/admin/produk/${produk_id}`, params, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const putUpdateActivateProduk = (produk_id: string) => {
  return axios.put(`/admin/produk/${produk_id}/aktivasi`);
};

export const putUpdateDeactivateProduk = (produk_id: string) => {
  return axios.put(`/admin/produk/${produk_id}/deaktivasi`);
};

export const putUpdateStokProduk = (produk_id: string, params: any) => {
  return axios.put(`/admin/produk/${produk_id}/stok`, params);
};

export const deleteProduk = (produk_id: string) => {
  return axios.delete(`/admin/produk/${produk_id}`);
};

export const postSimpanTanggapanProduk = (produk_id: string, values: any) => {
  return axios.post(`/admin/produk/${produk_id}/tanggapan`, values);
};

export const deleteHapusTanggapanProduk = (produk_id: string, tanggapan_id: number) => {
  return axios.delete(`/admin/produk/${produk_id}/tanggapan/${tanggapan_id}`);
};

export const getSemuaKategoriProduk = () => {
  return axios.get(`/admin/kategori/produk`);
};

export const getKategoriProdukDetail = (kategori_id: string) => {
  return axios.get(`/admin/kategori/produk/${kategori_id}`);
};

export const getSemuaKategoriProdukCascader = () => {
  return axios.get('/enums/cascader/kategori-produk');
};

export const getSemuaKategoriProdukOptions = () => {
  return axios.get(`/enums/kategori-produk`);
};

export const postTambahKategoriProduk = (values: any) => {
  return axios.post('/admin/kategori/produk', values);
};

export const putUpdateKategoriProduk = (kategori_id: string, values: any) => {
  return axios.put(`/admin/kategori/produk/${kategori_id}`, values);
};

export const deleteHapusKategoriProduk = (kategori_id: string) => {
  return axios.delete(`/admin/kategori/produk/${kategori_id}`);
};

export const postCariProduk = (query: string = '') => {
  return axios.post(`/produk?q=${query}`);
};
