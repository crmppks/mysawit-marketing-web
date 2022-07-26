import { Checkbox, DatePicker, Form, Input, Modal, ModalProps, Select } from 'antd';
import moment from 'moment';
import { useState } from 'react';

interface Props extends ModalProps {}

export default function ModalAturPengiriman({
  visible,
  title = 'Atur Pengiriman Pesanan',
  onCancel,
}: Props) {
  const [form] = Form.useForm();
  const [satuan_durasi, set_satuan_durasi] = useState<'BULAN' | 'HARI'>('BULAN');
  const [mulai_hari_ini, set_mulai_hari_ini] = useState<boolean>(true);

  const handleSubmit = (values: any) => {
    const payload = {
      ...values,
      satuan_durasi,
    };
    console.log(payload);
  };

  return (
    <Modal
      title={title}
      visible={visible}
      okText="Selesai"
      onOk={() => form.submit()}
      onCancel={onCancel}
    >
      <Form onFinish={handleSubmit} form={form} layout="vertical">
        <Form.Item
          label="Durasi Pengiriman"
          name={'durasi'}
          rules={[
            { required: true, message: 'Durasi pengiriman dibutuhkan' },
            { pattern: /^([0-9])*$/, message: 'Durasi harus berupa angka' },
          ]}
        >
          <Input
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
              className="w-full"
              disabledDate={(date) => date.isBefore(moment())}
            />
          </Form.Item>
        )}
        <Form.Item
          initialValue={mulai_hari_ini}
          valuePropName="checked"
          name={'mulai_hari_ini'}
        >
          <Checkbox
            checked={mulai_hari_ini}
            onChange={(e) => set_mulai_hari_ini(e.target.checked)}
          >
            <span>Terhitung mulai hari ini</span>
          </Checkbox>
        </Form.Item>
      </Form>
    </Modal>
  );
}
