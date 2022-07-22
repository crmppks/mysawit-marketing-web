import ModalEskalasiMarketing from '@/components/ModalEskalasiMarketingComponent';
import { confirmAlert } from '@/helpers/swal_helper';
import {
  deleteHapusMarketing,
  getSemuaMarketing,
  putAktivasiMarketing,
  putDeaktivasiMarketing,
  putResetPasswordMarketing,
} from '@/services/marketing';
import Paging from '@/types/Paging';
import UserMarketing from '@/types/UserMarketing';
import {
  DeleteOutlined,
  EditOutlined,
  LockOutlined,
  PlusOutlined,
  UserSwitchOutlined,
} from '@ant-design/icons';
import {
  Badge,
  Button,
  Dropdown,
  Empty,
  Menu,
  message,
  PageHeader,
  Skeleton,
  Tooltip,
} from 'antd';
import { AxiosResponse } from 'axios';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function HalamanDaftarMarketing() {
  const [selectedEskalasiMarketing, setSelectedEskalasiMarketing] = useState<{
    tipe: 'HAPUS_AKUN' | 'NONAKTIFKAN_AKUN' | null;
    marketing: UserMarketing | null;
  }>({
    tipe: null,
    marketing: null,
  });
  const [loadingHalaman, setLoadingHalaman] = useState<boolean>(false);
  const [marketings, setMarketings] = useState<Paging<UserMarketing>>({
    loading: true,
    data: [],
  });

  const handleResetPassword = (marketing: UserMarketing) => {
    confirmAlert(
      'Reset Password Marketing',
      <>
        Apakah anda yakin untuk mereset password akun <b>{marketing.nama}</b>?
      </>,
    ).then((willDelete: boolean) => {
      if (willDelete) {
        putResetPasswordMarketing(marketing.user_id).then(() => {
          message.success('Password berhasil di reset');
        });
      }
    });
  };

  const handleHapusAkun = (marketing: UserMarketing) => {
    confirmAlert(
      'Hapus Akun Marketing',
      <>
        Apakah anda yakin untuk menghapus akun <b>{marketing.nama}</b>?
      </>,
    ).then((willDelete: boolean) => {
      if (willDelete) {
        setSelectedEskalasiMarketing({
          marketing,
          tipe: 'HAPUS_AKUN',
        });
      }
    });
  };

  const handleMuatLebihBanyak = () => {
    setLoadingHalaman(true);
    getSemuaMarketing(marketings.next_page_url)
      .then(({ data }: AxiosResponse<any>) => {
        setMarketings((old) => ({
          ...data,
          data: [...old.data, ...data.data],
        }));
      })
      .finally(() => setLoadingHalaman(false));
  };

  const handleAktivasiMarketing = (marketing: UserMarketing) => {
    putAktivasiMarketing(marketing.user_id).then(() => {
      setMarketings((old) => ({
        ...old,
        data: old.data.map((item) => {
          if (item.user_id === marketing?.user_id) {
            return {
              ...item,
              is_aktif: true,
            };
          }
          return item;
        }),
      }));
    });
  };

  useEffect(() => {
    getSemuaMarketing()
      .then(({ data }: AxiosResponse<any>) => setMarketings(data))
      .finally(() => setMarketings((old) => ({ ...old, loading: false })));
  }, []);

  return (
    <>
      <div className="md:pr-5 flex flex-col md:space-x-5 md:flex-row md:items-center md:justify-between">
        <PageHeader
          title="Daftar Marketing"
          subTitle="Daftar semua marketing yang tersedia"
        />

        <Link className="mx-5 md:mx-0" to={'tambah'}>
          <Button className="w-full" type="primary" icon={<PlusOutlined />}>
            Tambah Akun
          </Button>
        </Link>
      </div>

      <ModalEskalasiMarketing
        marketing={selectedEskalasiMarketing?.marketing}
        onProceed={(params) => {
          if (selectedEskalasiMarketing?.tipe === 'NONAKTIFKAN_AKUN') {
            return putDeaktivasiMarketing(
              selectedEskalasiMarketing?.marketing?.user_id!,
              params,
            );
          }

          return deleteHapusMarketing(
            selectedEskalasiMarketing?.marketing?.user_id!,
            params,
          );
        }}
        onCancel={() => setSelectedEskalasiMarketing({ tipe: null, marketing: null })}
        onSuccess={(marketing) => {
          if (selectedEskalasiMarketing?.tipe === 'HAPUS_AKUN') {
            message.success('Akun berhasil dihapus');
            setMarketings((old) => ({
              ...old,
              data: old.data.filter(
                (m) => m.user_id !== selectedEskalasiMarketing?.marketing?.user_id!,
              ),
            }));
            return;
          }

          setMarketings((old) => ({
            ...old,
            data: old.data.map((item) => {
              if (item.user_id === marketing?.user_id) {
                return {
                  ...item,
                  is_aktif: false,
                };
              }
              return item;
            }),
          }));
        }}
      />
      <section className="p-5">
        {marketings.loading && (
          <>
            <Skeleton.Input block active className="mb-1" />
            <Skeleton.Input block active className="mb-1" />
            <Skeleton.Input block active className="mb-1" />
          </>
        )}
        {!marketings.loading && (
          <>
            {marketings.data.length === 0 && (
              <div className="p-5 rounded bg-white">
                <Empty
                  description={
                    <p className="text-gray-500">Belum ada marketing tersedia</p>
                  }
                />
              </div>
            )}
            {marketings.data.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {marketings.data.map((marketing) => (
                  <div
                    key={marketing.user_id}
                    className={`rounded-md overflow-hidden border ${
                      marketing.is_aktif
                        ? 'border-gray-400 bg-gray-100'
                        : 'border-red-500 bg-red-100'
                    }`}
                  >
                    <div className="bg-white h-24 relative">
                      <Dropdown
                        overlay={
                          <Menu>
                            <Menu.Item icon={<UserSwitchOutlined />}>
                              <button
                                onClick={() =>
                                  marketing.is_aktif
                                    ? setSelectedEskalasiMarketing({
                                        marketing,
                                        tipe: 'NONAKTIFKAN_AKUN',
                                      })
                                    : handleAktivasiMarketing(marketing)
                                }
                              >
                                {marketing.is_aktif ? 'Non-aktifkan' : 'Aktifkan'}
                              </button>
                            </Menu.Item>
                            <Menu.Item icon={<EditOutlined />}>
                              <Link to={`${marketing.user_id}/edit`}>Perbaharui</Link>
                            </Menu.Item>
                            <Menu.Item icon={<LockOutlined />}>
                              <button onClick={() => handleResetPassword(marketing)}>
                                Reset Password
                              </button>
                            </Menu.Item>
                            <Menu.Item danger icon={<DeleteOutlined />}>
                              <button onClick={() => handleHapusAkun(marketing)}>
                                Hapus Akun
                              </button>
                            </Menu.Item>
                          </Menu>
                        }
                        placement="bottomRight"
                        arrow
                      >
                        <button className="absolute right-2 top-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                            />
                          </svg>
                        </button>
                      </Dropdown>
                      <div className="absolute -bottom-6 flex items-center justify-center inset-x-0">
                        <Badge dot status={marketing.is_aktif ? 'success' : 'error'}>
                          <img
                            src={marketing.avatar}
                            alt={marketing.nama}
                            className="w-16 rounded-full"
                          />
                        </Badge>
                      </div>
                    </div>
                    <div className="p-5 mt-3">
                      <Tooltip title={marketing.kode_marketing}>
                        <h4 className="text-center font-bold text-lg mb-0 leading-tight">
                          <Link to={`/marketing/${marketing.user_id}`}>
                            {marketing.nama}
                          </Link>
                        </h4>
                      </Tooltip>
                      <p className="text-center text-gray-400">
                        {marketing.jabatan} - {marketing.kategori_produk.nama}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {marketings.next_page_url && (
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
          </>
        )}
      </section>
    </>
  );
}
