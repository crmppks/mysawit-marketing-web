import 'webix/webix.css';
import { Button, Pagination, Dropdown, Menu, PageHeader, message, Skeleton } from 'antd';
import React, { useState, useEffect, useRef } from 'react';
import * as webix from '@xbs/webix-pro';
import moment from 'moment';
import { DeleteOutlined, LockOutlined, MoreOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import {
  deleteHapusKonsumen,
  getSemuaKategoriKonsumen,
  getSemuaKategoriKonsumenCascader,
  getSemuaKategoriKonsumenOptions,
  getSemuaKonsumen,
  postTambahKategoriKonsumen,
  putResetPasswordKonsumen,
  putUpdateKategoriKonsumen,
} from '@/services/konsumen';
import UserKonsumen from '@/types/UserKonsumen';
import { webixTableParams } from '@/helpers/webix_helper';
import { confirmAlert } from '@/helpers/swal_helper';
import Kategori from '@/types/Kategori';
import ModalKategori, { ModalKategoriItem } from '@/components/ModalKategoriComponent';

export default function HalamanDaftarKonsumen() {
  const webixTableRef = useRef<any>();
  const uiTable = useRef<any>();

  const navigate = useNavigate();

  const [modalKategoriItem, setModalKategoriItem] = useState<ModalKategoriItem | null>(
    null,
  );
  const [kategoris, setKategoris] = useState<{
    data: Kategori[];
    loading: boolean;
  }>({ data: [], loading: true });
  const [konsumen, setKonsumen] = useState<UserKonsumen | null>(null);
  const [page, setPage] = useState<{
    current: number;
    last: number;
    total: number;
    per_page: number;
  }>({ current: 1, last: 1, total: 1, per_page: 15 });

  const handleResetPassword = () => {
    confirmAlert(
      'Reset Password Konsumen',
      <>
        Apakah anda yakin untuk mereset password akun <b>{konsumen?.nama}</b>?
      </>,
    ).then((willDelete: boolean) => {
      if (willDelete) {
        putResetPasswordKonsumen(konsumen?.user_id!).then(() => {
          message.success('Password berhasil di reset');
        });
      }
    });
  };

  const handleHapusAkun = () => {
    confirmAlert(
      'Hapus Akun Konsumen',
      <>
        Apakah anda yakin untuk menghapus akun <b>{konsumen?.nama}</b>?
      </>,
    ).then((willDelete: boolean) => {
      if (willDelete) {
        deleteHapusKonsumen(konsumen?.user_id!).then(() => {
          message.success('Akun berhasil dihapus');
          const childs = uiTable.current.getChildViews();
          if (childs) {
            childs[0].remove(childs[0].getSelectedId());
          }
        });
      }
    });
  };

  useEffect(() => {
    uiTable.current = webix.ui(
      {
        rows: [
          {
            view: 'datatable',
            columns: [
              {
                id: 'kategori_konsumen_id',
                header: [{ text: 'Kategori' }, { content: 'serverMultiSelectFilter' }],
                minWidth: 250,
                options: async function () {
                  const { data } = await getSemuaKategoriKonsumenOptions();

                  return data;
                },
                template: (o: any) => `<b>${o.kategori_konsumen.nama}</b>`,
              },
              {
                id: 'nama',
                header: [{ text: 'Nama' }, { content: 'serverFilter' }],
                minWidth: 250,
                fillspace: true,
                sort: 'string',
              },
              {
                id: 'username',
                header: [{ text: 'Username' }, { content: 'serverFilter' }],
                minWidth: 200,
              },
              {
                id: 'email',
                header: [{ text: 'Email' }, { content: 'serverFilter' }],
                minWidth: 250,
                sort: 'string',
              },
              {
                id: 'no_hp',
                header: [{ text: 'No. HP' }, { content: 'serverFilter' }],
                minWidth: 200,
              },
              {
                id: 'tgl_lahir',
                header: [{ text: 'Tgl Lahir' }, { content: 'dateRangeFilter' }],
                minWidth: 200,
                hidden: true,
                template: function (obj: any) {
                  return moment(obj.tgl_lahir).format('DD MMMM YYYY');
                },
              },
              {
                id: 'created_at',
                header: [{ text: 'Bergabung Pada' }, { content: 'dateRangeFilter' }],
                minWidth: 200,
                template: function (obj: any) {
                  return moment(obj.created_at).format('DD MMMM YYYY, HH:mm');
                },
              },
            ],
            scroll: true,
            autoheight: true,
            // autowidth:true,
            select: true,
            // footer:true,
            resizeColumn: true,
            url: async function (params: any) {
              try {
                const {
                  data: { data, current_page, last_page, total, per_page },
                } = await getSemuaKonsumen(webixTableParams(params), page.current);

                setPage((old) => ({
                  current: params ? old.current : current_page,
                  last: last_page,
                  total,
                  per_page,
                }));

                return data;
              } catch (e) {
                console.log(e);
                return [];
              }
            },
            on: {
              onAfterSelect: function (selection: any) {
                const item = (this as any).getItem(selection.id);
                setKonsumen(item);
              },
              onAfterUnSelect: function (selection: any) {
                setKonsumen(null);
              },
              onItemDblClick: function (selection: any) {
                const item = (this as any).getItem(selection.toString());
                navigate(item.user_id);
              },
            },
          },
        ],
      },
      webixTableRef.current,
    );

    return () => {
      setKonsumen(null);
      uiTable.current.destructor();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page.current]);

  useEffect(() => {
    getSemuaKategoriKonsumen().then(({ data }) => setKategoris({ loading: false, data }));
  }, []);

  // useEffect(() => {
  //   if (selectedKategori) {
  //     const childs = uiTable.current.getChildViews();
  //     if (childs) {
  //       childs[0].setState({
  //         ...childs[0].getState(),
  //         filter: {
  //           ...childs[0].getState().filter,
  //           kategori_konsumen_id: selectedKategori.id,
  //         },
  //       });
  //     }
  //   }
  // }, [selectedKategori]);

  return (
    <React.Fragment>
      <PageHeader
        className="site-page-header"
        title="Daftar Konsumen"
        subTitle="Daftar semua konsumen yang tersedia"
      />
      <ModalKategori
        visible={!!modalKategoriItem}
        tipe="Konsumen"
        kategoriItem={modalKategoriItem}
        getCascaderAction={getSemuaKategoriKonsumenCascader}
        postAddAction={(params) => postTambahKategoriKonsumen(params)}
        putUpdateAction={(kategori_id, params) =>
          putUpdateKategoriKonsumen(kategori_id, params)
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
      {kategoris.loading && <Skeleton.Input active block className="px-5" />}
      {!kategoris.loading && (
        <div className="flex items-start space-x-3 overflow-x-auto px-5">
          <button
            onClick={() => setModalKategoriItem({ tipe: 'TAMBAH' })}
            className="px-5 py-2 md:px-10 rounded-md border-2 border-color-theme text-color-theme bg-white flex items-center"
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
          {kategoris.data.map((kategori) => (
            <Link
              key={kategori.id}
              to={`/kategori/konsumen/${kategori.id}`}
              className="my-kategori-produk text-lg px-5 py-3 rounded-md border-2 relative flex-none max-w-xs"
            >
              {kategori.nama}
            </Link>
          ))}
        </div>
      )}
      <div className="p-5 flex flex-col space-y-5 md:space-y-0 md:flex-row items-center justify-between">
        <Pagination
          onChange={(current) => setPage((old) => ({ ...old, current }))}
          defaultCurrent={page.current}
          total={page.total}
          pageSize={page.per_page}
          showSizeChanger={false}
        />

        <div className="flex space-x-2">
          <Button
            onClick={() => navigate(konsumen?.user_id!)}
            disabled={!konsumen}
            type="primary"
          >
            Lihat Detail
          </Button>
          <Dropdown
            disabled={!konsumen}
            arrow
            overlay={
              <Menu>
                <Menu.Item icon={<LockOutlined />}>
                  <button onClick={() => handleResetPassword()}>Reset Password</button>
                </Menu.Item>
                <Menu.Item danger icon={<DeleteOutlined />}>
                  <button onClick={() => handleHapusAkun()}>Hapus Akun</button>
                </Menu.Item>
              </Menu>
            }
          >
            <Button type="default" icon={<MoreOutlined />}></Button>
          </Dropdown>
        </div>
      </div>
      <div className="overflow-x-auto" ref={webixTableRef}></div>
    </React.Fragment>
  );
}
