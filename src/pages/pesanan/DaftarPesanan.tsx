import {
  Tabs,
  Skeleton,
  Empty,
  Button,
  Pagination,
  Dropdown,
  Menu,
  Input,
  DatePicker,
} from 'antd';
import { useCallback, useEffect, useState } from 'react';
import Paging from '@/types/Paging';
import moment from 'moment';
import { CheckCircleFilled, InfoCircleOutlined, MoreOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { getOrderInsight, getPesananByKategori } from '@/services/pesanan';
import Pesanan from '@/types/Pesanan';
import { formatCurrency } from '@/helpers/order_helper';
import { Link } from 'react-router-dom';
import ModalKonfirmasiVerifikasiPersyaratan from '@/components/ModalKonfirmasiVerifikasiPersyaratanComponent';
import DaftarProdukPesanan from '@/components/DaftarProdukPesananComponent';
import lodash from 'lodash';
import { webixTableParams } from '@/helpers/webix_helper';

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

  const [loading, setLoading] = useState<boolean>(true);
  const [categories, setCategories] = useState<Array<OrderInsight>>([]);
  const [filter, setFilter] = useState<any>(null);
  const [selectedPesananKonfirmasi, setSelectedPesananKonfirmasi] =
    useState<Pesanan>(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debounceInput = useCallback(
    lodash.debounce((name: string, value: string) => {
      setFilter((old) => ({
        ...old,
        [name]: value,
      }));
    }, 500),
    [],
  );

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

    getPesananByKategori(category, page, webixTableParams({ filter })).then(
      ({ data: data2 }) =>
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

  const handleConfirmVerification = (old_pesanan: Pesanan, new_pesanan: Pesanan) => {
    setCategories((old) =>
      old.map((item) => {
        if (item.code === new_pesanan.status) {
          return {
            ...item,
            loading: true,
            total: item.total + 1,
          };
        }
        if (item.code === old_pesanan.status) {
          return {
            ...item,
            total: item.total - 1,
            data: {
              ...item.data,
              data: item.data.data.filter((pesanan) => pesanan.id !== old_pesanan.id),
            },
          };
        }
        return item;
      }),
    );

    setSelectedPesananKonfirmasi(null);

    getPesananByKategori(new_pesanan.status).then(({ data: data2 }) =>
      setCategories((old) =>
        old.map((item) => {
          if (item.code !== new_pesanan.status) return item;
          return {
            ...item,
            data: data2,
            loading: false,
            total: data2.total,
          };
        }),
      ),
    );
  };

  useEffect(() => {
    setLoading(true);
    getOrderInsight().then(({ data }) => {
      setLoading(false);
      setCategories(data.map((item) => ({ ...item, loading: true, data: [] })));

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
  }, [dispatch]);

  useEffect(() => {
    if (filter) {
      setCategories((old) => old.map((item) => ({ ...item, loading: true })));

      for (const category of categories) {
        getPesananByKategori(
          category.code,
          1,
          webixTableParams({
            filter,
          }),
        ).then(({ data: data2 }) =>
          setCategories((old) =>
            old.map((item) => {
              if (item.code !== category.code) return item;
              return {
                ...item,
                data: data2,
                loading: false,
                total: data2.total,
              };
            }),
          ),
        );
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  return (
    <section className="p-5">
      <div className="mb-5 grid grid-cols-12 gap-5">
        <div className="col-span-6 md:col-span-3">
          <DatePicker.RangePicker
            onChange={(values) =>
              setFilter((old) => ({
                ...old,
                rentang_waktu_pesanan: values
                  ? values.map((item) => item.format('yyyy-MM-DD'))
                  : [],
              }))
            }
            size="large"
            className="w-full"
          />
        </div>
        <div className="col-span-6 md:col-span-3">
          <Input
            onChange={(e) => debounceInput('id_pesanan', e.target.value)}
            allowClear
            size="large"
            placeholder="ID Pesanan"
            className="w-full"
          />
        </div>
        <div className="col-span-12 md:col-span-6">
          <Input
            onChange={(e) => debounceInput('nama_konsumen', e.target.value)}
            allowClear
            size="large"
            placeholder="Nama Konsumen"
            className="w-full"
          />
        </div>
      </div>
      {loading && <Skeleton active />}
      {!loading && (
        <>
          <ModalKonfirmasiVerifikasiPersyaratan
            visible={!!selectedPesananKonfirmasi}
            pesanan={selectedPesananKonfirmasi}
            onCancel={() => setSelectedPesananKonfirmasi(null)}
            onFinishConfirmation={(p) => {
              handleConfirmVerification(selectedPesananKonfirmasi, p);
            }}
          />
          <Tabs>
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
                              <div className="flex justify-between space-x-5 mb-5">
                                <div className="flex space-x-3 items-center">
                                  <img
                                    src={pesanan.konsumen.avatar}
                                    alt={pesanan.konsumen.nama}
                                    className="w-9 rounded-full shadow"
                                  />
                                  <Link
                                    to={`/konsumen/${pesanan.konsumen_id}`}
                                    className="font-bold text-lg"
                                  >
                                    {pesanan.konsumen?.nama}
                                  </Link>
                                </div>

                                <span>
                                  {moment(new Date(pesanan.created_at)).format(
                                    'dddd DD MMMM yyyy, HH:mm',
                                  )}
                                </span>
                              </div>
                              <DaftarProdukPesanan pesanan={pesanan} showHeader={false} />
                              {pesanan.informasi_pengiriman?.courier_service && (
                                <div className="flex items-center justify-between border-t pt-5">
                                  <div className="flex flex-col">
                                    <span className="font-bold">
                                      {pesanan.informasi_pengiriman.courier.name}
                                    </span>
                                    <span>
                                      {
                                        pesanan.informasi_pengiriman.courier_service
                                          .service
                                      }
                                    </span>
                                  </div>
                                  <span>
                                    {formatCurrency(
                                      pesanan.informasi_pengiriman.courier_service.cost
                                        .value,
                                    )}
                                  </span>
                                </div>
                              )}
                              <div className="flex justify-between space-x-5 border-t py-1 -mx-10 px-10">
                                <div className="flex items-center space-x-2">
                                  {pesanan.status === 'VERIFIKASI_PERSYARATAN' && (
                                    <Button
                                      icon={<CheckCircleFilled />}
                                      disabled={!pesanan.persyaratan}
                                      onClick={() =>
                                        setSelectedPesananKonfirmasi(pesanan)
                                      }
                                      type={`primary`}
                                    >
                                      Konfirmasi Verifikasi
                                    </Button>
                                  )}
                                  {pesanan.status !== 'VERIFIKASI_PERSYARATAN' && (
                                    <Link to={`/pesanan/${pesanan.id}`}>
                                      <Button
                                        icon={<InfoCircleOutlined />}
                                        type="primary"
                                      >
                                        Detail Pesanan
                                      </Button>
                                    </Link>
                                  )}

                                  {['VERIFIKASI_PERSYARATAN', 'SELESAI'].includes(
                                    pesanan.status,
                                  ) && (
                                    <Dropdown
                                      overlay={
                                        <Menu>
                                          {pesanan.status ===
                                            'VERIFIKASI_PERSYARATAN' && (
                                            <Menu.Item icon={<InfoCircleOutlined />}>
                                              <Link to={`/pesanan/${pesanan.id}`}>
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
                                    {formatCurrency(
                                      pesanan.informasi_harga.harga_total_bayar,
                                    )}
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
        </>
      )}
    </section>
  );
}
