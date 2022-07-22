import React, { useState, useEffect } from 'react';
import { Form, Input, PageHeader, Button, message, Cascader, Select } from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { parseError } from '@/helpers/form_helper';
import { AxiosResponse } from 'axios';
import { getSemuaKategoriProdukCascader } from '@/services/produk';
import {
  getDaftarAtasan,
  getJabatanMarketing,
  postTambahMarketing,
} from '@/services/marketing';
import UserMarketing from '@/types/UserMarketing';
import {
  ID_KATEGORI_PRODUK_KECAMBAH,
  JABATAN_MANAGER,
  JABATAN_SUPERVISOR,
} from '@/helpers/constants';

export default function HalamanTambahMarketing() {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const [jabatan, setJabatan] = useState<string | null>(null);
  const [isKecambah, setIsKecambah] = useState<boolean>(false);
  const [loadingKategori, setLoadingKategori] = useState<boolean>(true);
  const [submitting, setIsSubmitting] = useState<boolean>(false);

  const [opsiJabatan, setOpsiJabatan] = useState<string[]>([]);
  const [opsiKategoriProduk, setOpsiKategoriProduk] = useState<Array<any>>([]);
  const [opsiAtasan, setOpsiAtasan] = useState<UserMarketing[]>([]);

  const handleSubmit = (values: any) => {
    setIsSubmitting(true);
    postTambahMarketing({
      ...values,
      kategori_id: values.kategori_id[values.kategori_id.length - 1],
    })
      .then(() => {
        message.success('Akun marketing berhasil ditambahkan');
        navigate('/marketing');
      })
      .catch((e: any) => parseError(form, e))
      .finally(() => setIsSubmitting(false));
  };

  useEffect(() => {
    setLoadingKategori(true);

    getJabatanMarketing().then(({ data }) => setOpsiJabatan(data));
    getSemuaKategoriProdukCascader()
      .then(({ data }: AxiosResponse<any>) => setOpsiKategoriProduk(data))
      .finally(() => setLoadingKategori(false));
  }, []);

  useEffect(() => {
    if (isKecambah && opsiAtasan.length === 0) {
      getDaftarAtasan().then(({ data }) => setOpsiAtasan(data));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isKecambah]);

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
              path: 'tambah',
              breadcrumbName: 'Tambah',
            },
          ],
        }}
        title="Tambah Marketing"
        subTitle="Buat akun marketing baru"
      />
      <section className="p-5">
        <Form
          form={form}
          className="w-full lg:w-8/12"
          onFinish={handleSubmit}
          onFinishFailed={() => message.warning('Periksa kembali data anda')}
          layout="vertical"
        >
          <Form.Item
            name="nama"
            rules={[{ required: true, message: 'Nama dibutuhkan' }]}
            label="Nama"
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Username dibutuhkan' }]}
            label="Username"
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Email dibutuhkan' },
              { type: 'email', message: 'Format email tidak valid' },
            ]}
            label="Email"
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="no_hp"
            rules={[
              { required: true, message: 'No.HP dibutuhkan' },
              { pattern: /^([0-9])*$/, message: 'No.HP harus berupa angka' },
            ]}
            label={`No. HP`}
          >
            <Input addonBefore={<span>+62</span>} />
          </Form.Item>
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
              options={opsiKategoriProduk}
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
                  <Select allowClear>
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
            Tambahkan Marketing
          </Button>
        </div>
      </section>
    </React.Fragment>
  );
}
