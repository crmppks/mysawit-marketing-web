import FilePdfRenderComponent from '@/components/FilePDFRenderComponent';
import ModalSuratPernyataan from '@/components/ModalSuratPernyataanComponent';
import { FileAddFilled } from '@ant-design/icons';
import { Button, PageHeader } from 'antd';
import { useState } from 'react';

export default function HalamanSuratPernyataan() {
  const [url, setUrl] = useState<string>(
    `${
      process.env.REACT_APP_BASE_URL
    }/public/pdf/surat-pernyataan-konsumen.pdf?date=${new Date().getTime()}`,
  );
  const [showUpload, setShowUpload] = useState<boolean>(false);

  return (
    <>
      <ModalSuratPernyataan
        visible={showUpload}
        onCancel={() => setShowUpload(false)}
        onFinishUpload={() => {
          setUrl(
            `${
              process.env.REACT_APP_BASE_URL
            }/public/pdf/surat-pernyataan-konsumen.pdf?date=${new Date().getTime()}`,
          );
          setShowUpload(false);
        }}
      />
      <div className="md:pr-5 flex flex-col md:space-x-5 md:flex-row md:items-center md:justify-between">
        <PageHeader
          title="Surat Pernyataan Konsumen"
          subTitle="Draft file untuk surat pernyataan konsumen saat melakukan pembelian produk."
        />
        <Button
          className="mx-5 md:mx-0"
          type="primary"
          icon={<FileAddFilled />}
          onClick={() => setShowUpload(true)}
        >
          Perbaharui File
        </Button>
      </div>
      <section className="p-5">
        <FilePdfRenderComponent
          file={{
            url: url,
            name: 'Surat Pernyataan Konsumen',
            type: 'application/pdf',
          }}
        />
      </section>
    </>
  );
}
