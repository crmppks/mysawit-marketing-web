import ReviewComponent from '@/components/ReviewComponent';
import { formatCurrency } from '@/helpers/order_helper';
import {
  getDetailProdukWithStok,
  getRatingProduk,
  getUlasanProduk,
} from '@/services/produk';
import Paging from '@/types/Paging';
import Produk from '@/types/Produk';
import UlasanProduk from '@/types/UlasanProduk';
import { StarFilled } from '@ant-design/icons';
import { Empty, PageHeader, Pagination, Progress, Rate, Skeleton, Tabs } from 'antd';
import { AxiosResponse } from 'axios';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export default function HalamanDetailProduk() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState<boolean>(true);
  const [produk, setProduk] = useState<Produk | null>(null);
  const [rating, setRating] = useState<{
    list: Array<{ total: number; rating: number }>;
    max: number;
  }>({
    list: [],
    max: 1,
  });
  const [ulasan, setUlasan] = useState<Paging<UlasanProduk>>({
    data: [],
    loading: true,
    current_page: 1,
  });

  const handleReviewsPageChange = (value: number) => {
    getUlasanProduk(id as string, value).then(({ data }: AxiosResponse<any>) =>
      setUlasan(data),
    );
  };

  useEffect(() => {
    // setLoading(true);
    getDetailProdukWithStok(id as string).then(({ data }) => {
      setProduk(data);
      setLoading(false);
    });

    getUlasanProduk(id as string).then(({ data }) => {
      setUlasan(data);
    });
    getRatingProduk(id as string).then(({ data }) => setRating(data));
  }, [id]);

  if (loading) return <Skeleton active className="p-5" />;

  return (
    <>
      <PageHeader
        onBack={() => navigate('/produk')}
        breadcrumb={{
          routes: [
            {
              path: 'produk',
              breadcrumbName: 'Daftar Produk',
            },
            {
              path: id as string,
              breadcrumbName: 'Detail Produk',
            },
          ],
        }}
        title="Detail Produk"
        subTitle="Lihat detail informasi tentang produk"
      />

      <section className="p-5 bg-white rounded mx-5 mb-5">
        <div className="w-full md:flex-grow">
          <div className="grid grid-cols-12 gap-10">
            <div className="col-span-12 md:col-span-5 lg:col-span-4">
              <img
                src={produk?.banner}
                alt={produk?.nama}
                className="md:w-full w-52 rounded overflow-hidden"
              />
            </div>
            <div className="col-span-12 md:col-span-7">
              <h1 className="text-2xl md:text-3xl font-bold mb-2">{produk?.nama}</h1>
              <p className="text-gray-400 text-xs">
                Terjual {produk?.jumlah_terjual} .{produk?.jumlah_lihat}x
              </p>
              <p className="flex items-center">
                <span className="text-3xl font-bold">{formatCurrency(produk.harga)}</span>
              </p>
              <Tabs defaultActiveKey="1">
                <Tabs.TabPane tab="Detail Produk" key="1">
                  <div
                    className="text-gray-500"
                    dangerouslySetInnerHTML={{ __html: produk.deskripsi }}
                  ></div>
                </Tabs.TabPane>
                <Tabs.TabPane tab="Informasi Lainnya" key="2">
                  <div className="divide-y divide-gray-300 divide-dashed">
                    <p className="mb-0 pb-2 last:pb-0 pt-2 first:pt-0 flex items-center justify-between">
                      <span className="text-gray-500">Berat</span>
                      <span>{produk.berat} gr</span>
                    </p>
                    <p className="mb-0 pb-2 last:pb-0 pt-2 first:pt-0 flex items-center justify-between">
                      <span className="text-gray-500">Dilihat</span>
                      <span>{produk.jumlah_lihat} kali</span>
                    </p>
                    <p className="mb-0 pb-2 last:pb-0 pt-2 first:pt-0 flex items-center justify-between">
                      <span className="text-gray-500">Terjual</span>
                      <span>{produk.jumlah_terjual}</span>
                    </p>
                  </div>
                </Tabs.TabPane>
                <Tabs.TabPane tab="Stok" key={'3'}>
                  {produk?.stok?.length === 0 && (
                    <div className="border border-dashed p-5 rounded">
                      <Empty
                        description={
                          <span className="text-gray-500">Tidak ada stok tersedia</span>
                        }
                      />
                    </div>
                  )}
                  {produk?.stok?.map((item) => (
                    <div key={item.id} className="border rounded px-5 py-3">
                      <span className="font-bold text-gray-500">
                        {moment(item.tersedia_dari).format('Do MMMM yyyy')} -{' '}
                        {moment(item.tersedia_hingga).format('Do MMMM yyyy')}
                      </span>
                      <p className="mt-3 mb-0">
                        <span className="font-bold text-2xl md:text-4xl text-color-theme">
                          {item.jumlah}
                        </span>
                      </p>
                    </div>
                  ))}
                </Tabs.TabPane>
              </Tabs>
              <hr className="my-5" />
              <p className="flex justify-between">
                <span className="text-gray-500">Kategori</span>
                <span className="text-color-theme font-semibold">
                  {produk.kategori.nama}
                </span>
              </p>
            </div>
          </div>
          <div className="mt-10">
            <p className="font-semibold">{produk.jumlah_ulasan} ULASAN</p>
            <div className="flex flex-col md:flex-row md:space-x-10">
              <div className="flex-none">
                <p className="flex items-end">
                  <span className="text-7xl md:text-8xl">{produk.nilai}</span>
                  <span>/ 5</span>
                </p>
                <Rate
                  style={{ color: '#ff9800' }}
                  disabled
                  allowHalf
                  defaultValue={produk.nilai}
                />
              </div>
              <div className="w-full mt-5 md:mt-0">
                {rating.list.map((item, index) => (
                  <div key={`rating_${index}`} className="flex items-center">
                    <StarFilled />
                    <b className="mr-5 ml-1 text-gray-500">{item.rating}</b>
                    <Progress
                      percent={(item.total / rating.max) * 100}
                      showInfo={false}
                    />
                    <span className="mr-5 ml-1">{item.total}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <hr className="mt-5" />
          <div className="mt-10">
            <p className="font-semibold uppercase">Semua Ulasan</p>

            {ulasan.data.length === 0 && (
              <div className="border border-dashed p-5 rounded">
                <Empty
                  description={
                    <span className="text-gray-500">Tidak ada ulasan tersedia</span>
                  }
                />
              </div>
            )}
            {ulasan.data.map((rev) => (
              <ReviewComponent
                key={rev.id}
                item={rev}
                onDelete={(deleted) => {
                  setUlasan((old) => ({
                    ...old,
                    data: old.data.filter((k) => k.id !== deleted.id),
                    total: old.total! - 1,
                  }));
                }}
              />
            ))}
            {(ulasan.next_page_url || (ulasan.current_page ?? 1) > 1) && (
              <div className="mt-10">
                <Pagination
                  className="mt-10"
                  showSizeChanger={false}
                  onChange={handleReviewsPageChange}
                  defaultCurrent={ulasan.current_page}
                  total={ulasan.total}
                  pageSize={ulasan.per_page}
                />
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
