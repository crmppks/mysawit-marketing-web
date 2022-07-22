// Require Editor JS files.
import 'froala-editor/js/plugins.pkgd.min.js';
import 'froala-editor/js/froala_editor.pkgd.min.js';

// Require Editor CSS files.
import 'froala-editor/css/froala_style.min.css';
import 'froala-editor/css/froala_editor.pkgd.min.css';

// Require Font Awesome.
import 'font-awesome/css/font-awesome.css';
import FroalaEditor from 'react-froala-wysiwyg';
import { PageHeader, Form, Input, Button, Upload, message, Skeleton } from 'antd';
import { useEffect, useState } from 'react';
import { CheckOutlined, FileImageOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { froalaConfig } from '@/helpers/froala_helper';
import { beforeUpload, parseError } from '@/helpers/form_helper';
import { getDetailArtikel, putUpdateArtikel } from '@/services/artikel';
import Artikel from '@/types/Artikel';

export default function HalamanEditArtikel() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState<boolean>(true);
  const [artikel, setArtikel] = useState<Artikel | null>(null);
  const [isi, setIsi] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);

  const [form] = Form.useForm();

  const handleSubmit = (values: any) => {
    setSubmitting(true);

    const formData = new FormData();

    for (const item in values) {
      if (item === 'banner') {
        if (!values[item][0].originFileObj) continue;
        formData.append(item, values[item][0].originFileObj);
      } else {
        formData.append(item, values[item]);
      }
    }

    formData.append('isi', isi);
    formData.append('_method', 'PUT');

    putUpdateArtikel(id as string, formData)
      .then(() => {
        message.success('Artikel berhasil diperbaharui');
        navigate(`/blog/${id}`);
      })
      .catch((e) => parseError(form, e))
      .finally(() => setSubmitting(false));
  };

  useEffect(() => {
    setLoading(true);
    getDetailArtikel(id as string)
      .then(({ data }) => {
        setArtikel(data);
        setIsi(data.isi);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Skeleton active className="p-5" />;

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
              path: id as string,
              breadcrumbName: artikel?.judul!,
            },
            {
              path: `edit`,
              breadcrumbName: 'Edit',
            },
          ],
        }}
        title="Edit Artikel"
        onBack={() => navigate(`/blog`)}
        subTitle="Perbaharui isi artikel"
      />
      <section className="p-5 editor-form">
        <div className="w-full lg:w-8/12">
          <Form
            form={form}
            initialValues={{
              ...artikel,
              banner: [
                {
                  uid: id,
                  name: artikel?.judul,
                  status: 'done',
                  url: artikel?.banner,
                },
              ],
            }}
            onFinish={handleSubmit}
            layout="vertical"
          >
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
          Simpan Perubahan
        </Button>
      </section>
    </>
  );
}
