import { postConfirmPesananVerification } from '@/services/pesanan';
import Pesanan from '@/types/Pesanan';
import { LinkOutlined } from '@ant-design/icons';
import { Checkbox, Form, Input, Modal, ModalProps, Select } from 'antd';
import { useState } from 'react';

interface Props extends ModalProps {
  pesanan: Pesanan;
  onFinishConfirmation: (pesanan: Pesanan) => void;
}

const Row = ({ children, className = '' }: any) => (
  <div
    className={`bg-color-theme px-3 py-2 rounded flex justify-between space-x-5 ${className}`}
  >
    {children}
  </div>
);

export default function ModalKonfirmasiVerifikasiPersyaratan({
  visible,
  pesanan,
  onCancel,
  onFinishConfirmation,
}: Props) {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [statusVerifikasi, setStatusVerifikasi] = useState<'LULUS' | 'TIDAK-LULUS'>(null);

  const handleSubmitKonfirmasi = (values: any) => {
    setSubmitting(true);
    postConfirmPesananVerification(pesanan.id, values)
      .then(({ data }) => onFinishConfirmation(data))
      .finally(() => setSubmitting(false));
  };

  return (
    <Modal
      title="Konfirmasi Verifikasi Pesyaratan"
      okText={'Selesai'}
      okButtonProps={{
        loading: submitting,
      }}
      visible={visible}
      onCancel={onCancel}
      onOk={() => form.submit()}
    >
      <div className="space-y-1">
        <Row>
          <span>Dokumen Surat Lahan</span>
          <a
            className="text-gray-500 rounded-full px-3 py-[2px] bg-white text-xs"
            target="_blank"
            href={pesanan?.persyaratan.dokumen_surat_lahan.url}
            rel="noreferrer"
          >
            {pesanan?.persyaratan.dokumen_surat_lahan.name} <LinkOutlined />
          </a>
        </Row>
        <Row>
          <span>Dokumen Surat Pernyataan</span>
          <a
            className="text-gray-500 rounded-full px-3 py-[2px] bg-white text-xs"
            target="_blank"
            href={pesanan?.persyaratan.dokumen_surat_pernyataan.url}
            rel="noreferrer"
          >
            {pesanan?.persyaratan.dokumen_surat_pernyataan.name} <LinkOutlined />
          </a>
        </Row>
        <Row>
          <span>Dokumen KTP</span>
          <a
            className="text-gray-500 rounded-full px-3 py-[2px] bg-white text-xs"
            target="_blank"
            href={pesanan?.persyaratan.dokumen_ktp.url}
            rel="noreferrer"
          >
            {pesanan?.persyaratan.dokumen_ktp.name} <LinkOutlined />
          </a>
        </Row>
      </div>
      <hr className="my-5" />
      <b>Alamat Kebun</b>
      <p className="mb-0">{pesanan?.persyaratan.alamat_lengkap}</p>
      <hr className="my-3" />
      <Form form={form} onFinish={handleSubmitKonfirmasi} layout="vertical">
        <Form.Item
          label="Status Verifikasi"
          name={'status_verifikasi'}
          rules={[{ required: true, message: 'Status verifikasi dibutuhkan' }]}
        >
          <Select
            size="large"
            allowClear
            onChange={setStatusVerifikasi}
            className="w-full"
          >
            <Select.Option value={'LULUS'}>LULUS</Select.Option>
            <Select.Option value={'TIDAK-LULUS'}>TIDAK LULUS</Select.Option>
          </Select>
        </Form.Item>
        {statusVerifikasi === 'TIDAK-LULUS' && (
          <Form.Item
            label="Informasi"
            name={'informasi_penolakan'}
            rules={[{ required: true, message: 'Informasi dibutuhkan' }]}
          >
            <Input.TextArea />
          </Form.Item>
        )}
        {statusVerifikasi === 'TIDAK-LULUS' && (
          <Form.Item
            initialValue={false}
            valuePropName="checked"
            name={'batalkan_pesanan'}
          >
            <Checkbox defaultChecked={false}>Batalkan Pesanan</Checkbox>
          </Form.Item>
        )}
      </Form>
    </Modal>
  );
}
