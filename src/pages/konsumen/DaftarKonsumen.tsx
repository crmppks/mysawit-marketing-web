import 'webix/webix.css';
import { Button, Pagination, PageHeader, Dropdown, Menu } from 'antd';
import React, { useState, useEffect, useRef } from 'react';
import * as webix from '@xbs/webix-pro';
import moment from 'moment';
import { Link, useNavigate } from 'react-router-dom';
import { getSemuaKategoriKonsumenOptions, getSemuaKonsumen } from '@/services/konsumen';
import UserKonsumen from '@/types/UserKonsumen';
import { webixTableParams } from '@/helpers/webix_helper';
import { MessageOutlined, MoreOutlined } from '@ant-design/icons';

export default function HalamanDaftarKonsumen() {
  const webixTableRef = useRef<any>();
  const uiTable = useRef<any>();

  const navigate = useNavigate();

  const [konsumen, setKonsumen] = useState<UserKonsumen | null>(null);
  const [page, setPage] = useState<{
    current: number;
    last: number;
    total: number;
    per_page: number;
  }>({ current: 1, last: 1, total: 1, per_page: 15 });

  useEffect(() => {
    uiTable.current = webix.ui(
      {
        rows: [
          {
            view: 'datatable',
            columns: [
              {
                id: 'kategori_konsumen_id',
                header: [{ text: 'Kategori' }, { content: 'serverMultiSelectFilter' }],
                minWidth: 250,
                options: async function () {
                  const { data } = await getSemuaKategoriKonsumenOptions();

                  return data;
                },
                template: function (o: any) {
                  return `<b>${o.kategori_konsumen?.nama ?? '-'}</b>`;
                },
              },
              {
                id: 'nama',
                header: [{ text: 'Nama' }, { content: 'serverFilter' }],
                minWidth: 250,
                fillspace: true,
                sort: 'string',
              },
              {
                id: 'username',
                header: [{ text: 'Username' }, { content: 'serverFilter' }],
                minWidth: 200,
              },
              {
                id: 'email',
                header: [{ text: 'Email' }, { content: 'serverFilter' }],
                minWidth: 250,
                sort: 'string',
              },
              {
                id: 'no_hp',
                header: [{ text: 'No. HP' }, { content: 'serverFilter' }],
                minWidth: 200,
              },
              {
                id: 'tgl_lahir',
                header: [{ text: 'Tgl Lahir' }, { content: 'dateRangeFilter' }],
                minWidth: 200,
                hidden: true,
                template: function (obj: any) {
                  return moment(obj.tgl_lahir).format('DD MMMM YYYY');
                },
              },
              {
                id: 'created_at',
                header: [{ text: 'Bergabung Pada' }, { content: 'dateRangeFilter' }],
                minWidth: 200,
                template: function (obj: any) {
                  return moment(obj.created_at).format('DD MMMM YYYY, HH:mm');
                },
              },
            ],
            scroll: true,
            autoheight: true,
            leftSplit: 1,
            // autowidth: true,
            select: true,
            // footer:true,
            // resizeColumn: true,
            url: async function (params: any) {
              try {
                const {
                  data: { data, current_page, last_page, total, per_page },
                } = await getSemuaKonsumen(webixTableParams(params), page.current);

                setPage((old) => ({
                  current: params ? old.current : current_page,
                  last: last_page,
                  total,
                  per_page,
                }));

                return data;
              } catch (e) {
                console.log(e);
                return [];
              }
            },
            on: {
              onAfterSelect: function (selection: any) {
                const item = (this as any).getItem(selection.id);
                setKonsumen(item);
              },
              onAfterUnSelect: function (selection: any) {
                setKonsumen(null);
              },
              onItemDblClick: function (selection: any) {
                const item = (this as any).getItem(selection.toString());
                navigate(item.user_id);
              },
            },
          },
        ],
      },
      webixTableRef.current,
    );

    return () => {
      setKonsumen(null);
      uiTable.current.destructor();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page.current]);

  // useEffect(() => {
  //   if (selectedKategori) {
  //     const childs = uiTable.current.getChildViews();
  //     if (childs) {
  //       childs[0].setState({
  //         ...childs[0].getState(),
  //         filter: {
  //           ...childs[0].getState().filter,
  //           kategori_konsumen_id: selectedKategori.id,
  //         },
  //       });
  //     }
  //   }
  // }, [selectedKategori]);

  return (
    <React.Fragment>
      <PageHeader
        className="site-page-header"
        title="Daftar Konsumen"
        subTitle="Daftar semua konsumen yang memilih anda sebagai Marketing Kecambah"
      />
      <div className="p-5 flex flex-col space-y-5 md:space-y-0 md:flex-row items-center justify-between">
        <Pagination
          onChange={(current) => setPage((old) => ({ ...old, current }))}
          defaultCurrent={page.current}
          total={page.total}
          pageSize={page.per_page}
          showSizeChanger={false}
        />

        <div className="flex space-x-2">
          <Button
            onClick={() => navigate(konsumen?.user_id!)}
            disabled={!konsumen}
            type="primary"
          >
            Lihat Detail
          </Button>
          <Dropdown
            disabled={!konsumen}
            arrow
            overlay={
              <Menu>
                <Menu.Item icon={<MessageOutlined />}>
                  <Link to={`/chat/${konsumen?.user_id}`}>Chat Konsumen</Link>
                </Menu.Item>
              </Menu>
            }
          >
            <Button type="default" icon={<MoreOutlined />}></Button>
          </Dropdown>
        </div>
      </div>
      <div className="overflow-x-auto" ref={webixTableRef}></div>
    </React.Fragment>
  );
}
