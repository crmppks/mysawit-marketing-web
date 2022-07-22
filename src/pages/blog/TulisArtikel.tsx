// Require Editor JS files.
import 'froala-editor/js/plugins.pkgd.min.js';
import 'froala-editor/js/froala_editor.pkgd.min.js';

// Require Editor CSS files.
import 'froala-editor/css/froala_style.min.css';
import 'froala-editor/css/froala_editor.pkgd.min.css';

// Require Font Awesome.
import 'font-awesome/css/font-awesome.css';
import FroalaEditor from 'react-froala-wysiwyg';
import { PageHeader, Form, Input, Button, Upload, message } from 'antd';
import { useState } from 'react';
import { CheckOutlined, FileImageOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { froalaConfig } from '@/helpers/froala_helper';
import { beforeUpload, parseError } from '@/helpers/form_helper';
import { postTambahArtikel } from '@/services/artikel';

export default function HalamanTulisArtikel() {
  const navigate = useNavigate();
  const [isi, setIsi] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);

  const [form] = Form.useForm();

  const handleSubmit = (values: any) => {
    setSubmitting(true);

    const formData = new FormData();

    for (const item in values) {
      if (item === 'banner') {
        if (!values[item]) continue;
        formData.append(item, values[item][0].originFileObj);
      } else {
        formData.append(item, values[item]);
      }
    }

    formData.append('isi', isi);

    postTambahArtikel(formData)
      .then(() => {
        message.success('Artikel berhasil dibuat');
        navigate('/blog');
      })
      .catch((e) => parseError(form, e))
      .finally(() => setSubmitting(false));
  };

  return (
    <>
      <PageHeader
        breadcrumb={{
          routes: [
            {
              path: `/blog`,
              breadcrumbName: 'Daftar Artikel',
            },
            {
              path: `tulis`,
              breadcrumbName: 'Buat Artikel',
            },
          ],
        }}
        title="Buat Artikel"
        subTitle="Tulis artikel baru untuk mengedukasi konsumen"
      />
      <section className="p-5 editor-form">
        <div className="w-full lg:w-8/12">
          <Form form={form} onFinish={handleSubmit} layout="vertical">
            <Form.Item
              name="banner"
              label="Banner"
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
              // rules={[{ required: true, message: 'Foto banner dibutuhkan' }]}
            >
              {/* <ImgCrop rotate> */}
              <Upload.Dragger
                name="banner"
                listType="picture"
                beforeUpload={(file) =>
                  beforeUpload(file, ['image/jpeg', 'image/png'], 3)
                }
              >
                <p className="ant-upload-drag-icon">
                  <FileImageOutlined className="text-lg" />
                </p>
                <p className="ant-upload-text">Klik atau tarik file ke area ini</p>
                <p className="ant-upload-hint">
                  Hanya menerima tipe file Image PNG, JPG, JPEG dengan ukuran minimal 1500
                  x 700
                </p>
              </Upload.Dragger>
              {/* </ImgCrop> */}
            </Form.Item>

            <Form.Item
              name={'judul'}
              label={'Judul'}
              rules={[{ required: true, message: 'Judul dibutuhkan' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name={'kalimat_pembuka'}
              label="Kalimat Pembuka"
              rules={[{ required: true, message: 'Kalimat pembuka dibutuhkan' }]}
            >
              <Input.TextArea placeholder="Informasi singkat sebelum pembaca membaca artikel keseluruhan" />
            </Form.Item>
          </Form>
          <FroalaEditor
            config={{
              ...froalaConfig,
              placeholderText: 'Isi artikel',
            }}
            model={isi}
            onModelChange={(m: string) => setIsi(m)}
          />
        </div>
        <Button
          className="mt-5"
          type="primary"
          size="large"
          icon={<CheckOutlined />}
          loading={submitting}
          onClick={() => form.submit()}
        >
          Simpan Artikel
        </Button>
      </section>
    </>
  );
}
