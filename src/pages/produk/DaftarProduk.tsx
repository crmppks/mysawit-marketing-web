import { webixTableParams } from '@/helpers/webix_helper';
import {
  getSemuaFilteredProduk,
  getSemuaKategoriProduk,
  getSemuaProduk,
} from '@/services/produk';
import Kategori from '@/types/Kategori';
import Paging from '@/types/Paging';
import Produk from '@/types/Produk';
import { EditOutlined, LoadingOutlined } from '@ant-design/icons';
import {
  Button,
  Dropdown,
  Empty,
  Form,
  Image,
  Input,
  Menu,
  PageHeader,
  Select,
  Skeleton,
} from 'antd';
import { AxiosResponse } from 'axios';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function HalamanDaftarProduk() {
  const [formFilter] = Form.useForm();
  const [kategoris, setKategoris] = useState<{
    data: Kategori[];
    loading: boolean;
  }>({ data: [], loading: true });
  const [loadingHalaman, setLoadingHalaman] = useState<boolean>(false);
  const [filtering, setFiltering] = useState<boolean>(false);
  const [produks, setProduks] = useState<Paging<Produk>>({
    data: [],
    loading: true,
  });

  const handleMuatLebihBanyak = () => {
    setLoadingHalaman(true);
    getSemuaProduk(produks.next_page_url)
      .then(({ data }: AxiosResponse<any>) => {
        setProduks((old) => ({
          ...data,
          data: [...old.data, ...data.data],
        }));
      })
      .finally(() => setLoadingHalaman(false));
  };

  const handleFilterProduk = (values: any) => {
    setFiltering(true);
    getSemuaFilteredProduk(
      webixTableParams({
        filter: {
          ...(values.nama && { nama: values.nama }),
          ...(values.is_active && { is_active: values.is_active }),
        },
      }),
    )
      .then(({ data }) => {
        setProduks({ ...data, loading: false });
      })
      .finally(() => setFiltering(false));
  };

  useEffect(() => {
    getSemuaKategoriProduk().then(({ data }) => setKategoris({ data, loading: false }));
    getSemuaProduk()
      .then(({ data }: AxiosResponse<any>) => {
        setProduks({ ...data, loading: false });
      })
      .finally(() => setProduks((old) => ({ ...old, loading: false })));
  }, []);

  return (
    <>
      <div className="md:pr-5 flex flex-col md:space-x-5 md:flex-row md:items-center md:justify-between">
        <PageHeader title="Daftar Produk" subTitle="Daftar semua produk yang tersedia" />
      </div>

      <section className="p-5">
        {kategoris.loading && <Skeleton.Input active block className="mb-5" />}
        {!kategoris.loading && (
          <div className="flex items-start space-x-3 overflow-x-auto">
            {kategoris.data?.map((kategori) => (
              <Link
                key={kategori.id}
                to={`/kategori/produk/${kategori.id}`}
                className="my-kategori-produk text-lg h-20 px-5 py-3 rounded-md border-2 border-white relative flex-none max-w-xs"
              >
                {kategori.nama}
              </Link>
            ))}
          </div>
        )}
        {produks.loading && (
          <>
            <Skeleton.Input block active className="mb-1" />
            <Skeleton.Input block active className="mb-1" />
            <Skeleton.Input block active className="mb-1" />
          </>
        )}
        {!produks.loading && (
          <>
            <div className="mb-3 mt-5">
              <Form
                form={formFilter}
                onFinish={handleFilterProduk}
                layout="horizontal"
                className="flex flex-col md:flex-row w-full space-x-2"
              >
                <div className="flex-grow">
                  <Form.Item name={'nama'}>
                    <Input.Search
                      size="large"
                      placeholder="Cari produk"
                      className="w-full"
                      onSearch={() => formFilter.submit()}
                    />
                  </Form.Item>
                </div>

                <div className="w-full md:w-2/12 flex-none">
                  <Form.Item name={'is_active'}>
                    <Select
                      size="large"
                      defaultValue={null}
                      onChange={() => formFilter.submit()}
                    >
                      <Select.Option value={null}>Semua</Select.Option>
                      <Select.Option value="1">Aktif</Select.Option>
                      <Select.Option value="0">Non Aktif</Select.Option>
                    </Select>
                  </Form.Item>
                </div>
              </Form>
            </div>

            <div className="relative">
              {filtering && (
                <div className="absolute inset-0 flex items-center justify-center z-50 bg-white bg-opacity-60">
                  <LoadingOutlined className="text-3xl" />
                </div>
              )}
              {produks.data.length === 0 && (
                <Empty
                  className="py-5 rounded bg-white mb-0"
                  description={<p className="text-gray-500">Belum ada produk tersedia</p>}
                />
              )}
              {produks.data.length > 0 && (
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-5">
                  {produks.data.map((produk) => (
                    <div
                      className={`border rounded bg-white overflow-hidden shadow ${
                        !produk.is_active && 'border-red-500'
                      }`}
                      key={produk.id}
                    >
                      <Image
                        src={produk.banner}
                        alt={produk.nama}
                        className="mwx-w-full"
                      />
                      <div className="px-5 py-3">
                        <h3 className="leading-tight text-lg mb-0">
                          <Link to={`/produk/${produk.id}`} className="font-bold">
                            {produk.nama}
                          </Link>
                        </h3>
                        <Link
                          to={`/kategori/produk/${produk.kategori.id}`}
                          className="text-yellow-500"
                        >
                          <span className="leading-tight">{produk.kategori.nama}</span>
                        </Link>

                        <div className="mt-3 mb-0 font-bold flex justify-between">
                          <span className="text-lg">
                            {produk.harga_diff} / {produk.unit}
                          </span>
                          <Dropdown
                            overlay={
                              <Menu>
                                <Menu.Item icon={<EditOutlined />}>
                                  <Link to={`${produk.id}/edit`}>Perbaharui</Link>
                                </Menu.Item>
                                <Menu.Item icon={<EditOutlined />}>
                                  <Link to={`${produk.id}/stok`}>Perbaharui Stok</Link>
                                </Menu.Item>
                              </Menu>
                            }
                            placement="topRight"
                            arrow
                          >
                            <button>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                              </svg>
                            </button>
                          </Dropdown>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {produks.next_page_url && (
                <div className="flex items-center justify-center mt-10">
                  <Button
                    onClick={handleMuatLebihBanyak}
                    loading={loadingHalaman}
                    type="default"
                    shape="round"
                  >
                    Muat lebih banyak
                  </Button>
                </div>
              )}
            </div>
          </>
        )}
      </section>
    </>
  );
}
