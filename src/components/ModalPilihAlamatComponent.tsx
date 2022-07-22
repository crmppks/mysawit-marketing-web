import { getAlamatKotaKabupaten, getAlamatProvinsi } from '@/services/enums';
import { Form, Input, message, Modal, ModalProps, Select } from 'antd';
import { useEffect, useState } from 'react';

export interface Alamat {
  detail: string;
  kecamatan: string;
  kota_kabupaten: {
    id: number;
    nama: string;
  };
  provinsi: {
    id: number;
    nama: string;
    tipe: string;
  };
}

interface Props extends ModalProps {
  onSuccess: (alamat: Alamat) => void;
  onCancel: () => void;
}

export default function ModalPilihAlamat({ visible, onCancel, onSuccess }: Props) {
  const [form] = Form.useForm();

  const [provinsi, setProvinsi] = useState<{
    loading: boolean;
    data: any[];
    selected?: any;
  }>({ loading: false, data: [] });
  const [kotaKabupaten, setKotaKabupaten] = useState<{
    loading: boolean;
    data: any[];
  }>({ loading: false, data: [] });

  useEffect(() => {
    if (visible) {
      setProvinsi((old) => ({ ...old, loading: true }));
      getAlamatProvinsi()
        .then(({ data }) => setProvinsi((old) => ({ ...old, data })))
        .finally(() => setProvinsi((old) => ({ ...old, loading: false })));
    }
  }, [visible]);

  useEffect(() => {
    if (visible && provinsi.selected) {
      setKotaKabupaten((old) => ({ ...old, loading: true }));
      getAlamatKotaKabupaten(provinsi.selected)
        .then(({ data }) => setKotaKabupaten((old) => ({ ...old, data })))
        .finally(() => setKotaKabupaten((old) => ({ ...old, loading: false })));
    }
  }, [visible, provinsi?.selected]);

  return (
    <Modal
      title="Pilih Alamat"
      visible={visible}
      onOk={() => form.submit()}
      onCancel={onCancel}
    >
      <Form
        form={form}
        onFinish={(values) => {
          values.kota_kabupaten = kotaKabupaten.data.find(
            (item) => item.id === values.kota_kabupaten,
          );
          values.provinsi = provinsi.data.find((item) => item.id === values.provinsi);
          onSuccess(values);
          onCancel();
        }}
        onFinishFailed={() => message.warning('Periksa kembali data anda')}
        layout="vertical"
      >
        <Form.Item
          name={'provinsi'}
          label="Provinsi"
          rules={[{ required: true, message: 'Mohon pilih provinsi' }]}
        >
          <Select
            loading={provinsi.loading}
            allowClear
            onChange={(value) => {
              setProvinsi((old) => ({ ...old, selected: value }));
              form.setFieldsValue({
                kota: undefined,
              });
            }}
          >
            {provinsi.data.map((prov) => (
              <Select.Option value={prov.id} key={prov.nama}>
                {prov.nama}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name={'kota_kabupaten'}
          label="Kota/Kabupaten"
          rules={[{ required: true, message: 'Mohon pilih kota/kabupaten' }]}
        >
          <Select loading={kotaKabupaten.loading} allowClear>
            {kotaKabupaten.data.map((kota) => (
              <Select.Option value={kota.id} key={kota.id}>
                {kota.nama}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name={'kecamatan'}
          label="Kecamatan"
          rules={[{ required: true, message: 'Mohon isi kecamatan' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name={'detail'}
          label="Detail Alamat"
          rules={[{ required: true, message: 'Mohon isi detail alamat' }]}
        >
          <Input.TextArea placeholder="Keterangan tambahan seperti nama desa, nama jalan dll" />
        </Form.Item>
      </Form>
    </Modal>
  );
}
