import { getDetailProdukWithStok, putUpdateStokProduk } from '@/services/produk';
import Produk from '@/types/Produk';
import { CheckCircleFilled, MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, DatePicker, Form, Input, message, PageHeader, Skeleton } from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

export default function HalamanStokProduk() {
  const { id } = useParams();
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [produk, setProduk] = useState<Produk | null>(null);

  const handleUpdateStok = (values: any) => {
    setSubmitting(true);
    putUpdateStokProduk(id as string, values)
      .then(() => {
        message.success('Stok produk berhasil diperbaharui');
        navigate(`/produk/${id}`);
      })
      .finally(() => setSubmitting(false));
  };

  useEffect(() => {
    // setLoading(true);
    getDetailProdukWithStok(id as string)
      .then(({ data }) => setProduk(data))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Skeleton active className="p-5" />;

  return (
    <>
      <PageHeader
        onBack={() => navigate(`/produk/${id}`)}
        breadcrumb={{
          routes: [
            {
              path: 'produk',
              breadcrumbName: 'Daftar Produk',
            },
            {
              path: id as string,
              breadcrumbName: 'Detail',
            },
            {
              path: 'stok',
              breadcrumbName: 'Stok',
            },
          ],
        }}
        title="Stok Produk"
        subTitle="Perbaharui jumlah stok produk"
      />
      <section className="p-5">
        <div className="flex space-x-5 bg-white rounded p-5 mb-5">
          <div className="flex-none">
            <img src={produk?.banner} alt={produk?.nama} className="w-32 rounded" />
          </div>
          <div className="flex-grow">
            <h1 className="font-bold text-xl md:text-2xl mb-0">{produk?.nama}</h1>
            <Link to={`/kategori/produk/${produk?.kategori.id}`} className="font-bold">
              {produk?.kategori.nama}
            </Link>
          </div>
        </div>
        <Form
          form={form}
          layout="vertical"
          onFinishFailed={() => message.warning('Periksa kembali data anda')}
          onFinish={handleUpdateStok}
          initialValues={{
            stok:
              produk?.stok?.map((item) => ({
                ...item,
                waktu_tersedia: [
                  moment(item.tersedia_dari),
                  moment(item.tersedia_hingga),
                ],
              })) ?? [],
          }}
        >
          <Form.List name="stok">
            {(fields, { add, remove }) => (
              <div className="space-y-5">
                {fields.map(({ key, name, ...restField }, index) => (
                  <div
                    key={key}
                    className="flex items-center gap-10 p-5 rounded bg-gray-100"
                  >
                    <div className="flex-grow grid grid-cols-2 gap-5">
                      <div className="col-span-1">
                        <Form.Item
                          {...restField}
                          name={[name, 'jumlah']}
                          fieldKey={[key, 'jumlah']}
                          label="Jumlah Produk"
                          rules={[
                            { required: true, message: 'Jumlah produk dibutuhkan' },
                            {
                              pattern: /^([0-9])*$/,
                              message: 'Jumlah produk harus berupa angka',
                            },
                          ]}
                        >
                          <Input allowClear addonAfter={<span>{produk?.unit}</span>} />
                        </Form.Item>
                      </div>
                      <div className="col-span-1">
                        <Form.Item
                          {...restField}
                          label="Waktu Ketersediaan"
                          name={[name, 'waktu_tersedia']}
                          fieldKey={[key, 'waktu_tersedia']}
                          rules={[{ required: true, message: 'Masa berlaku dibutuhkan' }]}
                        >
                          <DatePicker.RangePicker
                            className="w-full"
                            ranges={{
                              'Bulan Ini': [
                                moment().startOf('month'),
                                moment().endOf('month'),
                              ],
                              'Bulan Depan': [
                                moment().add(1, 'months').startOf('month'),
                                moment().add(1, 'months').endOf('month'),
                              ],
                            }}
                          />
                        </Form.Item>
                      </div>
                    </div>
                    <button className="text-red-500">
                      <MinusCircleOutlined
                        className="text-xl md:text-3xl"
                        onClick={() => {
                          remove(name);
                        }}
                      />
                    </button>
                  </div>
                ))}
                <div className="flex justify-between space-x-5">
                  <Button
                    type="dashed"
                    size="large"
                    onClick={() => {
                      add();
                    }}
                    icon={<PlusOutlined />}
                  >
                    Tambah Stok
                  </Button>
                  <Button
                    type="primary"
                    size="large"
                    loading={submitting}
                    onClick={() => {
                      form.submit();
                    }}
                    icon={<CheckCircleFilled />}
                  >
                    Simpan Perubahan
                  </Button>
                </div>
              </div>
            )}
          </Form.List>
        </Form>
      </section>
    </>
  );
}
