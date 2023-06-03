import 'webix/webix.css';
import { Button, Pagination, PageHeader, Skeleton } from 'antd';
import React, { useState, useEffect, useRef } from 'react';
import * as webix from '@xbs/webix-pro';
import moment from 'moment';
import { useNavigate, useParams } from 'react-router-dom';
import { getDetailKategoriKonsumen, getSemuaKonsumen } from '@/services/konsumen';
import UserKonsumen from '@/types/UserKonsumen';
import { webixTableParams } from '@/helpers/webix_helper';
import Kategori from '@/types/Kategori';

export default function HalamanDetailKategoriKonsumen() {
  const webixTableRef = useRef<any>();
  const uiTable = useRef<any>();

  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState<boolean>(true);
  const [kategori, setKategori] = useState<Kategori | null>(null);
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
            // autowidth:true,
            select: true,
            // footer:true,
            resizeColumn: true,
            url: async function (params: any) {
              const alteredParams = {
                ...params,
                filter: {
                  ...params?.filter,
                  kategori_konsumen_id: id,
                },
              };

              try {
                const {
                  data: { data, current_page, last_page, total, per_page },
                } = await getSemuaKonsumen(webixTableParams(alteredParams), page.current);

                setPage((old) => ({
                  current: params ? old.current : current_page,
                  last: last_page,
                  total,
                  per_page,
                }));

                return data;
              } catch (e) {
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
                navigate(`/konsumen/${item.user_id}`);
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
  }, [page.current, kategori?.id]);

  useEffect(() => {
    const childs = uiTable.current.getChildViews();
    if (childs) {
      childs[0].setState({
        ...childs[0].getState(),
        filter: {
          ...childs[0].getState().filter,
          kategori_konsumen_id: id as string,
        },
      });
    }

    setLoading(true);
    getDetailKategoriKonsumen(id as string).then(({ data }) => {
      setKategori(data);
      setLoading(false);
    });
  }, [id]);

  return (
    <React.Fragment>
      {loading ? (
        <Skeleton.Input active block className="mt-3" />
      ) : (
        <PageHeader
          className="site-page-header"
          title={kategori?.nama}
          subTitle={
            kategori?.parent_kategori
              ? `Sub kategori dari ${kategori.parent_kategori?.nama}`
              : null
          }
        />
      )}
      <div className="p-5 flex justify-between">
        <Pagination
          onChange={(current) => setPage((old) => ({ ...old, current }))}
          defaultCurrent={page.current}
          total={page.total}
          pageSize={page.per_page}
          showSizeChanger={false}
          showLessItems
        />

        <div className="flex space-x-2">
          <Button
            onClick={() => navigate(`/konsumen/${konsumen?.user_id!}`)}
            disabled={!konsumen}
          >
            Detail
          </Button>
        </div>
      </div>
      <div ref={webixTableRef}></div>
    </React.Fragment>
  );
}
