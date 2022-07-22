import { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { Pagination, Alert } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface Props {
  file: {
    name: string;
    url: string;
    type: string;
  };
}

export default function FilePdfRenderComponent({ file }: Props) {
  const [numPages, setNumPages] = useState<any>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pageScale, setPageScale] = useState<number>(1.0);
  const [pageRotation] = useState<number>(0);

  const onDocumentLoadSuccess = ({ numPages: pages }: any) => {
    setNumPages(pages);
  };

  return (
    <div className="border rounded p-5">
      <div className="flex items-center justify-end space-x-3 mb-5">
        <button
          onClick={() => setPageScale((o) => o + 0.1)}
          className="bg-gray-300 rounded px-3 py-1"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
            />
          </svg>
        </button>
        <button
          onClick={() => setPageScale((o) => o - 0.1)}
          className="bg-gray-300 rounded px-3 py-1"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7"
            />
          </svg>
        </button>
      </div>
      <div className="overflow-x-auto overflow-y-hidden -mx-6 flex flex-col items-center justify-center">
        <Document
          // renderMode='canvas'
          className={`flex items-center space-x-2 justify-center overflow-visible`}
          file={file.url}
          loading={
            <div className="text-center p-10">
              Loading document <LoadingOutlined className="text-2xl ml-2" />
            </div>
          }
          error={
            <Alert type="error" className="w-full" message="Failed to load PDF file." />
          }
          noData={
            <Alert type="error" className="w-full" message="No PDF file specified." />
          }
          onLoadSuccess={onDocumentLoadSuccess}
        >
          <Page
            rotate={pageRotation}
            scale={pageScale}
            loading={
              <div className="text-center p-10">
                Loading page <LoadingOutlined className="text-2xl ml-2" />
              </div>
            }
            pageNumber={pageNumber}
          />
        </Document>

        {numPages && (
          <div className="flex justify-center items-center p-5 -mb-3">
            <Pagination
              onChange={(page) => setPageNumber(page)}
              pageSize={1}
              showSizeChanger={false}
              current={pageNumber}
              total={numPages}
            />
          </div>
        )}
      </div>
    </div>
  );
}
