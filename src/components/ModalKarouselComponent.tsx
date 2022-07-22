import { beforeUpload, parseError } from '@/helpers/form_helper';
import { postTambahKarousel, putUpdateKarousel } from '@/services/karousel';
import { FileImageOutlined } from '@ant-design/icons';
import { Form, Input, Modal, ModalProps, Upload } from 'antd';
import { useEffect, useState } from 'react';

export interface ModalKarouselItem {
  tipe: 'EDIT' | 'TAMBAH';
  item?: any;
}

interface Props extends ModalProps {
  modalItem?: ModalKarouselItem | null;
  onCancel: () => void;
  onFinishAdd: (item: any) => void;
  onFinishUpdate: (item: any) => void;
}

export default function ModalKarousel({
  modalItem,
  visible,
  onCancel,
  onFinishAdd,
  onFinishUpdate,
}: Props) {
  const [form] = Form.useForm();

  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (visible && modalItem?.item) {
      form.setFieldsValue({
        ...modalItem.item,
        banner: [
          {
            uid: modalItem.item.id,
            name: 'Banner Image',
            status: 'done',
            url: modalItem.item.banner,
          },
        ],
      });
    }
    if (!visible || !modalItem?.item) {
      form.resetFields();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  return (
    <Modal
      title={`${modalItem?.tipe === 'TAMBAH' ? 'Tambah' : 'Edit'} Banner Karousel`}
      confirmLoading={loading}
      visible={visible}
      okText="Simpan"
      cancelText="Batal"
      onOk={() => form.submit()}
      onCancel={onCancel}
    >
      <Form
        form={form}
        onFinish={(values) => {
          const formData = new FormData();

          for (const item in values) {
            if (item === 'banner') {
              if (!values[item][0].originFileObj) continue;
              formData.append(item, values[item][0].originFileObj);
            } else {
              if (!values[item]) continue;
              formData.append(item, values[item]);
            }
          }

          setLoading(true);
          if (modalItem?.tipe === 'TAMBAH') {
            postTambahKarousel(formData)
              .then(({ data }) => {
                onFinishAdd(data);
                onCancel();
              })
              .catch((e) => parseError(form, e))
              .finally(() => setLoading(false));
          } else {
            formData.append('_method', 'PUT');
            putUpdateKarousel(modalItem?.item.id, formData)
              .then(({ data }) => {
                onFinishUpdate(data);
                onCancel();
              })
              .catch((e) => parseError(form, e))
              .finally(() => setLoading(false));
          }
        }}
        layout={'vertical'}
      >
        <Form.Item
          name="banner"
          label="Banner"
          extra={
            <small className="text-gray-500">
              Ukuran minimal gambar adalah 1900px * 550px
            </small>
          }
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
          rules={[{ required: true, message: 'Foto banner dibutuhkan' }]}
        >
          {/* <ImgCrop rotate> */}
          <Upload.Dragger
            name="banner"
            listType="picture"
            beforeUpload={(file) => beforeUpload(file, ['image/png', 'image/jpeg'], 10)}
          >
            <p className="ant-upload-drag-icon">
              <FileImageOutlined className="text-lg" />
            </p>
            <p className="ant-upload-text">Klik atau tarik file ke area ini</p>
            <p className="ant-upload-hint">
              Hanya menerima tipe file Image PNG, JPG, JPEG
            </p>
          </Upload.Dragger>
          {/* </ImgCrop> */}
        </Form.Item>
        <Form.Item
          name="judul"
          label="Judul"
          rules={[{ required: true, message: 'Judul dibutuhkan' }]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
}
