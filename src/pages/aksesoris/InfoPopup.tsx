import ModalPopup, { ModalPopupItem } from '@/components/ModalPopupComponent';
import { confirmAlert } from '@/helpers/swal_helper';
import { deleteHapusPopup, getSemuaPopup, postNonAktifkanPopup } from '@/services/popup';
import Popup from '@/types/Popup';
import {
  CloseOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  MoreOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { Button, Dropdown, Empty, Menu, PageHeader } from 'antd';
import { AxiosResponse } from 'axios';
import moment from 'moment';
import { useEffect, useState } from 'react';

export default function HalamanInfoPopup() {
  const [loading, setLoading] = useState<number | null>(null);
  const [samplePopup, setSamplePopup] = useState<Popup | undefined>(undefined);
  const [items, setItems] = useState<Popup[]>([]);
  const [modalPopupItem, setModalPopupItem] = useState<ModalPopupItem | null>(null);

  const handleNonAktifkan = (popup: Popup) => {
    setLoading(popup.id);
    postNonAktifkanPopup(popup.id)
      .then(() => {
        setItems((old) =>
          old.map((item) => (item.id === popup.id ? { ...item, is_aktif: false } : item)),
        );
      })
      .finally(() => setLoading(null));
  };

  const handleHapus = (popup: Popup) => {
    confirmAlert(
      'Hapus Popup',
      <>
        Apakah anda yakin untuk menghapus popup <b>{popup.judul}</b>?
      </>,
    ).then((willDelete: boolean) => {
      if (willDelete) {
        setLoading(popup.id);
        deleteHapusPopup(popup.id)
          .then(() => {
            setItems(items.filter((item: any) => item.id !== popup.id));
          })
          .finally(() => setLoading(null));
      }
    });
  };

  useEffect(() => {
    getSemuaPopup().then(({ data }: AxiosResponse<Popup[]>) => {
      setItems(data);
      setSamplePopup(data.find((item) => item.is_aktif === true));
    });
  }, []);

  return (
    <>
      <ModalPopup
        visible={!!modalPopupItem}
        modalItem={modalPopupItem}
        onCancel={() => setModalPopupItem(null)}
        onFinishAdd={(item) =>
          setItems((old) => [
            ...old.map((oldItem) =>
              item.is_aktif ? { ...oldItem, is_aktif: false } : oldItem,
            ),
            item,
          ])
        }
        onFinishUpdate={(item) =>
          setItems((old) =>
            old.map((oldItem) =>
              oldItem.id === item.id
                ? item
                : { ...oldItem, is_aktif: item.is_aktif ? false : oldItem.is_aktif },
            ),
          )
        }
      />
      <div className="md:pr-5 flex flex-col md:space-x-5 md:flex-row md:items-center md:justify-between">
        <PageHeader
          title="Popup Informasi"
          subTitle="Daftar semua popup informasi yang tersedia. Hanya boleh ada satu popup yang aktif per periode tertentu."
        />
        <Button
          onClick={() => setModalPopupItem({ tipe: 'TAMBAH' })}
          className="mx-5 md:mx-0"
          type="primary"
          icon={<PlusOutlined />}
        >
          Tambah Popup
        </Button>
      </div>

      <section className="p-5">
        {samplePopup && (
          <div className="absolute inset-0 items-center justify-center flex bg-black bg-opacity-75 z-50">
            <div className="relative">
              <button
                onClick={() => setSamplePopup(undefined)}
                className="absolute -right-2 -top-2 rounded-full bg-white"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-7 w-7"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              <img
                src={samplePopup.image}
                alt={samplePopup.judul}
                className="max-w-full"
              />
            </div>
          </div>
        )}
        {items.length === 0 && (
          <div className="bg-white rounded-md p-5">
            <Empty
              description={<p className="text-gray-500">Belum ada popup yang tersedia</p>}
            />
          </div>
        )}
        {items.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
            {items.map((item) => (
              <div
                key={item.id}
                className={`rounded-md overflow-hidden relative ${
                  item.is_aktif && 'border-2 border-color-theme'
                }`}
              >
                <img src={item.image} alt={item.judul} className="max-w-full" />
                {!item.is_aktif && (
                  <div className="absolute inset-0 bg-opacity-75 bg-white flex items-center justify-center space-x-2">
                    <Button
                      loading={loading === item.id}
                      type="primary"
                      onClick={() =>
                        setModalPopupItem({
                          tipe: 'AKTIFASI',
                          item: { ...item, is_aktif: true },
                        })
                      }
                    >
                      Aktifkan
                    </Button>
                    <Dropdown
                      overlay={
                        <Menu>
                          <Menu.Item icon={<EyeOutlined />}>
                            <button onClick={() => setSamplePopup(item)}>
                              Tampilkan
                            </button>
                          </Menu.Item>
                          <Menu.Item icon={<EditOutlined />}>
                            <button
                              onClick={() => setModalPopupItem({ tipe: 'EDIT', item })}
                            >
                              Edit
                            </button>
                          </Menu.Item>
                          <Menu.Item danger icon={<DeleteOutlined />}>
                            <button onClick={() => handleHapus(item)}>Hapus Popup</button>
                          </Menu.Item>
                        </Menu>
                      }
                      placement="topRight"
                      arrow
                    >
                      <Button
                        loading={loading === item.id}
                        icon={<MoreOutlined />}
                      ></Button>
                    </Dropdown>
                  </div>
                )}
                {item.is_aktif && (
                  <div className="absolute bottom-0 inset-x-0 p-2 bg-white bg-opacity-70 flex items-center justify-between">
                    <div className="flex items-center space-x-1 flex-grow">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-7 w-7 text-color-theme"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="font-semibold text-color-theme">
                        Aktif hingga {moment(item.tgl_berakhir).format('DD MMMM yyyy')}
                      </span>
                    </div>
                    <Dropdown
                      overlay={
                        <Menu>
                          <Menu.Item icon={<EyeOutlined />}>
                            <button onClick={() => setSamplePopup(item)}>
                              Tampilkan
                            </button>
                          </Menu.Item>
                          <Menu.Item icon={<CloseOutlined />}>
                            <button onClick={() => handleNonAktifkan(item)}>
                              Non-Aktifkan
                            </button>
                          </Menu.Item>
                          <Menu.Item icon={<EditOutlined />}>
                            <button
                              onClick={() => setModalPopupItem({ tipe: 'EDIT', item })}
                            >
                              Edit
                            </button>
                          </Menu.Item>
                          <Menu.Item danger icon={<DeleteOutlined />}>
                            <button onClick={() => handleHapus(item)}>Hapus Popup</button>
                          </Menu.Item>
                        </Menu>
                      }
                      placement="topRight"
                      arrow
                    >
                      <Button
                        loading={loading === item.id}
                        icon={<MoreOutlined />}
                      ></Button>
                    </Dropdown>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
