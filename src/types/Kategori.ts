interface Kategori {
  id: string;
  nama: string;
  slug: string;
  created_at: string;
  updated_at: string;
  inisial: string;
  produk_count: number;
  parent_cascader: any[];
  sub_kategori_simple: Kategori[];
  parent_kategori?: Kategori;
}

export default Kategori;
