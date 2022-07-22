import React, { useState, useEffect } from 'react';
import { Form, Input, PageHeader, Button, message, Cascader, DatePicker } from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { parseError } from '@/helpers/form_helper';
import { AxiosResponse } from 'axios';
import {
  getSemuaKategoriKonsumenCascader,
  postTambahKonsumen,
} from '@/services/konsumen';
import moment from 'moment';
import { ID_KATEGORI_KONSUMEN_KORPORAT } from '@/helpers/constants';

export default function HalamanTambahKonsumen() {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const [isKorporat, setIsKorporat] = useState<boolean>(false);
  const [loadingKategori, setLoadingKategori] = useState<boolean>(true);
  const [submitting, setIsSubmitting] = useState<boolean>(false);
  const [opsiKategoriKonsumen, setOpsiKategoriKonsumen] = useState<Array<any>>([]);

  const handleSubmit = (values: any) => {
    setIsSubmitting(true);
    postTambahKonsumen({
      ...values,
      kategori_id: values.kategori_id[values.kategori_id.length - 1],
    })
      .then(() => {
        message.success('Akun konsumen berhasil ditambahkan');
        navigate('/konsumen');
      })
      .catch((e: any) => parseError(form, e))
      .finally(() => setIsSubmitting(false));
  };

  useEffect(() => {
    setLoadingKategori(true);
    getSemuaKategoriKonsumenCascader()
      .then(({ data }: AxiosResponse<any>) => setOpsiKategoriKonsumen(data))
      .finally(() => setLoadingKategori(false));
  }, []);

  return (
    <React.Fragment>
      <PageHeader
        onBack={() => navigate('/konsumen')}
        breadcrumb={{
          routes: [
            {
              path: '/konsumen',
              breadcrumbName: 'Daftar Konsumen',
            },
            {
              path: 'tambah',
              breadcrumbName: 'Tambah',
            },
          ],
        }}
        title="Tambah Konsumen"
        subTitle="Buat akun konsumen baru"
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
            name="kategori_id"
            label="Kategori Konsumen"
            rules={[{ required: true, message: 'Kategori dibutuhkan' }]}
          >
            <Cascader
              options={opsiKategoriKonsumen}
              loading={loadingKategori}
              fieldNames={{ label: 'nama', value: 'id', children: 'sub_kategori' }}
              onChange={(value) =>
                setIsKorporat(value[0] === ID_KATEGORI_KONSUMEN_KORPORAT)
              }
              expandTrigger="hover"
              displayRender={(label) => label[label.length - 1]}
            />
          </Form.Item>
          {isKorporat && (
            <Form.Item
              name="nama_atasan_perusahaan"
              rules={[{ required: true, message: 'Nama atasan perusahaan dibutuhkan' }]}
              label="Nama Atasan Perusahaan"
            >
              <Input />
            </Form.Item>
          )}

          <Form.Item
            name="nama"
            rules={[{ required: true, message: 'Nama dibutuhkan' }]}
            label="Nama Konsumen"
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="username"
            rules={[
              { required: true, message: 'Username dibutuhkan' },
              {
                pattern: /^[\w](?!.*?\.{2})[\w.]{1,28}[\w]$/,
                message: 'Format username tidak valid',
              },
            ]}
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
            name="tgl_lahir"
            rules={[{ required: true, message: 'Tanggal lahir dibutuhkan' }]}
            label={`Tanggal Lahir`}
          >
            <DatePicker
              // defaultValue={moment('2014-12-30')}
              disabledDate={(date) => date.isAfter(moment('2015-01-01'))}
              picker="date"
              showNow={false}
              className="w-full"
            />
          </Form.Item>
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
            Tambahkan Konsumen
          </Button>
        </div>
      </section>
    </React.Fragment>
  );
}
