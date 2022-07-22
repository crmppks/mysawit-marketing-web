import { beforeUpload, parseError } from '@/helpers/form_helper';
import { postAktifkanPopup, postTambahPopup, putUpdatePopup } from '@/services/popup';
import Popup from '@/types/Popup';
import { FileImageOutlined } from '@ant-design/icons';
import { DatePicker, Form, Input, Modal, ModalProps, Switch, Upload } from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';

export interface ModalPopupItem {
  tipe: 'EDIT' | 'TAMBAH' | 'AKTIFASI';
  item?: Popup;
}

interface Props extends ModalProps {
  modalItem?: ModalPopupItem | null;
  onCancel: () => void;
  onFinishAdd: (item: Popup) => void;
  onFinishUpdate: (item: Popup) => void;
}

export default function ModalPopup({
  modalItem,
  visible,
  onCancel,
  onFinishAdd,
  onFinishUpdate,
}: Props) {
  const [form] = Form.useForm();

  const [isAktif, setIsAktif] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (visible && modalItem?.item) {
      form.setFieldsValue({
        ...modalItem.item,
        image: [
          {
            uid: modalItem.item.id,
            name: 'Banner Image',
            status: 'done',
            url: modalItem.item.image,
          },
        ],
        ...(modalItem.item.is_aktif
          ? {
              tgl_berakhir: modalItem.item.tgl_berakhir
                ? moment(modalItem.item.tgl_berakhir)
                : undefined,
            }
          : { tgl_berakhir: undefined }),
      });
      setIsAktif(modalItem.item.is_aktif);
    }
    if (!visible || !modalItem?.item) {
      form.resetFields();
      setIsAktif(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  return (
    <Modal
      title={`${
        modalItem?.tipe === 'TAMBAH'
          ? 'Tambah'
          : modalItem?.tipe === 'AKTIFASI'
          ? 'Aktifasi'
          : 'Edit'
      } Popup`}
      confirmLoading={loading}
      visible={visible}
      okText={modalItem?.tipe === 'AKTIFASI' ? 'Aktifkan' : 'Simpan'}
      cancelText="Batal"
      onOk={() => form.submit()}
      onCancel={onCancel}
    >
      <Form
        form={form}
        initialValues={{
          is_aktif: false,
        }}
        onFinish={(values) => {
          const formData = new FormData();

          for (const item in values) {
            if (item === 'image') {
              if (!values[item][0].originFileObj) continue;
              formData.append(item, values[item][0].originFileObj);
            } else {
              if (item === 'is_aktif') {
                formData.append(item, values[item] ? '1' : '0');
                continue;
              }
              if (!values[item]) continue;
              formData.append(item, values[item]);
            }
          }

          setLoading(true);
          if (modalItem?.tipe === 'TAMBAH') {
            postTambahPopup(formData)
              .then(({ data }) => {
                onFinishAdd(data);
                onCancel();
              })
              .catch((e) => parseError(form, e))
              .finally(() => setLoading(false));
          }
          if (modalItem?.tipe === 'EDIT') {
            formData.append('_method', 'PUT');
            putUpdatePopup(modalItem?.item?.id!, formData)
              .then(({ data }) => {
                onFinishUpdate(data);
                onCancel();
              })
              .catch((e) => parseError(form, e))
              .finally(() => setLoading(false));
          }
          if (modalItem?.tipe === 'AKTIFASI') {
            postAktifkanPopup(modalItem?.item?.id!, formData)
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
        {modalItem?.tipe !== 'AKTIFASI' && (
          <>
            <div className="flex justify-between">
              <Form.Item
                name="image"
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
                rules={[{ required: true, message: 'File image popup dibutuhkan' }]}
              >
                <Upload
                  name="banner"
                  beforeUpload={(file) =>
                    beforeUpload(file, ['image/jpeg', 'image/png'], 3)
                  }
                  listType="picture-card"
                >
                  <FileImageOutlined />
                </Upload>
              </Form.Item>
              <Form.Item
                name="is_aktif"
                rules={[{ required: true, message: 'Status dibutuhkan' }]}
              >
                <Switch
                  checked={isAktif}
                  checkedChildren="Aktif"
                  unCheckedChildren="Tidak Aktif"
                  onChange={setIsAktif}
                />
              </Form.Item>
            </div>
            <Form.Item
              name="judul"
              label="Judul"
              rules={[{ required: true, message: 'Judul dibutuhkan' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="link"
              label="Link Tujuan"
              rules={[{ type: 'url', message: 'Format link tidak valid' }]}
            >
              <Input />
            </Form.Item>
          </>
        )}
        {(isAktif || modalItem?.tipe === 'AKTIFASI') && (
          <Form.Item
            name="tgl_berakhir"
            label="Aktif Hingga"
            rules={[{ required: true, message: 'Tgl berakhir dibutuhkan' }]}
          >
            <DatePicker
              showToday={false}
              disabledDate={(date) => date.isBefore(moment())}
              className="w-full"
            />
          </Form.Item>
        )}
      </Form>
    </Modal>
  );
}
