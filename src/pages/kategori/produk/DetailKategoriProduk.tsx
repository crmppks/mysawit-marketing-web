import { getKategoriProdukDetail, getSemuaProduk } from '@/services/produk';
import Kategori from '@/types/Kategori';
import Paging from '@/types/Paging';
import Produk from '@/types/Produk';
import { Button, Empty, PageHeader, Skeleton, Image } from 'antd';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

export default function HalamanDetailKategoriProduk() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState<boolean>(true);
  const [kategori, setKategori] = useState<Kategori | null>(null);
  const [loadingHalaman, setLoadingHalaman] = useState<boolean>(false);
  const [produks, setProduks] = useState<Paging<Produk>>({
    data: [],
    loading: true,
  });

  const handleMuatLebihBanyak = () => {
    setLoadingHalaman(true);
    getSemuaProduk(produks.next_page_url, id as string)
      .then(({ data }) => {
        setProduks((old) => ({
          ...data,
          data: [...old.data, ...data.data],
        }));
      })
      .finally(() => setLoadingHalaman(false));
  };

  useEffect(() => {
    getKategoriProdukDetail(id as string).then(({ data }) => {
      setKategori(data);
      setLoading(false);
    });
    getSemuaProduk(null, id as string)
      .then(({ data }) => {
        setProduks((old) => ({
          ...data,
          data: [...old.data, ...data.data],
        }));
      })
      .finally(() => setLoadingHalaman(false));
  }, [id]);

  if (loading) return <Skeleton active className="p-5" />;

  return (
    <>
      <div className="md:pr-5 flex flex-col md:space-x-5 md:flex-row md:items-center md:justify-between">
        <PageHeader
          onBack={() => navigate('/produk')}
          breadcrumb={{
            routes: [
              {
                path: '/produk',
                breadcrumbName: 'Daftar Produk',
              },
              {
                path: `/produk/${id}`,
                breadcrumbName: 'Detail Kategori Produk',
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
          title={kategori!.nama}
          subTitle={
            kategori?.parent_kategori
              ? `Sub kategori dari ${kategori.parent_kategori.nama}`
              : null
          }
        />
      </div>
      <section className="p-5">
        {produks.loading && <Skeleton active />}
        {!produks.loading && (
          <div>
            {produks.data.length === 0 && (
              <Empty
                className="py-5 rounded bg-white"
                description={<p className="text-gray-500">Belum ada produk tersedia</p>}
              />
            )}
            {produks.data.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {produks.data.map((produk) => (
                  <div
                    className="border rounded bg-white overflow-hidden shadow"
                    key={produk.id}
                  >
                    <Image src={produk.banner} alt={produk.nama} className="mwx-w-full" />
                    <div className="px-5 py-3">
                      <h3 className="leading-tight text-lg mb-0">
                        <Link to={`/produk/${produk.id}`} className="font-bold">
                          {produk.nama}
                        </Link>
                      </h3>

                      <div className="mt-3 mb-0 flex justify-between">
                        {produk.harga_diff} / {produk.unit}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {produks.next_page_url && (
              <div className="flex items-center justify-center mt-10">
                <Button
                  onClick={handleMuatLebihBanyak}
                  loading={loadingHalaman}
                  type="default"
                  shape="round"
                >
                  Muat lebih banyak
                </Button>
              </div>
            )}
          </div>
        )}
      </section>
    </>
  );
}
