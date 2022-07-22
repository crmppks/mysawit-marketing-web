import { parseError } from '@/helpers/form_helper';
import Kategori from '@/types/Kategori';
import { Cascader, Form, Input, Modal, ModalProps, Switch } from 'antd';
import { AxiosResponse } from 'axios';
import { useEffect, useState } from 'react';

export interface ModalKategoriItem {
  tipe: 'EDIT' | 'TAMBAH';
  item?: Kategori;
}

interface Props extends ModalProps {
  kategoriItem: ModalKategoriItem | null;
  visible: boolean;
  tipe: string;
  onCancel: () => void;
  onFinishAdd: (item: Kategori) => void;
  onFinishUpdate: (item: Kategori) => void;
  getCascaderAction: () => Promise<AxiosResponse<any, any>>;
  postAddAction: (params: any) => Promise<AxiosResponse<any, any>>;
  putUpdateAction: (kategori_id: string, params: any) => Promise<AxiosResponse<any, any>>;
}

export default function ModalKategori({
  kategoriItem,
  visible,
  tipe,
  onCancel,
  onFinishAdd,
  onFinishUpdate,
  getCascaderAction,
  postAddAction,
  putUpdateAction,
}: Props) {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [kategoriKonsumen, setKategoriKonsumen] = useState<Array<any>>([]);
  const [isSubKategori, setIsSubKategori] = useState<boolean | undefined>(false);

  useEffect(() => {
    if (visible && kategoriItem?.item) {
      form.setFieldsValue({
        ...kategoriItem.item,
        parent_id: kategoriItem.item.parent_cascader,
      });
    }
    if (!visible || !kategoriItem?.item) {
      form.resetFields();
    }
    if (visible) {
      getCascaderAction().then(({ data }) => setKategoriKonsumen(data));
    }
    setIsSubKategori(
      kategoriItem?.item?.parent_cascader &&
        kategoriItem?.item?.parent_cascader.length > 0,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  return (
    <Modal
      title={`${kategoriItem?.tipe === 'TAMBAH' ? 'Tambah' : 'Edit'} Kategori ${tipe}`}
      confirmLoading={submitting}
      visible={visible}
      okText="Simpan"
      cancelText="Batal"
      onOk={() => form.submit()}
      onCancel={onCancel}
    >
      <Form
        form={form}
        onFinish={(values) => {
          setSubmitting(true);
          if (kategoriItem?.tipe === 'TAMBAH') {
            postAddAction({
              ...values,
              parent_id: values.parent_id
                ? values.parent_id[values.parent_id.length - 1]
                : null,
            })
              .then(({ data }) => {
                onFinishAdd(data);
                onCancel();
                getCascaderAction().then(({ data }) => setKategoriKonsumen(data));
              })
              .catch((e) => parseError(form, e))
              .finally(() => setSubmitting(false));
          } else {
            putUpdateAction(kategoriItem?.item?.id!, {
              ...values,
              parent_id: values.parent_id
                ? values.parent_id[values.parent_id.length - 1]
                : null,
            })
              .then(({ data }) => {
                onFinishUpdate(data);
                onCancel();
                getCascaderAction().then(({ data }) => setKategoriKonsumen(data));
              })
              .catch((e) => parseError(form, e))
              .finally(() => setSubmitting(false));
          }
        }}
        layout={'vertical'}
      >
        <div className={`flex justify-end`}>
          <Switch
            checked={isSubKategori}
            onChange={setIsSubKategori}
            checkedChildren="Merupakan Sub-Kategori"
            unCheckedChildren="Bukan Sub-Kategori"
          />
        </div>
        {isSubKategori && (
          <Form.Item
            name="parent_id"
            label="Kategori Induk"
            rules={[{ required: true, message: 'Kategori induk dibutuhkan' }]}
          >
            <Cascader
              options={kategoriKonsumen}
              changeOnSelect
              fieldNames={{ label: 'nama', value: 'id', children: 'sub_kategori' }}
              expandTrigger="hover"
              displayRender={(label) => label[label.length - 1]}
            />
          </Form.Item>
        )}
        <Form.Item
          name="nama"
          label="Nama Kategori"
          rules={[{ required: true, message: 'Nama kategori dibutuhkan' }]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
}
