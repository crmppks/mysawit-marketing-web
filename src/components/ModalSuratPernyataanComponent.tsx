import { postUploadSuratPernyataan } from '@/services/surat-pernyataan';
import { FileAddFilled } from '@ant-design/icons';
import { Form, message, Modal, ModalProps, Upload } from 'antd';
import { useState } from 'react';

interface Props extends ModalProps {
  onFinishUpload: () => void;
}

export default function ModalSuratPernyataan({
  visible,
  onCancel,
  onFinishUpload,
}: Props) {
  const [loading, setLoading] = useState<boolean>(false);
  const [form] = Form.useForm();

  const handleUpload = (values: any) => {
    setLoading(true);

    const formData = new FormData();
    formData.append(
      'file_surat_pernyataan',
      values.file_surat_pernyataan[0].originFileObj,
    );

    postUploadSuratPernyataan(formData)
      .then(() => {
        message.success('File Surat Pernyataan Konsumen berhasil diperbaharui');
        onFinishUpload();
      })
      .finally(() => setLoading(false));
  };

  const beforeUploadFile = (file: any) => {
    const isFormatAccepted = ['application/pdf'].includes(file?.type);
    if (!isFormatAccepted) {
      message.error('Ekstensi file yang diijinkan adalah .pdf');
    }

    return false;
  };

  return (
    <Modal
      visible={visible}
      onCancel={onCancel}
      onOk={() => form.submit()}
      okButtonProps={{
        loading: loading,
      }}
      okText="Unggah"
      title="Perbaharui Surat Pernyataan"
    >
      <Form form={form} layout="vertical" onFinish={handleUpload}>
        <Form.Item
          name="file_surat_pernyataan"
          valuePropName="fileList"
          rules={[{ required: true, message: 'Surat pernyataan dibutuhkan' }]}
          getValueFromEvent={(e) => {
            const isFormatAccepted = ['application/pdf'].includes(e.file?.type);

            if (!isFormatAccepted) {
              return e.fileList.filter((item: any) => item.uid !== e.file?.uid);
            }

            if (e.fileList.length > 1) {
              return [e.fileList[1]];
            }

            return e && e.fileList;
          }}
        >
          <Upload.Dragger beforeUpload={beforeUploadFile} name="file_produk">
            <p className="ant-upload-drag-icon">
              <FileAddFilled />
            </p>
            <p className="font-bold">Klik atau tarik file ke area ini</p>
            <p className="text-xs text-gray-400">Hanya menerima tipe file PDF</p>
          </Upload.Dragger>
        </Form.Item>
      </Form>
    </Modal>
  );
}
