/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import { Skeleton, Steps, Button } from 'antd';
import { getDetailPesanan } from '@/services/pesanan';
import Pesanan from '@/types/Pesanan';
import { AxiosResponse } from 'axios';
import moment from 'moment';
import { formatCurrency } from '@/helpers/order_helper';
import {
  CheckCircleFilled,
  ClockCircleFilled,
  ClockCircleOutlined,
  CloseCircleFilled,
  InfoCircleOutlined,
  LinkOutlined,
} from '@ant-design/icons';
import { capitalize } from 'lodash';
import { Link, useNavigate, useParams } from 'react-router-dom';
import ModalKonfirmasiVerifikasiPersyaratan from '@/components/ModalKonfirmasiVerifikasiPersyaratanComponent';
import { handleCopy } from '@/helpers/string_helper';
import ModalKonfirmasiPengiriman from '@/components/ModalKonfirmasiPengirimanComponent';
import DaftarProdukPesanan from '@/components/DaftarProdukPesananComponent';

const Row = ({ children, className = '' }: any) => (
  <div
    className={`flex flex-col md:flex-row md:items-center md:justify-between space-y-0 md:space-x-5 ${className}`}
  >
    {children}
  </div>
);

export default function HalamanDetailPesanan() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState<boolean>(true);
  const [pesanan, setPesanan] = useState<Pesanan>(null);
  const [stepsPosition, setStepsPosition] = useState<number>(0);
  const [showModalKonfirmasi, setShowModalKonfirmasi] = useState<boolean>(false);
  const [showModalAturPengiriman, setShowModalAturPengiriman] = useState<boolean>(false);

  const handleLoadData = () => {
    setLoading(true);
    getDetailPesanan(id).then(({ data }: AxiosResponse<Pesanan>) => {
      const has_verifikasi_persyaratan = data.riwayat.find(
        (i) => i.status === 'VERIFIKASI_PERSYARATAN',
      );
      setPesanan(data);
      setLoading(false);
      if (data.status === 'DIBATALKAN') {
        setStepsPosition(1);
      } else {
        if (data.riwayat.find((i) => i.status === 'SELESAI'))
          setStepsPosition(has_verifikasi_persyaratan ? 4 : 3);
        else if (data.riwayat.find((i) => i.status === 'DIKIRIM'))
          setStepsPosition(has_verifikasi_persyaratan ? 3 : 2);
        else if (data.riwayat.find((i) => i.status === 'DIKEMAS'))
          setStepsPosition(has_verifikasi_persyaratan ? 2 : 1);
        else if (data.riwayat.find((i) => i.status === 'MENUNGGU_PEMBAYARAN'))
          setStepsPosition(has_verifikasi_persyaratan ? 1 : 0);
        else setStepsPosition(0);
      }
    });
  };

  useEffect(() => {
    handleLoadData();
  }, [id]);

  return (
    <section className="px-5 py-5 pt-10">
      {loading && <Skeleton active />}
      {!loading && (
        <>
          {pesanan.status === 'VERIFIKASI_PERSYARATAN' && pesanan.persyaratan && (
            <ModalKonfirmasiVerifikasiPersyaratan
              visible={showModalKonfirmasi}
              pesanan={pesanan}
              onCancel={() => setShowModalKonfirmasi(false)}
              onFinishConfirmation={(p) => {
                setShowModalKonfirmasi(false);
                handleLoadData();
              }}
            />
          )}
          {['DIKEMAS', 'DIKIRIM'].includes(pesanan.status) && (
            <ModalKonfirmasiPengiriman
              visible={showModalAturPengiriman}
              pesanan={pesanan}
              onFinish={(p) => {
                setShowModalAturPengiriman(false);
                handleLoadData();
              }}
              onCancel={() => setShowModalAturPengiriman(false)}
            />
          )}
          <Steps
            current={stepsPosition}
            status={pesanan.status === 'DIBATALKAN' ? 'error' : 'process'}
          >
            {pesanan.riwayat.find((i) => i.status === 'VERIFIKASI_PERSYARATAN') && (
              <Steps.Step
                title="Verifikasi Persyaratan"
                description={moment(new Date(pesanan.created_at)).format(
                  'DD-MMM-yyyy HH:mm',
                )}
              />
            )}
            {pesanan.status === 'DIBATALKAN' &&
              pesanan.riwayat.find((i) => i.status === 'VERIFIKASI_PERSYARATAN') && (
                <Steps.Step
                  title="Dibatalkan"
                  description={moment(
                    new Date(
                      pesanan.riwayat.find((i) => i.status === 'DIBATALKAN').created_at,
                    ),
                  ).format('DD-MMM-yyyy HH:mm')}
                />
              )}
            <Steps.Step
              title="Menunggu Pembayaran"
              description={
                pesanan.riwayat.find((i) => i.status === 'MENUNGGU_PEMBAYARAN')
                  ? moment(
                      new Date(
                        pesanan.riwayat.find(
                          (i) => i.status === 'MENUNGGU_PEMBAYARAN',
                        ).created_at,
                      ),
                    ).format('DD-MMM-yyyy HH:mm')
                  : '-'
              }
            />
            {pesanan.status === 'DIBATALKAN' &&
              !pesanan.riwayat.find((i) => i.status === 'VERIFIKASI_PERSYARATAN') && (
                <Steps.Step
                  title="Dibatalkan"
                  description={moment(
                    new Date(
                      pesanan.riwayat.find((i) => i.status === 'DIBATALKAN').created_at,
                    ),
                  ).format('DD-MMM-yyyy HH:mm')}
                />
              )}

            {pesanan.status !== 'DIBATALKAN' && (
              <>
                <Steps.Step
                  title="Dikemas"
                  description={
                    pesanan.riwayat.find((i) => i.status === 'DIKEMAS')
                      ? moment(
                          new Date(
                            pesanan.riwayat.find(
                              (i) => i.status === 'DIKEMAS',
                            ).created_at,
                          ),
                        ).format('DD-MMM-yyyy HH:mm')
                      : '-'
                  }
                />
                <Steps.Step
                  title="Dikirim"
                  description={
                    pesanan.riwayat.find((i) => i.status === 'DIKIRIM')
                      ? moment(
                          new Date(
                            pesanan.riwayat.find(
                              (i) => i.status === 'DIKIRIM',
                            ).created_at,
                          ),
                        ).format('DD-MMM-yyyy HH:mm')
                      : '-'
                  }
                />
                <Steps.Step
                  title="Selesai"
                  description={
                    pesanan.riwayat.find((i) => i.status === 'SELESAI')
                      ? moment(
                          new Date(
                            pesanan.riwayat.find(
                              (i) => i.status === 'SELESAI',
                            ).created_at,
                          ),
                        ).format('DD-MMM-yyyy HH:mm')
                      : '-'
                  }
                />
              </>
            )}
          </Steps>
          <section className="mt-10 grid grid-cols-12 gap-5">
            <div className="col-span-12 lg:col-span-8 space-y-2">
              <div className="bg-white p-5 space-y-1 rounded">
                <h4
                  className={`font-bold text-lg border-b border-dashed pb-3 ${
                    pesanan.status === 'DIBATALKAN' ? 'text-red-500' : 'text-color-theme'
                  }`}
                >
                  {pesanan.status_diff}
                </h4>

                <Row>
                  <span>Konsumen</span>
                  <Link className="text-lg" to={`/konsumen/${pesanan.konsumen.user_id}`}>
                    {pesanan.konsumen.nama}
                  </Link>
                </Row>
                <Row>
                  <span>Tanggal Pembelian</span>
                  <span>{moment(pesanan.created_at).format('Do MMMM yyyy, HH:mm')}</span>
                </Row>
              </div>
              {pesanan.persyaratan && (
                <div
                  className={`bg-white p-5 rounded ${
                    pesanan.persyaratan.status === 'LULUS' ? '' : 'border-red-600'
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:justify-between space-y-2 md:space-y-0 md:space-x-5 md:items-center mb-3">
                    <h4 className="font-bold text-lg mb-0">
                      Info Verifikasi Persyaratan
                    </h4>
                    {pesanan.persyaratan.status === 'TIDAK-LULUS' && (
                      <span className="rounded-full px-4 py-[3px] bg-red-600 text-white text-[small]">
                        <CloseCircleFilled /> &nbsp;Tidak Lulus
                      </span>
                    )}
                    {pesanan.persyaratan.status === 'LULUS' && (
                      <span className="rounded-full px-4 py-[3px] bg-green-600 text-white text-[small]">
                        <CheckCircleFilled /> &nbsp;Lulus Verifikasi
                      </span>
                    )}
                    {!pesanan.persyaratan.status && (
                      <span className="rounded-full px-4 py-[3px] bg-color-theme text-white text-[small]">
                        <ClockCircleOutlined /> &nbsp;Menunggu Konfirmasi
                      </span>
                    )}
                  </div>
                  <div className="space-y-2">
                    <div className={`border px-3 py-2 rounded space-y-3`}>
                      <span>Dokumen Surat Lahan</span>
                      <ul className="list-disc list-inside">
                        {pesanan?.persyaratan.dokumen_surat_lahan.map((dok) => (
                          <li key={dok.media_id}>
                            <a target="_blank" href={dok.url} rel="noreferrer">
                              {dok.name} <LinkOutlined />
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className={`border px-3 py-2 rounded space-y-3`}>
                      <span>Dokumen Surat Pernyataan</span>
                      <ul className="list-disc list-inside">
                        {pesanan?.persyaratan.dokumen_surat_pernyataan.map((dok) => (
                          <li key={dok.media_id}>
                            <a target="_blank" href={dok.url} rel="noreferrer">
                              {dok.name} <LinkOutlined />
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className={`border px-3 py-2 rounded space-y-3`}>
                      <span>Dokumen KTP</span>
                      <ul className="list-disc list-inside">
                        {pesanan?.persyaratan.dokumen_ktp.map((dok) => (
                          <li key={dok.media_id}>
                            <a target="_blank" href={dok.url} rel="noreferrer">
                              {dok.name} <LinkOutlined />
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <Row>
                      <span>Alamat Kebun</span>
                      <p className="mb-0 md:text-right md:max-w-[60%]">
                        {pesanan.persyaratan.alamat_lengkap}
                      </p>
                    </Row>
                    {pesanan.persyaratan.status === 'TIDAK-LULUS' && (
                      <>
                        <br />
                        <div className="bg-red-600 px-5 py-3 text-white -mx-5 flex items-center space-x-3">
                          <InfoCircleOutlined />{' '}
                          <p className="mb-0">
                            {pesanan.persyaratan.informasi_penolakan}
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
              <div className={`bg-white p-5 rounded`}>
                <div className="flex flex-col md:flex-row md:justify-between mb-4 space-y-2 md:space-y-0 md:space-x-5">
                  <h4 className="font-bold text-lg mb-0">Info Pengiriman</h4>
                  {pesanan.informasi_pengiriman.duration && (
                    <span className="bg-green-600 px-3 py-[4px] rounded-full text-white text-[small]">
                      <ClockCircleFilled /> &nbsp; Durasi pengiriman{' '}
                      {pesanan.informasi_pengiriman.duration?.estimation}{' '}
                      {pesanan.informasi_pengiriman.duration.estimation_unit.toLowerCase()}
                    </span>
                  )}
                </div>
                <div className="space-y-1">
                  {pesanan.informasi_pengiriman.duration && (
                    <>
                      <div className="px-5 py-2 rounded text-green-600 border border-green-600 flex flex-col md:flex-row md:justify-between">
                        <span>
                          {moment(pesanan.informasi_pengiriman.duration.date_from).format(
                            'dddd, Do MMMM yyyy',
                          )}
                        </span>
                        <span className="hidden md:inline">&rarr;</span>
                        <span className="md:hidden">&darr;</span>
                        <span>
                          {moment(pesanan.informasi_pengiriman.duration.date_to).format(
                            'dddd, Do MMMM yyyy',
                          )}
                        </span>
                      </div>
                      <br />
                    </>
                  )}
                  <Row>
                    <span>No. Resi</span>
                    <span>{pesanan.nomor_resi ?? '-'}</span>
                  </Row>
                  <Row>
                    <span>Catatan</span>
                    <p className="mb-0 text-gray-400 md:text-right max-w-[60%]">
                      {pesanan.catatan ?? '-'}
                    </p>
                  </Row>
                  <hr className="border-dashed my-2" />
                  <Row>
                    <span>Alamat Pengiriman</span>
                    <div className="md:text-right md:max-w-[60%]">
                      <b>{pesanan.informasi_pengiriman.to}</b>
                      <p className="mb-0">
                        {pesanan.informasi_pengiriman.address.no_hp_lengkap}
                      </p>
                      <p className="mb-0">
                        {pesanan.informasi_pengiriman.address.alamat_lengkap}
                      </p>
                    </div>
                  </Row>
                </div>
              </div>

              <div className="p-5 rounded bg-white my-10">
                <DaftarProdukPesanan showHeader={false} pesanan={pesanan} />
              </div>

              <div className={`p-5 rounded bg-white`}>
                {pesanan.tagihan && (
                  <>
                    <div className="flex flex-col md:flex-row md:justify-between mb-4 space-y-2 md:space-y-0 md:space-x-5">
                      <h4 className="font-bold text-lg mb-0">Info Tagihan</h4>
                      <span
                        className={`${
                          pesanan.tagihan.is_finished
                            ? 'bg-green-600'
                            : pesanan.tagihan.is_canceled
                            ? 'bg-red-600'
                            : 'bg-yellow-500'
                        } rounded-full text-white px-4 py-[3px] text-[small]`}
                      >
                        {pesanan.tagihan.is_finished ? (
                          <CheckCircleFilled />
                        ) : pesanan.tagihan.is_canceled ? (
                          <CloseCircleFilled />
                        ) : (
                          <ClockCircleFilled />
                        )}
                        &nbsp;{' '}
                        {pesanan.tagihan?.status === 'DIBUAT'
                          ? 'Menunggu Pembayaran'
                          : capitalize(pesanan.tagihan.status)}
                      </span>
                    </div>
                    <hr className="border-dashed mb-4 hidden md:block" />
                  </>
                )}
                <div className="space-y-2">
                  {pesanan.tagihan && (
                    <>
                      <Row>
                        <span>Nomor Tagihan</span>
                        <span
                          className="cursor-pointer"
                          onClick={() => handleCopy(pesanan.tagihan.id, 'Nomor tagihan')}
                        >
                          {pesanan.tagihan.id}
                        </span>
                      </Row>
                      <Row>
                        <span>Metode Pembayaran</span>
                        <img
                          className="w-20"
                          src={pesanan.tagihan.metode_pembayaran_logo}
                          alt={pesanan.tagihan.metode_pembayaran}
                        />
                      </Row>
                    </>
                  )}

                  <Row>
                    <span>Total Harga Produk</span>
                    <span>
                      {formatCurrency(pesanan.informasi_harga.harga_total_produk)}
                    </span>
                  </Row>
                  <Row>
                    <span>Kode Unik</span>
                    {pesanan.informasi_harga.harga_kode_unik ? (
                      <span>
                        {formatCurrency(pesanan.informasi_harga.harga_kode_unik)}
                      </span>
                    ) : (
                      <span className="text-gray-400">belum ditentukan</span>
                    )}
                  </Row>
                </div>
                <hr className="border-dashed border-color-theme mt-4 mb-4" />
                <Row>
                  <span className="font-bold text-lg text-color-theme">Total Bayar</span>
                  <b className="text-lg">
                    {formatCurrency(pesanan.informasi_harga.harga_total_bayar)}
                  </b>
                </Row>
              </div>
            </div>
            <div className="col-span-12 lg:col-span-4 space-y-2">
              {pesanan.tagihan?.receipt && (
                <Button
                  href={pesanan.tagihan.receipt}
                  block
                  target="_blank"
                  size="large"
                  type={`primary`}
                >
                  Unduh Struk Tagihan
                </Button>
              )}
              <Button
                onClick={() => navigate(`/chat/${pesanan.konsumen_id}`)}
                type="primary"
                size="large"
                block
              >
                Chat Konsumen
              </Button>
              {pesanan.status === 'VERIFIKASI_PERSYARATAN' && (
                <Button
                  disabled={!pesanan.persyaratan}
                  onClick={() => setShowModalKonfirmasi(true)}
                  block
                  size="large"
                  type={`primary`}
                >
                  Konfirmasi Verifikasi
                </Button>
              )}
              {pesanan.status === 'DIKEMAS' && (
                <Button
                  onClick={() => setShowModalAturPengiriman(true)}
                  block
                  size="large"
                  type={`primary`}
                >
                  Konfirmasi Pengiriman
                </Button>
              )}
              {pesanan.status === 'DIKIRIM' && (
                <Button
                  onClick={() => setShowModalAturPengiriman(true)}
                  block
                  disabled={!pesanan.is_pengiriman_editable}
                  size="large"
                  type={`primary`}
                >
                  Ubah Pengiriman
                </Button>
              )}
            </div>
          </section>
        </>
      )}
    </section>
  );
}
