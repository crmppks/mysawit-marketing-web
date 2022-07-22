// Require Editor JS files.
import 'froala-editor/js/plugins.pkgd.min.js';
import 'froala-editor/js/froala_editor.pkgd.min.js';

// Require Editor CSS files.
import 'froala-editor/css/froala_style.min.css';
import 'froala-editor/css/froala_editor.pkgd.min.css';

// Require Font Awesome.
import 'font-awesome/css/font-awesome.css';
import FroalaEditor from 'react-froala-wysiwyg';
import React, { useState, useEffect } from 'react';
import { Form, Input, PageHeader, Button, Upload, message, Cascader } from 'antd';
import { CheckCircleOutlined, FileImageOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { parseError, beforeUpload } from '@/helpers/form_helper';
import { AxiosResponse } from 'axios';
import { postTambahProduk, getSemuaKategoriProdukCascader } from '@/services/produk';
import { froalaConfig } from '@/helpers/froala_helper';
import { confirmAlert } from '@/helpers/swal_helper';

export default function HalamanTambahProduk() {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const [deskripsi, setDeskripsi] = useState<string>('');
  const [unit, setUnit] = useState<string | null>(null);
  const [loadingKategori, setLoadingKategori] = useState<boolean>(true);
  const [submitting, setIsSubmitting] = useState<boolean>(false);

  const [kategoriKonsumen, setKategoriKonsumen] = useState<Array<any>>([]);

  const handleBeforeUpload = (file: any) => {
    return beforeUpload(file, ['image/jpeg', 'image/png'], 3);
  };

  const handleSubmit = (values: any) => {
    if (!deskripsi || deskripsi?.length === 0) {
      message.warning('Deskripsi produk harus diisi');
      return;
    }

    const formData = new FormData();
    formData.append('deskripsi', deskripsi);
    for (const item in values) {
      if (item === 'banner') {
        formData.append(item, values[item][0].originFileObj);
      } else {
        const val =
          item === 'kategori_id' ? values[item][values[item].length - 1] : values[item];
        formData.append(item, val);
      }
    }

    setIsSubmitting(true);
    postTambahProduk(formData)
      .then(({ data }) => {
        message.success('Produk berhasil ditambahkan');
        confirmAlert(
          'Aksi Selanjutnya',
          <>
            Apakah anda ingin mengisi stok untuk produk <b>{values.nama}</b>?
          </>,
        ).then((yes: boolean) => {
          if (yes) {
            navigate(`/produk/${data.id}/stok`);
          } else {
            navigate('/produk');
          }
        });
      })
      .catch((e: any) => parseError(form, e))
      .finally(() => setIsSubmitting(false));
  };

  useEffect(() => {
    setLoadingKategori(true);

    getSemuaKategoriProdukCascader()
      .then(({ data }: AxiosResponse<any>) => setKategoriKonsumen(data))
      .finally(() => setLoadingKategori(false));
  }, []);

  return (
    <React.Fragment>
      <PageHeader
        onBack={() => navigate('/produk')}
        breadcrumb={{
          routes: [
            {
              path: '/produk',
              breadcrumbName: 'Daftar Produk',
            },
            {
              path: 'create',
              breadcrumbName: 'Tambah',
            },
          ],
        }}
        title="Tambah Produk"
        subTitle="Buat produk baru"
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
            name="banner"
            label="Foto Produk"
            valuePropName="fileList"
            getValueFromEvent={(e) => {
              const isJpgOrPng =
                e.file?.type === 'image/jpeg' || e.file?.type === 'image/png';

              if (!isJpgOrPng) {
                return e.fileList.filter((item: any) => item.uid !== e.file?.uid);
              }
              if (e.fileList.length > 1) {
                return [e.fileList[1]];
              }

              return e && e.fileList;
            }}
            rules={[{ required: true, message: 'Foto produk dibutuhkan' }]}
          >
            {/* <ImgCrop rotate> */}
            <Upload
              name="banner"
              beforeUpload={handleBeforeUpload}
              listType="picture-card"
            >
              <FileImageOutlined />
            </Upload>
            {/* </ImgCrop> */}
          </Form.Item>
          <Form.Item
            name="nama"
            rules={[{ required: true, message: 'Nama produk dibutuhkan' }]}
            label="Nama Produk"
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="harga"
            rules={[
              { required: true, message: 'Harga dibutuhkan' },
              { pattern: /^([0-9])*$/, message: 'Harga harus berupa angka' },
            ]}
            label="Harga per item"
          >
            <Input addonBefore={<span>Rp</span>} />
          </Form.Item>
          <Form.Item
            name="kategori_id"
            label="Kategori"
            rules={[{ required: true, message: 'Kategori dibutuhkan' }]}
          >
            <Cascader
              options={kategoriKonsumen}
              loading={loadingKategori}
              changeOnSelect
              fieldNames={{ label: 'nama', value: 'id', children: 'sub_kategori' }}
              expandTrigger="hover"
              displayRender={(label) => label[label.length - 1]}
            />
          </Form.Item>
          <Form.Item
            name="unit"
            rules={[{ required: true, message: 'Unit produk dibutuhkan' }]}
            label="Unit produk"
          >
            <Input
              onChange={(e) => setUnit(e.target.value)}
              placeholder="Contoh: botol, butir, bungkus, dll"
            />
          </Form.Item>
          <Form.Item
            name="berat"
            rules={[
              { required: true, message: 'Berat dibutuhkan' },
              { pattern: /^([0-9])*$/, message: 'Berat harus berupa angka' },
            ]}
            label={`Berat per ${unit ? (unit.length > 0 ? unit : 'item') : 'item'} (gr)`}
          >
            <Input />
          </Form.Item>
        </Form>
        <div className="w-full lg:w-8/12">
          <FroalaEditor
            config={{
              ...froalaConfig,
              placeholderText: 'Deskripsi produk',
            }}
            model={deskripsi}
            onModelChange={(m: any) => setDeskripsi(m)}
          />
        </div>
        <div className="mt-10">
          <Button
            icon={<CheckCircleOutlined />}
            size="large"
            onClick={() => form.submit()}
            loading={submitting}
            htmlType="submit"
            type="primary"
          >
            Simpan Produk
          </Button>
        </div>
      </section>
    </React.Fragment>
  );
}
