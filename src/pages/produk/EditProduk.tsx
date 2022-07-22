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
import {
  Form,
  Input,
  PageHeader,
  Button,
  Upload,
  message,
  Cascader,
  Skeleton,
} from 'antd';
import { CheckCircleOutlined, FileImageOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { parseError, beforeUpload } from '@/helpers/form_helper';
import { AxiosResponse } from 'axios';
import {
  getSemuaKategoriProdukCascader,
  getDetailProduk,
  putUpdateProduk,
} from '@/services/produk';
import { froalaConfig } from '@/helpers/froala_helper';
import Produk from '@/types/Produk';

export default function HalamanEditProduk() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { id } = useParams();

  const [produk, setProduk] = useState<Produk | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [deskripsi, setDeskripsi] = useState<string>('');
  const [unit, setUnit] = useState<string | null>(null);
  const [loadingKategori, setLoadingKategori] = useState<boolean>(true);
  const [submitting, setIsSubmitting] = useState<boolean>(false);

  const [consumentCategories, setConsumentCategories] = useState<Array<any>>([]);

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
    formData.append('_method', 'PUT');
    for (const item in values) {
      if (item === 'banner') {
        if (!values[item][0].originFileObj) continue;
        formData.append(item, values[item][0].originFileObj);
      } else {
        const val =
          item === 'kategori_id' ? values[item][values[item].length - 1] : values[item];
        formData.append(item, val);
      }
    }

    setIsSubmitting(true);
    putUpdateProduk(id as string, formData)
      .then(() => {
        message.success('Produk berhasil diperbaharui');
        navigate(`/produk/${id}`);
      })
      .catch((e: any) => parseError(form, e))
      .finally(() => setIsSubmitting(false));
  };

  useEffect(() => {
    setLoading(true);
    setLoadingKategori(true);
    getDetailProduk(id as string).then(({ data }: AxiosResponse<Produk>) => {
      setProduk(data);
      setLoading(false);
      setDeskripsi(data.deskripsi);
      setUnit(data.unit);
    });

    getSemuaKategoriProdukCascader()
      .then(({ data }: AxiosResponse<any>) => setConsumentCategories(data))
      .finally(() => setLoadingKategori(false));
  }, [id]);

  if (loading) {
    return <Skeleton active className="p-5" />;
  }

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
              path: id as string,
              breadcrumbName: produk?.nama as string,
            },
            {
              path: 'edit',
              breadcrumbName: 'Edit',
            },
          ],
        }}
        title="Edit Produk"
        subTitle="Perbaharui informasi produk"
      />
      <section className="p-5">
        <Form
          form={form}
          initialValues={{
            ...produk,
            kategori_id: produk?.kategori_cascader,
            banner: [
              {
                uid: id,
                name: produk?.nama,
                status: 'done',
                url: produk?.banner,
              },
            ],
          }}
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
            <Upload
              name="banner"
              beforeUpload={handleBeforeUpload}
              listType="picture-card"
            >
              <FileImageOutlined />
            </Upload>
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
              options={consumentCategories}
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
            Simpan Perubahan Produk
          </Button>
        </div>
      </section>
    </React.Fragment>
  );
}
