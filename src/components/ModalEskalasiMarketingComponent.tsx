import { getCekEskalasiMarketing } from '@/services/marketing';
import Paging from '@/types/Paging';
import UserMarketing from '@/types/UserMarketing';
import { LoadingOutlined } from '@ant-design/icons';
import { Button, Modal, ModalProps } from 'antd';
import { AxiosResponse } from 'axios';
import { useEffect, useState } from 'react';

interface Props extends ModalProps {
  marketing: UserMarketing | null;
  onCancel: () => void;
  onSuccess: (marketing: UserMarketing) => void;
  onProceed: (params: {
    marketing_from: string;
    marketing_to: string;
  }) => Promise<AxiosResponse<any, any>>;
}

export default function ModalEskalasiMarketing({
  marketing,
  onCancel,
  onProceed,
  onSuccess,
}: Props) {
  const [loadingHalaman, setLoadingHalaman] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [selectedMarketing, setSelectedMarketing] = useState<UserMarketing | null>(null);
  const [listMarketingAktif, setListMarketingAktif] = useState<Paging<UserMarketing>>({
    loading: false,
    data: [],
  });

  const handleDeaktivasi = () => {
    setSubmitting(true);
    onProceed({
      marketing_from: marketing?.user_id!,
      marketing_to: selectedMarketing?.user_id!,
    })
      .then(() => {
        onSuccess(marketing!);
        onCancel();
      })
      .finally(() => setSubmitting(false));
  };

  const handleMuatLebihBanyak = () => {
    setLoadingHalaman(true);
    getCekEskalasiMarketing(marketing?.user_id!, listMarketingAktif.next_page_url)
      .then(({ data }: AxiosResponse<any>) => {
        setListMarketingAktif((old) => ({
          ...data,
          data: [...old.data, ...data.data],
        }));
      })
      .finally(() => setLoadingHalaman(false));
  };

  useEffect(() => {
    if (marketing) {
      setListMarketingAktif((old) => ({ ...old, loading: true }));
      getCekEskalasiMarketing(marketing.user_id)
        .then(({ data }) => {
          setListMarketingAktif(data);
        })
        .finally(() => setListMarketingAktif((old) => ({ ...old, loading: false })));
    } else {
      setSelectedMarketing(null);
    }
  }, [marketing]);

  return (
    <Modal
      okText="Selesai"
      onCancel={onCancel}
      onOk={handleDeaktivasi}
      okButtonProps={{
        loading: submitting,
        disabled: !selectedMarketing,
      }}
      title="Eskalasi Marketing"
      visible={!!marketing}
    >
      {listMarketingAktif.loading && (
        <div className="flex items-center justify-center">
          <LoadingOutlined className="text-2xl" />
        </div>
      )}
      {!listMarketingAktif.loading && (
        <>
          <div className="px-5 py-3 flex items-center space-x-5 border-2 border-yellow-500 rounded-md">
            <img
              src={marketing?.avatar}
              alt={marketing?.nama}
              className="w-10 rounded-full"
            />
            <div>
              <h4 className="mb-0 leading-tight">{marketing?.nama}</h4>
              <p className="text-gray-400 mb-0">
                {marketing?.jabatan} - {marketing?.kategori_produk?.nama}
              </p>
            </div>
          </div>
          <div className="my-7 flex justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </div>
          {selectedMarketing && (
            <div className="px-5 py-3 flex items-center space-x-5 border-2 border-color-theme rounded-md">
              <img
                src={selectedMarketing?.avatar}
                alt={selectedMarketing?.nama}
                className="w-10 rounded-full"
              />
              <div className="flex-grow">
                <h4 className="mb-0 leading-tight">{selectedMarketing?.nama}</h4>
                <p className="text-gray-400 mb-0">{selectedMarketing?.jabatan}</p>
              </div>
              <div className="flex items-center">
                <button
                  onClick={() => setSelectedMarketing(null)}
                  className="rounded-full text-xs bg-color-theme text-white px-3 py-1 hover:bg-green-500"
                >
                  Ubah
                </button>
              </div>
            </div>
          )}
          {!selectedMarketing && (
            <>
              <div className="border rounded-md overflow-hidden divide-y">
                {listMarketingAktif.data.map((marketing_item) => (
                  <div
                    key={marketing_item.user_id}
                    onClick={() => setSelectedMarketing(marketing_item)}
                    className="px-5 py-3 flex items-center space-x-5 hover:bg-green-100 cursor-pointer"
                  >
                    <img
                      src={marketing_item.avatar}
                      alt={marketing_item.nama}
                      className="w-10 rounded-full"
                    />
                    <div>
                      <h4 className="mb-0 leading-tight">{marketing_item.nama}</h4>
                      <p className="text-gray-400 mb-0">
                        {marketing_item.jabatan} - {marketing_item.kategori_produk?.nama}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              {listMarketingAktif.next_page_url && (
                <div className="flex justify-center mt-5">
                  <Button
                    onClick={() => handleMuatLebihBanyak()}
                    loading={loadingHalaman}
                    shape="round"
                  >
                    Muat Lebih Banyak
                  </Button>
                </div>
              )}
            </>
          )}
        </>
      )}
    </Modal>
  );
}
