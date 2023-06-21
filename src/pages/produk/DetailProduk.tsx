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
import { SmallDashOutlined, StarFilled } from '@ant-design/icons';
import {
  Alert,
  Badge,
  Calendar,
  Empty,
  Image,
  PageHeader,
  Pagination,
  Progress,
  Rate,
  Skeleton,
  Tabs,
  Tooltip,
} from 'antd';
import { AxiosResponse } from 'axios';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

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
              path: '/produk',
              breadcrumbName: 'Daftar Produk',
            },
            {
              path: `/produk/${id}`,
              breadcrumbName: 'Detail Produk',
            },
          ],
          itemRender: (route, _, routes) => {
            const last = routes.indexOf(route) === routes.length - 1;
            return last ? (
              <span>{route.breadcrumbName}</span>
            ) : (
              <Link to={route.path}>{route.breadcrumbName}</Link>
            );
          },
        }}
        title="Detail Produk"
        subTitle="Lihat detail informasi tentang produk"
      />
      {!produk?.is_active && (
        <div className="mb-5 mx-5">
          <Alert
            message="Produk ini sedang tidak aktif, konsumen tidak akan dapat melakukan pemesanan"
            banner
          />
        </div>
      )}
      <section className="p-5 bg-white rounded mx-5 mb-5">
        <div className="w-full md:flex-grow">
          <div className="grid grid-cols-12 md:gap-10">
            <div className="col-span-12 md:col-span-5 lg:col-span-4 flex justify-center md:justify-start pb-10 md:mb-0">
              <Image
                src={produk?.banner}
                alt={produk?.nama}
                style={{ maxWidth: '70vw' }}
              />
            </div>
            <div className="col-span-12 md:col-span-7 lg:col-span-8 relative">
              <h1 className="text-2xl md:text-3xl font-bold mb-2">{produk?.nama}</h1>
              <p className="text-gray-400 text-xs">
                Terjual {produk?.jumlah_terjual} <SmallDashOutlined /> Dilihat{' '}
                {produk?.jumlah_lihat}x
              </p>
              <p className="flex items-center space-x-3">
                <span className="text-2xl font-bold">
                  {formatCurrency(produk.harga_display)}
                </span>
                {produk.diskon_aktif && (
                  <span className="text-gray-500 line-through">
                    {formatCurrency(produk.harga)}
                  </span>
                )}
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
                    <p className="mb-0 pb-2 last:pb-0 pt-2 first:pt-0 flex items-center justify-between">
                      <span className="text-gray-500">Kategori</span>
                      <Link
                        to={`/kategori/produk/${produk?.kategori.id}`}
                        className="font-bold"
                      >
                        {produk?.kategori.nama}
                      </Link>
                    </p>
                    <p className="mb-0 pb-2 last:pb-0 pt-2 first:pt-0 flex items-center justify-between">
                      <span className="text-gray-500">Marketing</span>
                      <Link
                        to={`/marketing/${produk?.marketing.user_id}`}
                        className="font-bold"
                      >
                        {produk?.marketing.nama}
                      </Link>
                    </p>
                  </div>
                </Tabs.TabPane>
                {produk.is_kecambah && (
                  <Tabs.TabPane tab="Stok" key={'3'}>
                    {produk?.stok?.length === 0 && (
                      <div className="bg-gray-100 p-5 rounded">
                        <Empty
                          description={
                            <>
                              <p className="text-gray-500">Tidak ada stok tersedia</p>
                            </>
                          }
                        />
                      </div>
                    )}
                    {produk.stok?.length > 0 && (
                      <Calendar
                        mode="month"
                        dateCellRender={(current) => {
                          for (const stok of produk.stok) {
                            if (current.isSame(moment(stok.available_at), 'day')) {
                              return (
                                <ul className="list-stok">
                                  <li>
                                    {stok.jumlah > 0 ? (
                                      <>
                                        {moment(stok.available_at).isBefore(
                                          moment(),
                                          'day',
                                        ) ? (
                                          <span className="text-gray-400 text-xl">
                                            {stok.jumlah}
                                          </span>
                                        ) : (
                                          <Tooltip
                                            title={`Tersedia ${stok.jumlah} ${produk.unit}`}
                                          >
                                            <Badge
                                              status={'success'}
                                              text={
                                                <span className="text-green-700 text-xl">
                                                  {stok.jumlah}
                                                </span>
                                              }
                                            />
                                          </Tooltip>
                                        )}
                                      </>
                                    ) : (
                                      <Badge
                                        status={'error'}
                                        text={
                                          <span className="text-red-700 text-xl">
                                            Habis
                                          </span>
                                        }
                                      />
                                    )}
                                  </li>
                                </ul>
                              );
                            }
                          }
                        }}
                        disabledDate={(current) => {
                          for (const stok of produk.stok) {
                            if (current.isSame(moment(stok.available_at), 'day')) {
                              if (moment(stok.available_at).isBefore(moment(), 'day')) {
                                return true;
                              }
                              return false;
                            }
                          }

                          return true;
                        }}
                      />
                    )}
                  </Tabs.TabPane>
                )}
                <Tabs.TabPane tab="Diskon" key="4">
                  {!produk.diskon_aktif && (
                    <div className="bg-gray-100 p-5 rounded">
                      <Empty
                        description={
                          <p className="text-gray-500">Tidak ada diskon tersedia</p>
                        }
                      />
                    </div>
                  )}
                  {produk.diskon_aktif && (
                    <div className="flex items-center space-x-5 justify-between px-5 py-3 rounded border">
                      <div className="flex-grow">
                        <small className="font-semibold">Nilai</small>
                        <p className="leading-tight">
                          {produk.diskon_aktif.tipe_diskon === 'NOMINAL'
                            ? formatCurrency(produk.diskon_aktif.nilai)
                            : `${produk.diskon_aktif.nilai}%`}
                        </p>
                        <small className="font-semibold">Masa berlaku</small>
                        <p className="leading-tight mb-0">
                          {moment(produk.diskon_aktif.dimulai_pada).format('DD MMM yyyy')}{' '}
                          s/d{' '}
                          {moment(produk.diskon_aktif.berakhir_pada).format(
                            'DD MMM yyyy',
                          )}
                        </p>
                      </div>
                    </div>
                  )}
                </Tabs.TabPane>
              </Tabs>
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
              <div className="bg-gray-100 p-5 rounded">
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
