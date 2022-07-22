import { getDetailKonsumen } from '@/services/konsumen';
import UserKonsumen from '@/types/UserKonsumen';
import { PageHeader, Skeleton } from 'antd';
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
    getDetailKonsumen(id as string)
      .then(({ data }) => setKonsumen(data))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <>
      <PageHeader
        onBack={() => navigate('/konsumen')}
        breadcrumb={{
          routes: [
            {
              path: 'konsumen',
              breadcrumbName: 'Daftar Konsumen',
            },
            {
              path: id as string,
              breadcrumbName: 'Detail Konsumen',
            },
          ],
        }}
        title="Detail Konsumen"
        subTitle="Lihat detail informasi tentang konsumen"
      />
      {loading && <Skeleton active className="px-5" />}
      {!loading && (
        <section className="p-5">
          <div className="rounded bg-white p-5 shadow grid grid-cols-12 gap-5 md:gap-10">
            <div className="col-span-12 md:col-span-3">
              <img
                src={konsumen?.avatar}
                alt={konsumen?.nama}
                className="border rounded-md max-w-full"
              />
            </div>
            <div className="col-span-12 md:col-span-9">
              <div className="flex justify-between">
                <div className="flex-grow">
                  <h1 className="font-bold text-xl mb-0">{konsumen?.nama}</h1>
                </div>
              </div>
              <hr className="my-5" />
              <div className="grid grid-cols-2">
                <div>
                  <span className="text-gray-400">Kategori</span>
                  <p>
                    <Link to={`/kategori/konsumen/${konsumen?.kategori_konsumen.id}`}>
                      {konsumen?.kategori_konsumen.nama}
                    </Link>
                  </p>
                  <span className="text-gray-400">Username</span>
                  <p>{konsumen?.username}</p>
                  <span className="text-gray-400">Email</span>
                  <p>{konsumen?.email}</p>
                  <span className="text-gray-400">Tgl Lahir</span>
                  <p>{konsumen?.tgl_lahir}</p>
                </div>
                <div>
                  <span className="text-gray-400">Marketing Kecambah</span>
                  <p>
                    {konsumen?.marketing ? (
                      <Link to={`/marketing/${konsumen?.marketing.user_id}`}>
                        {konsumen?.marketing?.nama}
                      </Link>
                    ) : (
                      '-'
                    )}
                  </p>
                  <span className="text-gray-400">No. HP</span>
                  <p>{konsumen?.no_hp}</p>
                  <span className="text-gray-400">Alamat</span>
                  <p>{konsumen?.alamat}</p>
                </div>
              </div>
              <hr className="my-5" />
              <div className="grid grid-cols-2">
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
