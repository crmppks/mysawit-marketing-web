import ReviewComponent from '@/components/ReviewComponent';
import { confirmAlert } from '@/helpers/swal_helper';
import {
  deleteProduk,
  getDetailProdukWithStok,
  getRatingProduk,
  getUlasanProduk,
  putUpdateActivateProduk,
  putUpdateDeactivateProduk,
} from '@/services/produk';
import Paging from '@/types/Paging';
import Produk from '@/types/Produk';
import UlasanProduk from '@/types/UlasanProduk';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  StarFilled,
} from '@ant-design/icons';
import {
  Alert,
  Badge,
  Dropdown,
  Empty,
  Image,
  Menu,
  message,
  PageHeader,
  Pagination,
  Progress,
  Rate,
  Skeleton,
  Tabs,
} from 'antd';
import { AxiosResponse } from 'axios';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

export default function HalamanDetailProduk() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [onAction, setOnAction] = useState<boolean>(false);
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

  const handleActivateProduk = () => {
    setOnAction(true);
    putUpdateActivateProduk(id as string).then(() => {
      message.success(`Produk ${produk?.nama} di aktifkan`);
      setProduk((old) => ({ ...old!, is_active: true }));
    });
  };

  const handleDeactivateProduk = () => {
    setOnAction(true);
    putUpdateDeactivateProduk(id as string).then(() => {
      message.warning(`Produk ${produk?.nama} di non-aktifkan`);
      setProduk((old) => ({ ...old!, is_active: false }));
    });
  };

  const handleHapus = () => {
    confirmAlert(
      'Hapus Produk',
      <>
        Apakah anda yakin untuk menghapus produk <b>{produk?.nama}</b>?
      </>,
    ).then((willDelete: boolean) => {
      if (willDelete) {
        setOnAction(true);
        deleteProduk(id as string)
          .then(() => {
            message.success('Produk berhasil dihapus');
            navigate('/produk');
          })
          .finally(() => setOnAction(false));
      }
    });
  };

  useEffect(() => {
    // setLoading(true);
    getDetailProdukWithStok(id as string)
      .then(({ data }: AxiosResponse<any>) => setProduk(data))
      .finally(() => setLoading(false));

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
      <section className="p-5">
        <div className="space-y-2 mb-10">
          {!produk?.is_active && (
            <Alert
              message={
                <p className="m-0">
                  Konsumen tidak akan dapat melakukan pemesanan atas produk ini
                  dikarenakan <b>sedang dalam status non-aktif</b>
                </p>
              }
              type="warning"
              showIcon
            />
          )}
          {produk?.stok?.length === 0 && (
            <Alert
              message={
                <p className="m-0">
                  Konsumen tidak akan dapat melakukan pemesanan atas produk ini
                  dikarenakan <b>tidak ada stok tersedia</b>
                </p>
              }
              type="warning"
              showIcon
            />
          )}
        </div>
        <div className="grid grid-cols-12 gap-5">
          <div className="col-span-12 md:col-span-3">
            <Image
              src={produk?.banner}
              alt={produk?.nama}
              className="rounded border border-white w-full md:max-w-full"
            />
          </div>
          <div className="col-span-12 md:col-span-9 relative">
            <h1 className="font-bold text-xl md:text-2xl">{produk?.nama}</h1>
            <Dropdown
              overlay={
                <Menu>
                  <Menu.Item icon={<EditOutlined />}>
                    <Link to={`edit`}>Perbaharui</Link>
                  </Menu.Item>
                  <Menu.Item icon={<EditOutlined />}>
                    <Link to={`stok`}>Perbaharui Stok</Link>
                  </Menu.Item>
                  {produk?.is_active && (
                    <Menu.Item danger icon={<CloseCircleOutlined />}>
                      <button onClick={handleDeactivateProduk}>Deaktivasi Produk</button>
                    </Menu.Item>
                  )}
                  {!produk?.is_active && (
                    <Menu.Item icon={<CheckCircleOutlined />}>
                      <button onClick={handleActivateProduk}>Aktivasi Produk</button>
                    </Menu.Item>
                  )}
                  <Menu.Item danger icon={<DeleteOutlined />}>
                    <button onClick={handleHapus}>Hapus Produk</button>
                  </Menu.Item>
                </Menu>
              }
              placement="bottomRight"
              arrow
            >
              <button
                disabled={onAction}
                className="absolute right-0 top-0 p-2 border rounded bg-white disabled:bg-gray-400 disabled:text-gray-600"
              >
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

            <div className="mt-5 space-x-5 flex items-center">
              <p>
                <span>Kategori</span>
                <br />
                <Link
                  to={`/kategori/produk/${produk?.kategori.id}`}
                  className="font-bold"
                >
                  {produk?.kategori.nama}
                </Link>
              </p>
              <p>
                <span>Marketing</span>
                <br />
                <Link
                  to={`/marketing/${produk?.marketing.user_id}`}
                  className="font-bold"
                >
                  {produk?.marketing.nama}
                </Link>
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-col md:flex-row md:space-x-10 mt-3 rounded bg-white p-5">
          <div className="flex-none">
            <p className="flex items-end">
              <span className="text-7xl md:text-8xl leading-tight">{produk?.nilai}</span>
              <span>/ 5</span>
            </p>
            <Rate disabled allowHalf defaultValue={produk?.nilai} />
          </div>
          <div className="flex-grow">
            {rating.list.map((item) => (
              <div key={`rating_${item.rating}`} className="flex items-center">
                <StarFilled className="text-lg" />
                <b className="mr-5 ml-1 text-gray-500">{item.rating}</b>
                <Progress percent={(item.total / rating.max) * 100} showInfo={false} />
                <span className="mr-5 ml-1 text-lg">{item.total}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-3 px-5 pb-5 rounded border bg-white">
          <Tabs defaultActiveKey="1">
            <Tabs.TabPane tab={<b className="text-lg">Informasi</b>} key="1">
              <div className="space-y-1">
                <div>
                  <span className="text-gray-400">Harga</span>
                  <p className="leading-tight text-lg">{produk?.harga_diff}</p>
                </div>
                <div>
                  <span className="text-gray-400">Berat</span>
                  <p className="leading-tight text-lg">
                    {produk?.berat} gram / {produk?.unit}
                  </p>
                </div>
                <div>
                  <span className="text-gray-400">Jumlah Terjual</span>
                  <p className="leading-tight text-lg">
                    {produk?.jumlah_terjual} {produk?.unit}
                  </p>
                </div>
                <div>
                  <span className="text-gray-400">Jumlah Lihat</span>
                  <p className="leading-tight text-lg">{produk?.jumlah_lihat} kali</p>
                </div>
                <div>
                  <span className="text-gray-400">Dibuat Pada</span>
                  <p className="leading-tight text-lg">
                    {moment(produk?.created_at).format('DD MMMM yyyy, HH:mm')}
                  </p>
                </div>
                {produk?.updated_at !== produk?.created_at && (
                  <div>
                    <span className="text-gray-400">Diperbaharui Pada</span>
                    <p className="leading-tight text-lg">
                      {moment(produk?.updated_at).format('DD MMMM yyyy, HH:mm')}
                    </p>
                  </div>
                )}
              </div>
            </Tabs.TabPane>
            <Tabs.TabPane tab={<b className="text-lg">Deskripsi</b>} key="2">
              <div
                dangerouslySetInnerHTML={{ __html: produk?.deskripsi as string }}
              ></div>
            </Tabs.TabPane>
            <Tabs.TabPane tab={<b className="text-lg">Stok</b>} key="3">
              <div className="space-y-5">
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
              </div>
            </Tabs.TabPane>
            <Tabs.TabPane
              tab={
                <Badge offset={[10, 5]} count={ulasan.total}>
                  <b className="text-lg">Ulasan</b>
                </Badge>
              }
              key="4"
            >
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
            </Tabs.TabPane>
          </Tabs>
        </div>
      </section>
    </>
  );
}
