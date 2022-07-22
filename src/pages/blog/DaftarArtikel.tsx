import { confirmAlert } from '@/helpers/swal_helper';
import {
  deleteHapusArtikel,
  getSemuaArtikel,
  putSimpanDraftArtikel,
  putSimpanPublikasiArtikel,
} from '@/services/artikel';
import Artikel from '@/types/Artikel';
import Paging from '@/types/Paging';
import {
  CheckOutlined,
  CommentOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  FlagOutlined,
  LikeOutlined,
} from '@ant-design/icons';
import { Button, Dropdown, Empty, Menu, PageHeader, Skeleton, Tabs } from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const RenderThumbnail = ({
  artikel,
  onDelete,
  onPublicated,
  onDrafted,
}: {
  artikel: Artikel;
  onDelete: (artikel: Artikel) => void;
  onPublicated: (artikel: Artikel) => void;
  onDrafted: (artikel: Artikel) => void;
}) => (
  <div className="rounded border flex flex-col md:flex-row relative overflow-hidden">
    {/* <div className="flex-none w-4/12 md:w-60 flex items-center"> */}
    <img src={artikel.banner} alt={artikel.judul} className="flex-none w-full md:w-60" />
    {/* </div> */}
    <div className="flex-grow px-5 py-3">
      <Dropdown
        overlay={
          <Menu>
            {artikel.status === 'AKTIF' ? (
              <Menu.Item icon={<FlagOutlined />}>
                <button onClick={() => onDrafted(artikel)}>Simpan ke Draft</button>
              </Menu.Item>
            ) : (
              <Menu.Item icon={<CheckOutlined />}>
                <button onClick={() => onPublicated(artikel)}>Publikasikan</button>
              </Menu.Item>
            )}
            <Menu.Item icon={<EditOutlined />}>
              <Link to={`${artikel.id}/edit`}>Perbaharui</Link>
            </Menu.Item>
            <Menu.Item danger icon={<DeleteOutlined />}>
              <button onClick={() => onDelete(artikel)}>Hapus Artikel</button>
            </Menu.Item>
          </Menu>
        }
        placement="topRight"
        arrow
      >
        <button className="bg-white absolute right-[5px] top-[5px] border rounded p-2 hover:border-color-theme hover:text-color-theme">
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
      <h3 className="font-semibold text-lg mb-0 mt-0 leading-tight">
        <Link to={artikel.id}>{artikel.judul}</Link>
      </h3>
      <span className="font-semibold">
        {moment(artikel.created_at).format('dddd, DD MMMM yyyy')}
      </span>
      <p className="text-gray-500 mb-0 mt-2">{artikel.kalimat_pembuka}</p>
      <div className="flex items-center space-x-5 justify-end">
        <div className="flex items-center space-x-2">
          <LikeOutlined />
          <span className="font-semibold">{artikel.jumlah_suka}</span>
        </div>
        <div className="flex items-center space-x-2">
          <EyeOutlined />
          <span className="font-semibold">{artikel.jumlah_baca}</span>
        </div>
        <div className="flex items-center space-x-2">
          <CommentOutlined />
          <span className="font-semibold">{artikel.diskusi_count}</span>
        </div>
      </div>
    </div>
  </div>
);

export default function HalamanDaftarArtikel() {
  const [artikelAktif, setArtikelAktif] = useState<Paging<Artikel>>({
    data: [],
    loading: true,
  });
  const [artikelNonAktif, setArtikelNonAktif] = useState<Paging<Artikel>>({
    data: [],
    loading: true,
  });
  const [loadingHalaman, setLoadingHalaman] = useState<boolean>(false);

  const handleSimpanDraft = (artikel: Artikel) => {
    confirmAlert(
      'Simpan ke Draft',
      <>
        Apakah anda yakin untuk menyimpan artikel <b>{artikel.judul}</b> ke Draft?
      </>,
    ).then((confirmed: boolean) => {
      if (confirmed) {
        putSimpanDraftArtikel(artikel.id).then(() => {
          setArtikelAktif((old) => ({
            ...old,
            data: old.data.filter((item) => item.id !== artikel.id),
          }));

          setArtikelNonAktif((old) => ({
            ...old,
            data: [...old.data, artikel],
          }));
        });
      }
    });
  };

  const handleSimpanPublikasi = (artikel: Artikel) => {
    confirmAlert(
      'Publikasikan Artikel',
      <>
        Apakah anda yakin untuk mempublikasikan artikel <b>{artikel.judul}</b>?
      </>,
    ).then((confirmed: boolean) => {
      if (confirmed) {
        putSimpanPublikasiArtikel(artikel.id).then(() => {
          setArtikelNonAktif((old) => ({
            ...old,
            data: old.data.filter((item) => item.id !== artikel.id),
          }));

          setArtikelAktif((old) => ({
            ...old,
            data: [...old.data, artikel],
          }));
        });
      }
    });
  };

  const handleHapusArtikel = (artikel: Artikel) => {
    confirmAlert(
      'Hapus Artikel',
      <>
        Apakah anda yakin untuk menghapus artikel <b>{artikel.judul}</b>?
      </>,
    ).then((willDelete: boolean) => {
      if (willDelete) {
        deleteHapusArtikel(artikel.id).then(() => {
          if (artikel.status === 'AKTIF') {
            setArtikelAktif((old) => ({
              ...old,
              data: old.data.filter((item) => item.id !== artikel.id),
            }));
          }

          if (artikel.status === 'NON_AKTIF') {
            setArtikelNonAktif((old) => ({
              ...old,
              data: old.data.filter((item) => item.id !== artikel.id),
            }));
          }
        });
      }
    });
  };

  const handleMuatLebihBanyak = (status: 'AKTIF' | 'NON_AKTIF') => {
    setLoadingHalaman(true);
    getSemuaArtikel(
      status,
      (status === 'AKTIF' ? artikelAktif : artikelNonAktif).next_page_url,
    )
      .then(({ data }) => {
        if (status === 'AKTIF') {
          setArtikelAktif((old) => ({
            ...data,
            data: [...old.data, ...data.data],
          }));
        }

        if (status === 'NON_AKTIF') {
          setArtikelNonAktif((old) => ({
            ...data,
            data: [...old.data, ...data.data],
          }));
        }
      })
      .finally(() => setLoadingHalaman(false));
  };

  useEffect(() => {
    getSemuaArtikel('AKTIF')
      .then(({ data }) => setArtikelAktif(data))
      .finally(() => setArtikelAktif((old) => ({ ...old, loading: false })));
    getSemuaArtikel('NON_AKTIF')
      .then(({ data }) => setArtikelNonAktif(data))
      .finally(() => setArtikelNonAktif((old) => ({ ...old, loading: false })));
  }, []);

  return (
    <>
      <div className="md:pr-5 flex flex-col md:space-x-5 md:flex-row md:items-center md:justify-between">
        <PageHeader title="Daftar Artikel" />

        <Link className="mx-5 md:mx-0" to="tulis">
          <Button className="w-full" type="primary" icon={<EditOutlined />}>
            Tulis Artikel
          </Button>
        </Link>
      </div>
      <section className="px-5 pb-5 bg-white">
        <Tabs centered defaultActiveKey="1">
          <Tabs.TabPane tab={<b>Dipublikasikan</b>} key={'1'}>
            {artikelAktif.loading && <Skeleton active />}
            {!artikelAktif.loading && (
              <>
                {artikelAktif.data.length === 0 && (
                  <Empty
                    description={
                      <p className="text-gray-500">Belum ada artikel yang dipublikasi</p>
                    }
                  />
                )}
                <div className="space-y-5">
                  {artikelAktif.data.map((artikel) => (
                    <RenderThumbnail
                      artikel={artikel}
                      key={artikel.id}
                      onDrafted={() => handleSimpanDraft(artikel)}
                      onPublicated={() => handleSimpanPublikasi(artikel)}
                      onDelete={() => handleHapusArtikel(artikel)}
                    />
                  ))}
                </div>
                {artikelAktif.next_page_url && (
                  <div className="flex items-center justify-center mt-10">
                    <Button
                      onClick={() => handleMuatLebihBanyak('AKTIF')}
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
          </Tabs.TabPane>
          <Tabs.TabPane tab={<b>Draft</b>} key={'2'}>
            {artikelNonAktif.loading && <Skeleton active />}
            {!artikelNonAktif.loading && (
              <>
                {artikelNonAktif.data.length === 0 && (
                  <Empty
                    description={
                      <p className="text-gray-500">Belum ada artikel dalam draft</p>
                    }
                  />
                )}
                <div className="space-y-5">
                  {artikelNonAktif.data.map((artikel) => (
                    <RenderThumbnail
                      artikel={artikel}
                      key={artikel.id}
                      onDrafted={() => handleSimpanDraft(artikel)}
                      onPublicated={() => handleSimpanPublikasi(artikel)}
                      onDelete={() => handleHapusArtikel(artikel)}
                    />
                  ))}
                </div>
                {artikelNonAktif.next_page_url && (
                  <div className="flex items-center justify-center mt-10">
                    <Button
                      onClick={() => handleMuatLebihBanyak('NON_AKTIF')}
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
          </Tabs.TabPane>
        </Tabs>
      </section>
    </>
  );
}
