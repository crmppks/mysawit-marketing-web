import 'webix/webix.css';
import { formatCurrency } from '@/helpers/order_helper';
import { webixTableParams } from '@/helpers/webix_helper';
import {
  getChartPenjualanKategori,
  getChartPenjualanProduk,
  getExportReportPenjualanProduk,
  getReportPenjualanProduk,
} from '@/services/report';
import { Column } from '@ant-design/charts';
import { DownloadOutlined, LoadingOutlined } from '@ant-design/icons';
import { Button, DatePicker, Empty, PageHeader, Pagination } from 'antd';
import moment from 'moment';
import * as webix from '@xbs/webix-pro';
import { useEffect, useRef, useState } from 'react';

export default function HalamanMonthlyReport() {
  const webixTableRef = useRef<any>();
  const uiTable = useRef<any>();
  const [reportPage, setReportPage] = useState<{
    current: number;
    last: number;
    total: number;
    per_page: number;
  }>({ current: 1, last: 1, total: 1, per_page: 15 });

  const [filterLaporan, setFilterLaporan] = useState<{
    loading: boolean;
    value: string;
  }>({
    loading: true,
    value: moment().format('yyyy-MM'),
  });
  const [dataPenjualanProduk, setDataPenjualanProduk] = useState<Array<any>>([]);
  const [filterPenjualanProduk, setFilterPenjualanProduk] = useState<{
    loading: boolean;
    value: string;
  }>({
    loading: true,
    value: moment().format('yyyy-MM'),
  });

  const [dataPenjualanKategori, setDataPenjualanKategori] = useState<Array<any>>([]);
  const [filterPenjualanKategori, setFilterPenjualanKategori] = useState<{
    loading: boolean;
    value: string;
  }>({
    loading: true,
    value: moment().format('yyyy-MM'),
  });

  useEffect(() => {
    setFilterPenjualanProduk((old) => ({ ...old, loading: true }));
    getChartPenjualanProduk('monthly', filterPenjualanProduk.value)
      .then(({ data }) => setDataPenjualanProduk(data))
      .finally(() => setFilterPenjualanProduk((old) => ({ ...old, loading: false })));
  }, [filterPenjualanProduk.value]);

  useEffect(() => {
    setFilterPenjualanKategori((old) => ({ ...old, loading: true }));
    getChartPenjualanKategori('monthly', filterPenjualanKategori.value)
      .then(({ data }) => setDataPenjualanKategori(data))
      .finally(() => setFilterPenjualanKategori((old) => ({ ...old, loading: false })));
  }, [filterPenjualanKategori.value]);

  useEffect(() => {
    uiTable.current = webix.ui(
      {
        rows: [
          {
            view: 'datatable',
            columns: [
              {
                id: 'nama_nasabah',
                header: [{ text: 'Nama Nasabah' }],
                minWidth: 250,
                resize: true,
              },
              {
                id: 'tgl_register',
                header: [{ text: 'Tanggal Register' }],
                minWidth: 130,
                format: (item) => moment(item).format('DD MMMM yyyy'),
              },
              {
                id: 'kategori',
                header: [{ text: 'Kategori' }],
                minWidth: 150,
              },
              {
                id: 'alamat',
                header: [{ text: 'Alamat' }],
                minWidth: 200,
              },
              {
                id: 'no_telp',
                header: [{ text: 'No. Telepon' }],
                minWidth: 150,
              },
              {
                id: 'email',
                header: [{ text: 'Email' }],
                minWidth: 200,
              },
              {
                id: 'pic',
                header: [{ text: 'PIC' }],
                minWidth: 200,
              },
              {
                id: 'marketing',
                header: [{ text: 'Marketing' }],
                minWidth: 200,
              },
              {
                id: 'tgl_transaksi',
                header: [{ text: 'Tgl Transaksi' }],
                minWidth: 130,
                format: (item) => moment(item).format('DD MMMM yyyy'),
              },
              {
                id: 'produk',
                header: [{ text: 'Produk' }],
                minWidth: 200,
              },
              {
                id: 'jumlah_produk',
                header: [{ text: 'Jumlah Produk' }],
                minWidth: 100,
              },
              {
                id: 'total_harga',
                header: [{ text: 'Total Harga' }],
                minWidth: 100,
                format: (item) => formatCurrency(item),
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
                setFilterLaporan((o) => ({ ...o, loading: true }));
                const {
                  data: { data, current_page, last_page, total, per_page },
                } = await getReportPenjualanProduk(
                  webixTableParams(params),
                  reportPage.current,
                  'monthly',
                  filterLaporan.value,
                );

                setReportPage((old) => ({
                  current: params ? old.current : current_page,
                  last: last_page,
                  total,
                  per_page,
                }));
                setFilterLaporan((o) => ({ ...o, loading: false }));

                return await data.reduce((prev, currentItem) => {
                  return [
                    ...prev,
                    ...currentItem.produk.reduce(
                      (prevProdukList, produkList, produkListIndex) => {
                        return [
                          ...prevProdukList,
                          ...produkList.map((produk, produkIndex) => {
                            return {
                              ...currentItem,
                              pic: currentItem.pic[produkListIndex],
                              marketing: currentItem.marketing[produkListIndex],
                              jumlah_produk:
                                currentItem.jumlah_produk[produkListIndex][produkIndex],
                              total_harga:
                                currentItem.total_harga[produkListIndex][produkIndex],
                              produk,
                            };
                          }),
                        ];
                      },
                      [],
                    ),
                  ];
                }, []);
              } catch (e) {
                setFilterLaporan((o) => ({ ...o, loading: false }));
                console.log(e);
                return [];
              }
            },
          },
        ],
      },
      webixTableRef.current,
    );

    return () => {
      uiTable.current.destructor();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reportPage.current, filterLaporan.value]);

  return (
    <>
      <PageHeader title="Monthly Report" subTitle="Halaman laporan penjualan bulanan" />
      <section className="space-y-5">
        <div className="bg-white rounded p-5 relative mx-5 shadow">
          {filterPenjualanProduk.loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50 rounded text-white">
              <LoadingOutlined className="text-5xl" />
            </div>
          )}
          {!filterPenjualanProduk.loading && dataPenjualanProduk.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center ">
              <Empty
                description={
                  <p className="text-gray-400">Tidak ada data untuk ditampilkan</p>
                }
              />
            </div>
          )}
          <div className="flex space-x-5 items-center justify-between mb-10">
            <h2 className="text-lg">Produk</h2>
            <DatePicker
              disabled={filterPenjualanProduk.loading}
              defaultValue={moment()}
              picker="month"
              onChange={(value) => {
                if (!value) return;
                setFilterPenjualanProduk((o) => ({
                  ...o,
                  value: value.format('yyyy-MM'),
                }));
              }}
            />
          </div>
          <Column
            data={dataPenjualanProduk}
            isStack
            xField="produk"
            yField="value"
            seriesField="status"
            label={{ position: 'middle' }}
            interactions={[
              {
                type: 'active-region',
                enable: false,
              },
            ]}
            columnBackground={{ style: { fill: 'rgba(0,0,0,0.1)' } }}
          />
        </div>
        <div className="bg-white rounded p-5 relative mx-5 shadow">
          {filterPenjualanKategori.loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50 rounded text-white">
              <LoadingOutlined className="text-5xl" />
            </div>
          )}
          {!filterPenjualanKategori.loading && dataPenjualanKategori.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center ">
              <Empty
                description={
                  <p className="text-gray-400">Tidak ada data untuk ditampilkan</p>
                }
              />
            </div>
          )}
          <div className="flex space-x-5 items-center justify-between mb-10">
            <h2 className="text-lg">Kategori</h2>
            <DatePicker
              disabled={filterPenjualanKategori.loading}
              defaultValue={moment()}
              picker="month"
              onChange={(value) => {
                if (!value) return;
                setFilterPenjualanKategori((o) => ({
                  ...o,
                  value: value.format('yyyy-MM'),
                }));
              }}
            />
          </div>
          <Column
            data={dataPenjualanKategori}
            isStack
            xField="kategori"
            yField="value"
            seriesField="status"
            label={{ position: 'middle' }}
            interactions={[
              {
                type: 'active-region',
                enable: false,
              },
            ]}
            columnBackground={{ style: { fill: 'rgba(0,0,0,0.1)' } }}
          />
        </div>
        <div className="flex justify-between px-5">
          <Pagination
            onChange={(current) => setReportPage((old) => ({ ...old, current }))}
            defaultCurrent={reportPage.current}
            total={reportPage.total}
            pageSize={reportPage.per_page}
            showSizeChanger={false}
          />
          <div className="flex space-x-3">
            <Button
              type="primary"
              target="_blank"
              href={getExportReportPenjualanProduk('monthly', filterLaporan.value)}
              icon={<DownloadOutlined />}
            >
              Unduh Laporan
            </Button>
            <DatePicker
              disabled={filterLaporan.loading}
              defaultValue={moment()}
              picker="month"
              onChange={(value) => {
                if (!value) return;
                setFilterLaporan((o) => ({
                  ...o,
                  value: value.format('yyyy-MM'),
                }));
              }}
            />
          </div>
        </div>
        <div ref={webixTableRef}></div>
      </section>
    </>
  );
}
