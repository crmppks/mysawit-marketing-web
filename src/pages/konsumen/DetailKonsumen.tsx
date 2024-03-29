import { getDetailKonsumen } from '@/services/konsumen';
import UserKonsumen from '@/types/UserKonsumen';
import { MessageOutlined } from '@ant-design/icons';
import { Button, Image, PageHeader, Skeleton } from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

export default function HalamanDetailKonsumen() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState<boolean>(true);
  const [konsumen, setKonsumen] = useState<UserKonsumen | null>(null);

  useEffect(() => {
    setLoading(true);
    getDetailKonsumen(id as string).then(({ data }) => {
      setKonsumen(data);
      setLoading(false);
    });
  }, [id]);

  return (
    <>
      <PageHeader
        onBack={() => navigate('/konsumen')}
        breadcrumb={{
          routes: [
            {
              path: '/konsumen',
              breadcrumbName: 'Daftar Konsumen',
            },
            {
              path: `/konsumen/${id}`,
              breadcrumbName: 'Detail Konsumen',
            },
          ],
          itemRender: (route, _, routes) => {
            const last = routes.indexOf(route) === routes.length - 1;
            return last ? (
              <span>{route.breadcrumbName}</span>
            ) : (
              <Link to={route.path}>{route.breadcrumbName}</Link>
            );
          },
        }}
        extra={[
          <Link key={'chat'} to={`/chat/${konsumen?.user_id}`}>
            <Button type="primary" icon={<MessageOutlined />}>
              Chat Konsumen
            </Button>
          </Link>,
        ]}
        title="Detail Konsumen"
        subTitle="Lihat detail informasi tentang konsumen"
      />
      {loading && <Skeleton active className="px-5" />}
      {!loading && (
        <section className="p-5">
          <div className="rounded bg-white p-5 shadow grid grid-cols-12 gap-5 md:gap-10">
            <div className="col-span-12 md:col-span-3 flex justify-center md:justify-start">
              <Image
                src={konsumen?.avatar}
                alt={konsumen?.nama}
                style={{ maxWidth: '70vw' }}
              />
            </div>
            <div className="col-span-12 md:col-span-9">
              <div className="flex justify-between">
                <div className="flex-grow">
                  <h1 className="font-bold text-xl md:text-2xl mb-0">{konsumen?.nama}</h1>
                </div>
              </div>
              <hr className="my-5" />
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div>
                  <span className="text-gray-400">Kategori</span>
                  <p>
                    {konsumen?.kategori_konsumen ? (
                      <Link to={`/kategori/konsumen/${konsumen?.kategori_konsumen.id}`}>
                        {konsumen?.kategori_konsumen.nama}
                      </Link>
                    ) : (
                      '-'
                    )}
                  </p>
                  <span className="text-gray-400">Username</span>
                  <p>{konsumen?.username ?? '-'}</p>
                  <span className="text-gray-400">Email</span>
                  <p>{konsumen?.email}</p>
                  <span className="text-gray-400">Tgl Lahir</span>
                  <p>{konsumen?.tgl_lahir ?? '-'}</p>
                </div>
                <div>
                  <span className="text-gray-400">Marketing Kecambah</span>
                  <p>
                    {konsumen?.marketing ? (
                      <Link to={`/marketing/${konsumen?.marketing.id}`}>
                        {konsumen?.marketing?.nama}
                      </Link>
                    ) : (
                      '-'
                    )}
                  </p>
                  <span className="text-gray-400">No. HP</span>
                  <p>{konsumen?.no_hp_diff ?? '-'}</p>
                </div>
              </div>
              <hr className="my-5" />
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div>
                  <span className="text-gray-400">Bergabung pada</span>
                  <p>{moment(konsumen?.created_at).format('DD MMMM yyyy, HH:mm')}</p>
                </div>
                {konsumen?.created_at !== konsumen?.updated_at && (
                  <div>
                    <span className="text-gray-400">Diperbaharui pada</span>
                    <p>{moment(konsumen?.updated_at).format('DD MMMM yyyy, HH:mm')}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
