import KomentarArtikel from '@/components/KomentarArtikelComponent';
import { getDetailArtikel, getDiskusiArtikel } from '@/services/artikel';
import Artikel from '@/types/Artikel';
import DiskusiArtikel from '@/types/DiskusiArtikel';
import Paging from '@/types/Paging';
import {
  CheckCircleFilled,
  CommentOutlined,
  EditOutlined,
  EyeOutlined,
  FlagFilled,
  LikeOutlined,
} from '@ant-design/icons';
import { Button, Empty, PageHeader, Skeleton } from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

export default function HalamanDetailArtikel() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState<boolean>(true);
  const [artikel, setArtikel] = useState<Artikel | null>(null);
  const [diskusi, setDiskusi] = useState<Paging<DiskusiArtikel>>({
    data: [],
    loading: true,
  });

  const handleLoadMoreDiscussion = () => {
    setDiskusi((old) => ({ ...old, loading: true }));
    getDiskusiArtikel(id as string, diskusi.next_page_url)
      .then(({ data }) =>
        setDiskusi((old) => ({
          ...data,
          data: [...old.data, ...data.data],
        })),
      )
      .finally(() => setDiskusi((old) => ({ ...old, loading: false })));
  };

  useEffect(() => {
    // setLoading(true);
    getDetailArtikel(id as string)
      .then(({ data }) => setArtikel(data))
      .finally(() => setLoading(false));

    getDiskusiArtikel(id as string)
      .then(({ data }) => setDiskusi(data))
      .finally(() => setDiskusi((old) => ({ ...old, loading: false })));
  }, [id]);

  if (loading) return <Skeleton active className="p-5" />;

  return (
    <>
      <div className="md:pr-5 flex flex-col md:space-x-5 md:flex-row md:items-center md:justify-between">
        <PageHeader title={artikel?.judul} onBack={() => navigate(`/blog`)} />

        <Link className="mx-5 md:mx-0" to="edit">
          <Button className="w-full" type="primary" icon={<EditOutlined />}>
            Perbaharui Artikel
          </Button>
        </Link>
      </div>
      <section className="p-5">
        <img
          className="max-w-full rounded-md"
          src={artikel?.banner}
          alt={artikel?.judul}
        />
        <div className="flex items-center justify-between space-x-5 mt-8">
          <div className="flex items-center space-x-3">
            <span>{moment(artikel?.created_at).format('dddd, DD MMMM yyyy')}</span>
            {artikel?.status === 'AKTIF' ? (
              <button className="flex items-center space-x-2 px-3 py-[3px] rounded-full border border-green-600 text-green-600">
                <CheckCircleFilled />
                <span>Dipublikasi</span>
              </button>
            ) : (
              <button className="flex items-center space-x-2 px-3 py-[3px] rounded-full border border-yellow-600 text-yellow-600">
                <FlagFilled />
                <span>Draft</span>
              </button>
            )}
          </div>

          <div className="flex-grow flex items-center space-x-5 justify-end">
            <div className="flex items-center space-x-2">
              <LikeOutlined />
              <span className="font-semibold">{artikel?.jumlah_suka}</span>
            </div>
            <div className="flex items-center space-x-2">
              <EyeOutlined />
              <span className="font-semibold">{artikel?.jumlah_baca}</span>
            </div>
            <div className="flex items-center space-x-2">
              <CommentOutlined />
              <span className="font-semibold">{artikel?.diskusi_count}</span>
            </div>
          </div>
        </div>
        <h1 className="font-bold text-3xl md:text-5xl mt-5">{artikel?.judul}</h1>
        <p>{artikel?.kalimat_pembuka}</p>
        <article dangerouslySetInnerHTML={{ __html: artikel?.isi! }}></article>
      </section>
      <div className="bg-white p-5">
        {diskusi.data.length === 0 && (
          <Empty
            description={<p className="text-gray-500">Belum diskusi untuk artikel ini</p>}
          />
        )}
        {diskusi.data.length > 0 && (
          <>
            <span className="rounded bg-color-theme text-white font-semibold px-3 py-[3px]">
              {diskusi.total} DISKUSI
            </span>
            <hr className="my-5" />
            {diskusi.data.map((item) => (
              <KomentarArtikel
                onDelete={(deleted) =>
                  setDiskusi((old) => ({
                    ...old,
                    data: old.data.filter((k) => k.id !== deleted.id),
                    total: old.total! - 1,
                  }))
                }
                artikel={artikel!}
                item={item}
                key={item.id}
              />
            ))}
            {diskusi.next_page_url && (
              <div className="flex items-center justify-center mt-10">
                <Button
                  onClick={handleLoadMoreDiscussion}
                  loading={diskusi.loading}
                  type="default"
                  shape="round"
                >
                  Muat lebih banyak
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
