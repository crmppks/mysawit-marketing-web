import { useAppSelector } from '@/hooks/redux_hooks';
import { postUploadFile } from '@/services/chat';
import ChatRoom from '@/types/chat/ChatRoom';
import {
  FileOutlined,
  SendOutlined,
  // ShoppingOutlined,
  StarOutlined,
} from '@ant-design/icons';
import { Button, Dropdown, Input, Menu, message as antdMessage } from 'antd';
import { RcFile, UploadFile } from 'antd/lib/upload/interface';
import {
  Firestore,
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
import { useState } from 'react';
import Produk from '@/types/Produk';
import AttachFileComponent from './attachments/AttachFile';
import AttachProductComponent from './attachments/AttachProduct';

interface Props {
  firestore: Firestore;
  containerRef: any;
  rooms: ChatRoom[];
  selectedRoom: ChatRoom;
  onRoomGone: () => void;
}

export default function ChatComposer({
  firestore,
  containerRef,
  rooms,
  selectedRoom,
  onRoomGone,
}: Props) {
  const my_id = useAppSelector((state) => state.sesi.user.user_id);
  const [message, setMessage] = useState<string>('');
  const [uploading, setUploading] = useState<boolean>(false);
  const [attachmentFile, setAttachmentFile] = useState<UploadFile>(null);
  const [attachmentProduct, setAttachmentProduct] = useState<Produk>(null);
  const [attachingType, setAttachingType] = useState<'FILE' | 'PRODUCT' | 'ORDER'>(null);

  const handleSendMessage = async () => {
    if (
      message ||
      (attachingType === 'FILE' && attachmentFile) ||
      (attachingType === 'PRODUCT' && attachmentProduct)
    ) {
      const messageDoc: any = {
        type: 'MESSAGE',
        message,
        user_id: my_id,
        created_at: serverTimestamp(),
      };

      if (!rooms.find((item) => item.id === selectedRoom.id)) {
        antdMessage.warning(
          'Percakapan ini telah dihapus, anda tidak dapat lagi mengirimkan pesan',
        );
        onRoomGone();
        return;
      }

      if (attachmentFile) {
        setUploading(true);

        const formData = new FormData();
        formData.append('file', attachmentFile as RcFile);

        const response = await postUploadFile(formData);
        messageDoc.attachment = {
          type: 'FILE',
          file: {
            name: attachmentFile.name,
            mime: attachmentFile.type,
            ...response.data,
          },
        };

        setUploading(false);
      }

      if (attachmentProduct) {
        messageDoc.attachment = {
          type: 'PRODUCT',
          product: {
            id: attachmentProduct.id,
            nama: attachmentProduct.nama,
            banner: attachmentProduct.banner,
            slug: attachmentProduct.slug,
          },
        };
      }

      await addDoc(
        collection(
          doc(firestore, process.env.REACT_APP_CHAT_COLLECTION, selectedRoom.id),
          'messages',
        ),
        messageDoc,
      );

      setMessage('');
      setAttachingType(null);
      setAttachmentFile(null);
      setAttachmentProduct(null);

      updateDoc(doc(firestore, process.env.REACT_APP_CHAT_COLLECTION, selectedRoom.id), {
        updated_at: serverTimestamp(),
        last_sender: {
          user_id: my_id,
          message: message ? message : messageDoc.attachment.type,
          is_attachment: messageDoc.attachment ? true : false,
        },
      });
    }
  };

  const otherPersonId: any = () => {
    if (selectedRoom) {
      if (!selectedRoom.is_group) {
        return selectedRoom.user_ids.find((item) => item !== my_id);
      }
      return selectedRoom.user_ids.filter((item) => item !== my_id);
    }
    return null;
  };

  if (selectedRoom.deleted_by?.includes(otherPersonId(selectedRoom))) {
    return (
      <div ref={containerRef} className="flex space-x-5 items-end bg-gray-300 py-3 px-5">
        <p className="text-center flex-grow mb-0 px-5">
          Percakapan ini telah dihapus oleh{' '}
          <strong>{selectedRoom.title[otherPersonId()]}</strong>. Silahkan hapus
          percakapan ini dan mulai percakapan baru.
        </p>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="flex space-x-5 items-end bg-gray-300 py-3 px-5">
      <Dropdown
        arrow
        placement="topLeft"
        overlay={
          <Menu>
            <Menu.Item
              key={'file-upload'}
              icon={<FileOutlined />}
              onClick={() => setAttachingType('FILE')}
            >
              Unggah File
            </Menu.Item>
            <Menu.Item
              key={'product-attach'}
              icon={<StarOutlined />}
              onClick={() => setAttachingType('PRODUCT')}
            >
              Tautkan Produk
            </Menu.Item>
            {/* <Menu.Item
              key={'order-attach'}
              icon={<ShoppingOutlined />}
              onClick={() => setAttachingType('ORDER')}
            >
              Tautkan Pesanan
            </Menu.Item> */}
          </Menu>
        }
        trigger={['click']}
      >
        <button className="text-lg">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-6 h-6"
          >
            <path
              fillRule="evenodd"
              d="M18.97 3.659a2.25 2.25 0 00-3.182 0l-10.94 10.94a3.75 3.75 0 105.304 5.303l7.693-7.693a.75.75 0 011.06 1.06l-7.693 7.693a5.25 5.25 0 11-7.424-7.424l10.939-10.94a3.75 3.75 0 115.303 5.304L9.097 18.835l-.008.008-.007.007-.002.002-.003.002A2.25 2.25 0 015.91 15.66l7.81-7.81a.75.75 0 011.061 1.06l-7.81 7.81a.75.75 0 001.054 1.068L18.97 6.84a2.25 2.25 0 000-3.182z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </Dropdown>

      <div className="flex-1">
        {attachingType === 'FILE' && (
          <AttachFileComponent
            uploading={uploading}
            onClose={() => setAttachingType(null)}
            onFileChange={setAttachmentFile}
          />
        )}
        {attachingType === 'PRODUCT' && (
          <AttachProductComponent
            onClose={() => setAttachingType(null)}
            onProductSelected={setAttachmentProduct}
          />
        )}
        <Input
          autoFocus
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              handleSendMessage();
            }
          }}
          placeholder="Tulis pesan"
          className="w-full"
          size="large"
        />
      </div>

      <Button
        disabled={
          !message &&
          !(attachingType === 'FILE' && attachmentFile) &&
          !(attachingType === 'PRODUCT' && attachmentProduct)
        }
        loading={uploading}
        type="primary"
        size="large"
        icon={<SendOutlined />}
        onClick={() => handleSendMessage()}
      >
        Kirim
      </Button>
    </div>
  );
}
