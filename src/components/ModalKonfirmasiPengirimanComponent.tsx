import { postConfirmPesananShipment } from '@/services/pesanan';
import Pesanan from '@/types/Pesanan';
import { Checkbox, DatePicker, Form, Input, Modal, ModalProps, Select } from 'antd';
import moment from 'moment';
import { useState } from 'react';

interface Props extends ModalProps {
  pesanan: Pesanan;
  onFinish: (pesanan: Pesanan) => void;
}

export default function ModalAturPengiriman({
  visible,
  pesanan,
  title = 'Atur Pengiriman Pesanan',
  onCancel,
  onFinish,
}: Props) {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [satuan_durasi, set_satuan_durasi] = useState<'BULAN' | 'HARI'>(
    pesanan.is_pengiriman_editable
      ? pesanan.informasi_pengiriman.duration.estimation_unit
      : 'BULAN',
  );
  const [mulai_hari_ini, set_mulai_hari_ini] = useState<boolean>(
    pesanan.is_pengiriman_editable ? false : true,
  );

  const handleSubmit = (values: any) => {
    setSubmitting(true);
    postConfirmPesananShipment(pesanan.id, {
      ...values,
      satuan_durasi,
      mulai_hari_ini: values.mulai_hari_ini ? 1 : 0,
    })
      .then(({ data }) => {
        onFinish(data);
        form.resetFields();
      })
      .finally(() => setSubmitting(false));
  };

  return (
    <Modal
      title={title}
      visible={visible}
      okText="Simpan"
      okButtonProps={{
        loading: submitting,
      }}
      onOk={() => form.submit()}
      onCancel={onCancel}
    >
      <Form
        onFinish={handleSubmit}
        form={form}
        layout="vertical"
        initialValues={
          pesanan.is_pengiriman_editable
            ? {
                nomor_resi: pesanan.nomor_resi,
                durasi: pesanan.informasi_pengiriman.duration.estimation,
                mulai_dari: moment(pesanan.informasi_pengiriman.duration.date_from),
              }
            : null
        }
      >
        <Form.Item label="Nomor Resi" name={'nomor_resi'}>
          <Input size="large" />
        </Form.Item>
        <Form.Item
          label="Durasi Pengiriman"
          name={'durasi'}
          rules={[
            { required: true, message: 'Durasi pengiriman dibutuhkan' },
            { pattern: /^([0-9])*$/, message: 'Durasi harus berupa angka' },
          ]}
        >
          <Input
            size="large"
            addonAfter={
              <Select value={satuan_durasi} onChange={set_satuan_durasi}>
                <Select.Option value="BULAN">Bulan</Select.Option>
                <Select.Option value="HARI">Hari</Select.Option>
              </Select>
            }
          />
        </Form.Item>
        {!mulai_hari_ini && (
          <Form.Item
            label="Terhitung Mulai"
            name={'mulai_dari'}
            rules={[{ required: true, message: 'Tanggal mulai terhitung dibutuhkan' }]}
          >
            <DatePicker
              size="large"
              className="w-full"
              disabled={pesanan.is_pengiriman_editable}
              disabledDate={(date) => date.isBefore(moment())}
            />
          </Form.Item>
        )}
        {!pesanan.is_pengiriman_editable && (
          <Form.Item
            initialValue={mulai_hari_ini}
            valuePropName="checked"
            name={'mulai_hari_ini'}
          >
            <Checkbox
              checked={mulai_hari_ini}
              onChange={(e) => set_mulai_hari_ini(e.target.checked)}
            >
              <span className="text-gray-500">Terhitung dari hari ini</span>
            </Checkbox>
          </Form.Item>
        )}
      </Form>
    </Modal>
  );
}
