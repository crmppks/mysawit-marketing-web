import { getDetailMarketing } from '@/services/marketing';
import UserMarketing from '@/types/UserMarketing';
import { CheckCircleFilled, WarningFilled } from '@ant-design/icons';
import { PageHeader, Skeleton } from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

export default function HalamanDetailMarketing() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState<boolean>(true);
  const [marketing, setMarketing] = useState<UserMarketing | null>(null);

  useEffect(() => {
    setLoading(true);
    getDetailMarketing(id as string).then(({ data }) => {
      setMarketing(data);
      setLoading(false);
    });
  }, [id]);

  return (
    <>
      <PageHeader
        onBack={() => navigate('/marketing')}
        breadcrumb={{
          routes: [
            {
              path: 'marketing',
              breadcrumbName: 'Daftar Marketing',
            },
            {
              path: id as string,
              breadcrumbName: 'Detail Marketing',
            },
          ],
        }}
        title="Detail Marketing"
        subTitle="Lihat detail informasi tentang marketing"
      />
      {loading && <Skeleton active className="px-5" />}
      {!loading && (
        <section className="p-5">
          <div className="rounded bg-white p-5 shadow grid grid-cols-12 gap-5 md:gap-10">
            <div className="col-span-12 md:col-span-3">
              <img
                src={marketing?.avatar}
                alt={marketing?.nama}
                className="border max-w-full rounded-full shadow"
              />
            </div>
            <div className="col-span-12 md:col-span-9">
              <div className="flex justify-between">
                <div className="flex-grow">
                  <h1 className="font-bold text-xl mb-0">{marketing?.nama}</h1>
                  <span className="text-gray-500">{marketing?.kode_marketing}</span>
                </div>
                <div className="flex-none relative flex items-center space-x-3">
                  <span
                    className={`px-5 py-[3px] text-white rounded-full ${
                      marketing?.is_aktif ? 'bg-green-700' : 'bg-red-500'
                    }`}
                  >
                    {marketing?.is_aktif ? <CheckCircleFilled /> : <WarningFilled />}{' '}
                    &nbsp;
                    {marketing?.is_aktif ? 'Aktif' : 'Non-aktif'}
                  </span>
                </div>
              </div>
              <hr className="my-5" />
              <div className="grid grid-cols-2">
                <div>
                  <span className="text-gray-400">Kategori</span>
                  <p>{marketing?.kategori_produk.nama}</p>
                  <span className="text-gray-400">Username</span>
                  <p>{marketing?.username}</p>
                  <span className="text-gray-400">Email</span>
                  <p>{marketing?.email}</p>
                  <span className="text-gray-400">Posisi / Jabatan</span>
                  <p>{marketing?.jabatan}</p>
                  <span className="text-gray-400">Jumlah Anggota</span>
                  <p>{marketing?.anggota_count}</p>
                </div>
                <div>
                  <span className="text-gray-400">Atasan</span>
                  <p>
                    {marketing?.atasan ? (
                      <Link to={`/marketing/${marketing?.atasan.user_id}`}>
                        {marketing?.atasan?.nama}
                      </Link>
                    ) : (
                      '-'
                    )}
                  </p>
                  <span className="text-gray-400">No. HP</span>
                  <p>{marketing?.no_hp}</p>
                  <span className="text-gray-400">Alamat</span>
                  <p>{marketing?.alamat}</p>
                  <span className="text-gray-400">NIK</span>
                  <p>{marketing?.nik}</p>
                  <span className="text-gray-400">Jumlah Konsumen</span>
                  <p>{marketing?.konsumen_count}</p>
                </div>
              </div>
              <hr className="my-5" />
              <div className="grid grid-cols-2">
                <div>
                  <span>Bergabung pada</span>
                  <p>{moment(marketing?.created_at).format('DD MMMM yyyy, HH:mm')}</p>
                </div>
                {marketing?.created_at !== marketing?.updated_at && (
                  <div>
                    <span>Diperbaharui pada</span>
                    <p>{moment(marketing?.updated_at).format('DD MMMM yyyy, HH:mm')}</p>
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
