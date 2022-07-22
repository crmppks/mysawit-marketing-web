import React, { useState, useEffect } from 'react';
import {
  Form,
  Input,
  PageHeader,
  Button,
  message,
  Cascader,
  Select,
  Skeleton,
} from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { parseError } from '@/helpers/form_helper';
import { AxiosResponse } from 'axios';
import { getSemuaKategoriProdukCascader } from '@/services/produk';
import {
  getDaftarAtasan,
  getDetailMarketing,
  getJabatanMarketing,
  putUpdateMarketing,
} from '@/services/marketing';
import UserMarketing from '@/types/UserMarketing';
import {
  ID_KATEGORI_PRODUK_KECAMBAH,
  JABATAN_MANAGER,
  JABATAN_SUPERVISOR,
} from '@/helpers/constants';

export default function HalamanEditMarketing() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const [loading, setLoading] = useState<boolean>(true);
  const [marketing, setMarketing] = useState<UserMarketing | null>(null);
  const [jabatan, setJabatan] = useState<string | null>(null);
  const [isKecambah, setIsKecambah] = useState<boolean>(false);
  const [loadingKategori, setLoadingKategori] = useState<boolean>(true);
  const [loadingAtasan, setLoadingAtasan] = useState<boolean>(false);
  const [submitting, setIsSubmitting] = useState<boolean>(false);

  const [opsiJabatan, setOpsiJabatan] = useState<string[]>([]);
  const [opsiKategoriKonsumen, setOpsiKategoriKonsumen] = useState<Array<any>>([]);
  const [opsiAtasan, setOpsiAtasan] = useState<UserMarketing[]>([]);

  const handleSubmit = (values: any) => {
    setIsSubmitting(true);
    putUpdateMarketing(marketing?.user_id!, {
      ...values,
      kategori_id: values.kategori_id[values.kategori_id.length - 1],
    })
      .then(() => {
        message.success('Akun marketing berhasil diperbaharui');
        navigate(`/marketing/${marketing?.user_id}`);
      })
      .catch((e: any) => parseError(form, e))
      .finally(() => setIsSubmitting(false));
  };

  useEffect(() => {
    setLoading(true);
    setLoadingKategori(true);

    getDetailMarketing(id as string).then(({ data }: AxiosResponse<UserMarketing>) => {
      setMarketing(data);
      setLoading(false);
      setIsKecambah(data.kategori_produk_id === ID_KATEGORI_PRODUK_KECAMBAH);
      setJabatan(data.jabatan);
    });

    getJabatanMarketing().then(({ data }) => setOpsiJabatan(data));
    getSemuaKategoriProdukCascader()
      .then(({ data }: AxiosResponse<any>) => setOpsiKategoriKonsumen(data))
      .finally(() => setLoadingKategori(false));
  }, [id]);

  useEffect(() => {
    if (isKecambah && opsiAtasan.length === 0) {
      setLoadingAtasan(true);
      getDaftarAtasan()
        .then(({ data }) => setOpsiAtasan(data))
        .finally(() => setLoadingAtasan(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isKecambah]);

  if (loading) {
    return <Skeleton active className="p-5" />;
  }

  return (
    <React.Fragment>
      <PageHeader
        onBack={() => navigate('/marketing')}
        breadcrumb={{
          routes: [
            {
              path: '/marketing',
              breadcrumbName: 'Daftar Marketing',
            },
            {
              path: 'edit',
              breadcrumbName: 'Perbaharui',
            },
          ],
        }}
        title="Perbaharui Marketing"
        subTitle="Sesuaikan informasi akun marketing"
      />
      <section className="p-5">
        <div className="w-full lg:w-8/12 flex items-center space-x-5 bg-white shadow rounded-md p-5 mb-10">
          <img src={marketing?.avatar} alt={marketing?.nama} className="w-10 md:w-16" />
          <div className="flex-grow">
            <h2 className="font-bold text-xl mb-0">{marketing?.nama}</h2>
            <span className="text-gray-400">{marketing?.kode_marketing}</span>
          </div>
        </div>
        <Form
          form={form}
          className="w-full lg:w-8/12"
          onFinish={handleSubmit}
          initialValues={{
            ...marketing,
            kategori_id: marketing?.kategori_produk_cascader,
            atasan_id: marketing?.atasan?.user_id,
          }}
          onFinishFailed={() => message.warning('Periksa kembali data anda')}
          layout="vertical"
        >
          <Form.Item
            name="nik"
            rules={[
              { required: true, message: 'NIK dibutuhkan' },
              { pattern: /^([0-9])*$/, message: 'NIK harus berupa angka' },
            ]}
            label={`NIK`}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="kategori_id"
            label="Kategori"
            rules={[{ required: true, message: 'Kategori dibutuhkan' }]}
          >
            <Cascader
              options={opsiKategoriKonsumen}
              onChange={(val) => setIsKecambah(val[0] === ID_KATEGORI_PRODUK_KECAMBAH)}
              loading={loadingKategori}
              fieldNames={{ label: 'nama', value: 'id', children: 'sub_kategori' }}
              expandTrigger="hover"
              displayRender={(label) => label[label.length - 1]}
            />
          </Form.Item>
          {isKecambah && (
            <div
              className={`grid grid-cols-${
                jabatan && jabatan !== JABATAN_MANAGER ? '2' : '1'
              } gap-5`}
            >
              <Form.Item
                name="jabatan"
                rules={[{ required: true, message: 'Posisi/Jabatan dibutuhkan' }]}
                label={`Posisi/Jabatan`}
              >
                <Select
                  allowClear
                  onChange={(value) => {
                    setJabatan(value);
                    form.setFieldsValue({
                      atasan_id: '',
                    });
                  }}
                >
                  {opsiJabatan.map((item) => (
                    <Select.Option key={item} value={item}>
                      {item}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              {jabatan && jabatan !== JABATAN_MANAGER && (
                <Form.Item
                  name="atasan_id"
                  rules={[{ required: true, message: 'Atasan dibutuhkan' }]}
                  label={`Atasan`}
                >
                  <Select allowClear loading={loadingAtasan}>
                    {opsiAtasan
                      .filter((item) => {
                        if (jabatan === JABATAN_SUPERVISOR) {
                          return item.jabatan === JABATAN_MANAGER;
                        }
                        return item.jabatan === JABATAN_SUPERVISOR;
                      })
                      .map((marketing) => (
                        <Select.Option key={marketing.user_id} value={marketing.user_id}>
                          {marketing.jabatan} - {marketing.nama}
                        </Select.Option>
                      ))}
                  </Select>
                </Form.Item>
              )}
            </div>
          )}
        </Form>
        <div className="mt-10">
          <Button
            icon={<CheckCircleOutlined />}
            size="large"
            onClick={() => form.submit()}
            loading={submitting}
            htmlType="submit"
            type="primary"
          >
            Simpan Perubahan
          </Button>
        </div>
      </section>
    </React.Fragment>
  );
}
