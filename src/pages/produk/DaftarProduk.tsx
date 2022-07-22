import ModalKategori, { ModalKategoriItem } from '@/components/ModalKategoriComponent';
import { confirmAlert } from '@/helpers/swal_helper';
import { webixTableParams } from '@/helpers/webix_helper';
import {
  deleteProduk,
  getSemuaFilteredProduk,
  getSemuaKategoriProduk,
  getSemuaKategoriProdukCascader,
  getSemuaProduk,
  postTambahKategoriProduk,
  putUpdateActivateProduk,
  putUpdateDeactivateProduk,
  putUpdateKategoriProduk,
} from '@/services/produk';
import Kategori from '@/types/Kategori';
import Paging from '@/types/Paging';
import Produk from '@/types/Produk';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  LoadingOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import {
  Button,
  Dropdown,
  Empty,
  Form,
  Image,
  Input,
  Menu,
  message,
  PageHeader,
  Select,
  Skeleton,
} from 'antd';
import { AxiosResponse } from 'axios';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function HalamanDaftarProduk() {
  const [formFilter] = Form.useForm();
  const [modalKategoriItem, setModalKategoriItem] = useState<ModalKategoriItem | null>(
    null,
  );
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

  const handleHapusProduk = (produk: Produk) => {
    confirmAlert(
      'Hapus Produk',
      <>
        Apakah anda yakin untuk menghapus produk <b>{produk?.nama}</b>?
      </>,
    ).then((willDelete: boolean) => {
      if (willDelete) {
        deleteProduk(produk.id).then(() => {
          message.success('Produk berhasil dihapus');
          setProduks((old) => ({
            ...old,
            data: old.data.filter((item) => item.id !== produk.id),
          }));
        });
      }
    });
  };

  const handleActivateProduk = (produk: Produk) => {
    putUpdateActivateProduk(produk.id).then(() => {
      message.success(`Produk ${produk?.nama} di aktifkan`);
      setProduks((old) => ({
        ...old,
        data: old.data.map((item) => {
          if (item.id === produk.id) {
            return {
              ...produk,
              is_active: true,
            };
          }
          return item;
        }),
      }));
    });
  };

  const handleDeactivateProduk = (produk: Produk) => {
    putUpdateDeactivateProduk(produk.id).then(() => {
      message.warning(`Produk ${produk?.nama} di non-aktifkan`);
      setProduks((old) => ({
        ...old,
        data: old.data.map((item) => {
          if (item.id === produk.id) {
            return {
              ...produk,
              is_active: false,
            };
          }
          return item;
        }),
      }));
    });
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
      <ModalKategori
        tipe="Produk"
        visible={!!modalKategoriItem}
        kategoriItem={modalKategoriItem}
        getCascaderAction={getSemuaKategoriProdukCascader}
        postAddAction={(params) => postTambahKategoriProduk(params)}
        putUpdateAction={(kategori_id, params) =>
          putUpdateKategoriProduk(kategori_id, params)
        }
        onFinishAdd={(kategori: Kategori) =>
          setKategoris((old) => ({ loading: false, data: [...old.data, kategori] }))
        }
        onFinishUpdate={(kategori: Kategori) =>
          setKategoris((old) => ({
            loading: false,
            data: old.data.map((item) => {
              if (item.id === modalKategoriItem?.item?.id) {
                return kategori;
              }
              return item;
            }),
          }))
        }
        onCancel={() => setModalKategoriItem(null)}
      />
      <div className="md:pr-5 flex flex-col md:space-x-5 md:flex-row md:items-center md:justify-between">
        <PageHeader title="Daftar Produk" subTitle="Daftar semua produk yang tersedia" />

        <Link className="mx-5 md:mx-0" to="tambah">
          <Button className="w-full" type="primary" icon={<PlusOutlined />}>
            Tambah Produk
          </Button>
        </Link>
      </div>

      <section className="p-5">
        {kategoris.loading && <Skeleton.Input active block className="mb-5" />}
        {!kategoris.loading && (
          <div className="flex items-start space-x-3 overflow-x-auto">
            <button
              onClick={() => setModalKategoriItem({ tipe: 'TAMBAH' })}
              className="h-20 px-5 py-3 md:px-10 rounded-md border-2 border-color-theme text-color-theme bg-white flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </button>
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
                                {produk?.is_active && (
                                  <Menu.Item danger icon={<CloseCircleOutlined />}>
                                    <button
                                      onClick={() => handleDeactivateProduk(produk)}
                                    >
                                      Deaktivasi Produk
                                    </button>
                                  </Menu.Item>
                                )}
                                {!produk?.is_active && (
                                  <Menu.Item icon={<CheckCircleOutlined />}>
                                    <button onClick={() => handleActivateProduk(produk)}>
                                      Aktivasi Produk
                                    </button>
                                  </Menu.Item>
                                )}
                                <Menu.Item danger icon={<DeleteOutlined />}>
                                  <button onClick={() => handleHapusProduk(produk)}>
                                    Hapus Produk
                                  </button>
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
