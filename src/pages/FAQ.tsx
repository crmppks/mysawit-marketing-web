// Require Editor JS files.
import 'froala-editor/js/plugins.pkgd.min.js';
import 'froala-editor/js/froala_editor.pkgd.min.js';

// Require Editor CSS files.
import 'froala-editor/css/froala_style.min.css';
import 'froala-editor/css/froala_editor.pkgd.min.css';

// Require Font Awesome.
import 'font-awesome/css/font-awesome.css';
import FroalaEditor from 'react-froala-wysiwyg';

import React, { useState, useEffect } from 'react';
import { Skeleton, PageHeader, Modal, Form, Input, Button, Collapse, Empty } from 'antd';
import { confirmAlert } from '@/helpers/swal_helper';
import { getSemuaFAQ, putUpdateFAQ, postTambahFAQ, deleteFAQ } from '@/services/faq';
import { PlusOutlined } from '@ant-design/icons';
import { froalaConfig } from '@/helpers/froala_helper';

export default function HalamanFAQ() {
  const [form] = Form.useForm();

  const [jawaban, setJawaban] = useState<string>('');
  const [modalItem, setModalItem] = useState<{
    visible: boolean;
    type: 'EDIT' | 'ADD';
    item_id?: number;
    submitting?: boolean;
  }>({
    visible: false,
    type: 'ADD',
  });
  const [faqs, setFaqs] = useState<{
    loading: boolean;
    data: Array<{
      id: number;
      pertanyaan: string;
      jawaban: string;
    }>;
  }>({ loading: true, data: [] });

  const handleDelete = (id: number) => {
    confirmAlert(
      'Hapus Pertanyaan',
      'Apakah anda yakin ingin menghapus pertanyaan ini?',
    ).then((willDelete: boolean) => {
      if (willDelete) {
        deleteFAQ(id).then(() => {
          setFaqs((old) => ({
            ...old,
            data: old.data.filter((item) => item.id !== id),
          }));
        });
      }
    });
  };

  useEffect(() => {
    if (modalItem.visible && modalItem.item_id) {
      const faq = faqs.data.find((item) => item.id === modalItem.item_id);
      form.setFieldsValue(faq);
      setJawaban(faq?.jawaban!);
    } else {
      form.resetFields();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalItem.visible]);

  useEffect(() => {
    getSemuaFAQ().then(({ data }) => setFaqs({ loading: false, data }));
  }, []);

  return (
    <React.Fragment>
      <Modal
        title={`${modalItem.type === 'ADD' ? 'Tambah' : 'Edit'} Pertanyaan`}
        confirmLoading={modalItem.submitting}
        visible={modalItem.visible}
        okText="Simpan"
        cancelText="Batal"
        onOk={() => form.submit()}
        onCancel={() => setModalItem((old) => ({ ...old, visible: false }))}
      >
        <Form
          form={form}
          onFinish={(values) => {
            setModalItem((old) => ({ ...old, submitting: true }));
            if (modalItem.type === 'ADD') {
              postTambahFAQ({ ...values, jawaban })
                .then(({ data }) => {
                  setFaqs((old) => ({
                    ...old,
                    data: [...old.data, data],
                  }));
                  setModalItem((old) => ({ ...old, visible: false, submitting: false }));
                })
                .catch(() => setModalItem((old) => ({ ...old, submitting: false })));
            } else {
              putUpdateFAQ(modalItem.item_id!, { ...values, jawaban })
                .then(() => {
                  setFaqs((old) => ({
                    ...old,
                    data: old.data.map((item) => {
                      if (item.id === modalItem.item_id) {
                        return {
                          ...values,
                          jawaban,
                          id: item.id,
                        };
                      }
                      return item;
                    }),
                  }));

                  setModalItem((old) => ({ ...old, visible: false, submitting: false }));
                })
                .catch(() => setModalItem((old) => ({ ...old, submitting: false })));
            }
          }}
          layout={'vertical'}
        >
          <Form.Item
            name="pertanyaan"
            label="Pertanyaan"
            rules={[{ required: true, message: 'Pertanyaan dibutuhkan' }]}
          >
            <Input.TextArea />
          </Form.Item>
          <FroalaEditor
            config={{
              ...froalaConfig,
              placeholderText: 'Jawaban',
              toolbarButtons: [
                'undo',
                'redo',
                'bold',
                'italic',
                'clearFormatting',
                '|',
                'formatOLSimple',
                'formatUL',
                '|',
                'insertLink',
                'insertVideo',
                'insertImage',
              ],
              height: 150,
            }}
            model={jawaban}
            onModelChange={(m: any) => setJawaban(m)}
          />
        </Form>
      </Modal>

      <div className="md:pr-5 flex flex-col md:space-x-5 md:flex-row md:items-center md:justify-between">
        <PageHeader title="F.A.Q" subTitle="Frequently Asked Questions" />
        <Button
          className="mx-5 md:mx-0"
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setModalItem((old) => ({ visible: true, type: 'ADD' }))}
        >
          Tambah Pertanyaan
        </Button>
      </div>

      <section className="p-5">
        {faqs.loading && <Skeleton paragraph active />}
        {!faqs.loading && (
          <>
            {faqs.data.length === 0 && (
              <Empty
                className="bg-white py-5 rounded"
                description={
                  <p className="text-gray-400">Belum ada pertanyaan tersedia</p>
                }
              />
            )}
            {faqs.data.length > 0 && (
              <Collapse accordion>
                {faqs.data.map((item) => (
                  <Collapse.Panel
                    extra={
                      <div className="space-x-2">
                        <button
                          onClick={(event) => {
                            event.stopPropagation();
                            setModalItem({
                              visible: true,
                              type: 'EDIT',
                              item_id: item.id,
                            });
                          }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={(event) => {
                            event.stopPropagation();
                            handleDelete(item.id);
                          }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    }
                    header={item.pertanyaan}
                    key={item.id}
                  >
                    <div
                      className="mb-0"
                      dangerouslySetInnerHTML={{ __html: item.jawaban }}
                    ></div>
                  </Collapse.Panel>
                ))}
              </Collapse>
            )}
          </>
        )}
      </section>
    </React.Fragment>
  );
}
