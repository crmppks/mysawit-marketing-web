import { Tabs, Skeleton, Empty, Button, Pagination, Dropdown, Menu } from 'antd';
import { useEffect, useState } from 'react';
import Paging from '@/types/Paging';
import moment from 'moment';
import { InfoCircleOutlined, MoreOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { getOrderInsight, getPesananByKategori } from '@/services/pesanan';
import Pesanan from '@/types/Pesanan';
import { formatCurrency } from '@/helpers/order_helper';
import { Link } from 'react-router-dom';

type OrderInsight = {
  code:
    | 'VERIFIKASI_PERSYARATAN'
    | 'MENUNGGU_PEMBAYARAN'
    | 'DIKEMAS'
    | 'DIKIRIM'
    | 'SELESAI'
    | 'DIBATALKAN';
  title: string;
  total: number;
  loading: boolean;
  data: Paging<Pesanan>;
};

export default function HalamanDaftarPesanan() {
  const dispatch = useDispatch();

  const [activeTab, setActiveTab] = useState<string>('VERIFIKASI_PERSYARATAN');
  const [loading, setLoading] = useState<boolean>(true);
  const [categories, setCategories] = useState<Array<OrderInsight>>([]);

  const handlePageChange = (category: string, page: number) => {
    setCategories((old) =>
      old.map((item) => {
        if (item.code !== category) return item;
        return {
          ...item,
          loading: true,
        };
      }),
    );

    getPesananByKategori(category, page).then(({ data: data2 }) =>
      setCategories((old) =>
        old.map((item) => {
          if (item.code !== category) return item;
          return {
            ...item,
            data: data2,
            loading: false,
          };
        }),
      ),
    );
  };

  useEffect(() => {
    setLoading(true);
    getOrderInsight().then(({ data }) => {
      setCategories(data.map((item) => ({ ...item, loading: true, data: [] })));
      setLoading(false);

      for (const category of data) {
        getPesananByKategori(category.code).then(({ data: data2 }) =>
          setCategories((old) =>
            old.map((item) => {
              if (item.code !== category.code) return item;
              return {
                ...item,
                data: data2,
                loading: false,
              };
            }),
          ),
        );
      }
    });
    // dispatch(getUserOrderInsightAction());
  }, [dispatch]);

  return (
    <section className="p-5">
      {loading && <Skeleton active />}
      {!loading && (
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          {categories.map((cat) => (
            <Tabs.TabPane
              key={cat.code}
              tab={
                <span className={cat.total > 0 ? 'font-bold' : ''}>
                  {cat.title} {cat.total > 0 ? `(${cat.total})` : ''}
                </span>
              }
            >
              {cat.loading && <Skeleton active />}

              {!cat.loading && (
                <>
                  {cat.data.data.length === 0 && (
                    <div className="border border-dashed p-5 mt-5 bg-white rounded">
                      <Empty
                        className="mt-10"
                        description={
                          <div className="flex flex-col items-center justify-center">
                            <p className="text-gray-400">Belum ada pesanan tersedia</p>
                          </div>
                        }
                      />
                    </div>
                  )}

                  {cat.data.data.length > 0 && (
                    <>
                      <div className="space-y-3">
                        {cat.data.data.map((pesanan) => (
                          <div
                            key={pesanan.id}
                            className="px-5 pt-5 border bg-white rounded space-y-5"
                          >
                            <p className="text-right">
                              {moment(new Date(pesanan.created_at)).format(
                                'dddd DD MMMM yyyy, HH:mm',
                              )}
                            </p>
                            {pesanan.items.map((produk) => (
                              <div key={produk.id} className="flex-grow flex space-x-3">
                                <div className="flex-none w-24">
                                  <img
                                    alt={produk.nama}
                                    src={produk.banner}
                                    className="rounded"
                                  />
                                </div>

                                <div className="flex-grow">
                                  <span>{produk.kategori.nama}</span>
                                  <h4 className="mb-0 text-lg mt-0 leading-tight">
                                    <Link to={`/produk/${produk.id}`}>{produk.nama}</Link>
                                  </h4>
                                  <div className="flex justify-between m-0">
                                    <span className="text-gray-500">
                                      {`${produk.order_quantity} x ${formatCurrency(
                                        produk.order_item_price,
                                      )}`}
                                    </span>

                                    <p className="flex flex-col items-end">
                                      <span className="text-gray-500 text-xs">
                                        Total Harga
                                      </span>
                                      <b>
                                        {formatCurrency(
                                          produk.order_item_price * produk.order_quantity,
                                        )}
                                      </b>
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ))}
                            {pesanan.informasi?.courier_service && (
                              <div className="flex items-center justify-between border-t pt-5">
                                <div className="flex flex-col">
                                  <span className="font-bold">
                                    {pesanan.informasi.courier.name}
                                  </span>
                                  <span>{pesanan.informasi.courier_service.service}</span>
                                </div>
                                <span>
                                  {formatCurrency(
                                    pesanan.informasi.courier_service.cost.value,
                                  )}
                                </span>
                              </div>
                            )}
                            <div className="flex justify-between space-x-5 border-t py-1 -mx-10 px-10">
                              <div className="flex items-center space-x-2">
                                {cat.code !== 'VERIFIKASI_PERSYARATAN' && (
                                  <Link to={`/pesanan/detail/${pesanan.id}`}>
                                    <Button icon={<InfoCircleOutlined />} type="primary">
                                      Detail Pesanan
                                    </Button>
                                  </Link>
                                )}

                                {[
                                  'VERIFIKASI_PERSYARATAN',
                                  'MENUNGGU_PEMBAYARAN',
                                  'DIKIRIM',
                                ].includes(cat.code) && (
                                  <Dropdown
                                    overlay={
                                      <Menu>
                                        {cat.code === 'VERIFIKASI_PERSYARATAN' && (
                                          <Menu.Item icon={<InfoCircleOutlined />}>
                                            <Link to={`/pesanan/detail/${pesanan.id}`}>
                                              Detail Pesanan
                                            </Link>
                                          </Menu.Item>
                                        )}
                                      </Menu>
                                    }
                                    placement="topRight"
                                    arrow
                                  >
                                    <Button icon={<MoreOutlined />}></Button>
                                  </Dropdown>
                                )}
                              </div>
                              <div className="flex flex-col items-end">
                                <span className="text-gray-500">Total Belanja</span>
                                <b className="font-bold text-xl mb-0">
                                  {formatCurrency(pesanan.total_bayar)}
                                </b>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-center mt-10">
                        <Pagination
                          onChange={(page) => handlePageChange(cat.code, page)}
                          pageSize={cat.data.per_page}
                          current={cat.data.current_page}
                          total={cat.data.total}
                        />
                      </div>
                    </>
                  )}
                </>
              )}
            </Tabs.TabPane>
          ))}
        </Tabs>
      )}
    </section>
  );
}
