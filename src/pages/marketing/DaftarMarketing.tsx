import Paging from '@/types/Paging';
import UserMarketing from '@/types/UserMarketing';
import { Badge, Button, Empty, PageHeader, Skeleton, Tooltip } from 'antd';
import { AxiosResponse } from 'axios';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getSemuaMarketing } from '@/services/marketing';

export default function HalamanDaftarMarketing() {
  const [loadingHalaman, setLoadingHalaman] = useState<boolean>(false);
  const [marketings, setMarketings] = useState<Paging<UserMarketing>>({
    loading: true,
    data: [],
  });

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

  useEffect(() => {
    getSemuaMarketing()
      .then(({ data }: AxiosResponse<any>) => setMarketings(data))
      .finally(() => setMarketings((old) => ({ ...old, loading: false })));
  }, []);

  return (
    <>
      <PageHeader
        title="Daftar Marketing"
        subTitle="Daftar semua marketing yang tersedia"
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
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
                        {marketing.jabatan} - {marketing.kategori_produk?.nama}
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
