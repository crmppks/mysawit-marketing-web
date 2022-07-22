import React, { useState } from 'react';
import { Avatar, Tooltip, Form, Input, Button, Popconfirm } from 'antd';
import DiskusiArtikel from '@/types/DiskusiArtikel';
import moment from 'moment';
import {
  deleteHapusKomentarArtikel,
  postSimpanKomentarArtikel,
} from '@/services/artikel';
import Artikel from '@/types/Artikel';
import { SendOutlined } from '@ant-design/icons';

interface Props {
  children?: React.ReactNode;
  item: DiskusiArtikel;
  artikel: Artikel;
  onDelete: (item: DiskusiArtikel) => void;
}

const Editor = ({
  onFinishSubmit,
  onCancel,
  artikel,
  item,
}: {
  onFinishSubmit: (item: DiskusiArtikel) => void;
  onCancel: () => void;
  artikel: Artikel;
  item: DiskusiArtikel;
}) => {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState<boolean>(false);

  const handleSubmitValue = (values: any) => {
    setSubmitting(true);
    postSimpanKomentarArtikel(artikel.id, {
      ...values,
      artikel_id: artikel.id,
      reply_to: item.id,
    })
      .then(({ data }) => onFinishSubmit(data))
      .finally(() => setSubmitting(false));
  };

  return (
    <div className="mt-5">
      <Form onFinish={handleSubmitValue} form={form}>
        <Form.Item
          name={'komentar'}
          rules={[{ required: true, message: 'Komentar dibutuhkan' }]}
        >
          <Input placeholder="Tulis komentar disini" />
        </Form.Item>
        <div className="flex items-center space-x-4">
          <Button
            htmlType="submit"
            loading={submitting}
            icon={<SendOutlined />}
            type="primary"
          >
            Kirim
          </Button>
          <button
            type="button"
            onClick={onCancel}
            className="font-semibold text-gray-400 hover:text-gray-500"
          >
            Batal
          </button>
        </div>
      </Form>
    </div>
  );
};

export default function KomentarArtikel({ artikel, item: defaultItem, onDelete }: Props) {
  const [item, setItem] = useState<DiskusiArtikel>(defaultItem);
  const [commenting, setCommenting] = useState<boolean>(false);

  const handleHapusTanggapan = () => {
    deleteHapusKomentarArtikel(item.artikel_id, item.id).then(() => onDelete(item));
  };

  return (
    <div className="flex space-x-5 mb-5">
      <div className="flex-none">
        <Avatar size={'large'} src={item.user.avatar} alt={item.user.nama} />
      </div>
      <div className="flex-grow">
        <p className="flex items-center space-x-3 mb-0">
          <span className="font-semibold">{item.user.nama}</span>
          <Tooltip title={moment(item.created_at).format('DD MMMM yyyy, HH:mm')}>
            <span className="text-xs text-gray-400">
              {moment(new Date(item.created_at)).fromNow()}
            </span>
          </Tooltip>
        </p>
        <p className="mb-1">{item.komentar}</p>

        <div className="flex space-x-5 items-center">
          <button
            className="text-gray-400 hover:text-gray-500 font-semibold"
            onClick={() => setCommenting(true)}
            key={'aksi-tanggapi'}
          >
            Balas
          </button>
          <Popconfirm
            title="Hapus komentar ini?"
            placement="rightTop"
            onConfirm={handleHapusTanggapan}
            okButtonProps={{
              danger: true,
            }}
            okText="Ya"
            cancelText="Batal"
          >
            <button className="text-red-500 font-semibold" key={'aksi-hapus'}>
              Hapus
            </button>
          </Popconfirm>
        </div>

        {commenting && (
          <Editor
            item={item}
            artikel={artikel}
            onCancel={() => setCommenting(false)}
            onFinishSubmit={(komentar) => {
              setItem(komentar);
              setCommenting(false);
            }}
          />
        )}
        {item.sub_komentar.length > 0 && (
          <div className="mt-5">
            {item.sub_komentar.map((sub) => (
              <KomentarArtikel
                key={item.id}
                artikel={artikel}
                item={sub}
                onDelete={(deleted) =>
                  setItem((old) => ({
                    ...old,
                    sub_komentar: old.sub_komentar.filter((k) => k.id !== deleted.id),
                  }))
                }
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
