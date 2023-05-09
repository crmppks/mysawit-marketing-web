import { LoadingOutlined } from '@ant-design/icons';
import { Upload } from 'antd';
import { UploadFile } from 'antd/lib/upload/interface';
import { useEffect, useState } from 'react';

interface Props {
  uploading: boolean;
  onFileChange: (file: UploadFile) => void;
}

const acceptedFileTypes = ['image/jpeg', 'image/png', 'application/pdf'];

export default function AttachFileComponent({ uploading, onFileChange }: Props) {
  const [attachmentFileList, setAttachmentFileList] = useState<UploadFile[]>([]);

  useEffect(() => {
    if (attachmentFileList.length > 0) {
      onFileChange(attachmentFileList[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attachmentFileList]);

  return (
    <div className="relative bg-white rounded p-5 mb-1 border no-ant-form-item-margin">
      {uploading && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
          <LoadingOutlined className="text-xl" />
        </div>
      )}

      <Upload.Dragger
        fileList={attachmentFileList}
        accept={acceptedFileTypes.join(', ')}
        onRemove={(file) => {
          setAttachmentFileList([]);
        }}
        beforeUpload={(file) => {
          setAttachmentFileList([file]);
          return false;
        }}
      >
        <div className="text-gray-400 flex space-x-3 items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-8 h-8"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"
            />
          </svg>

          <p className="text-gray-400">klik atau tarik file ke area ini</p>
        </div>
      </Upload.Dragger>
    </div>
  );
}
