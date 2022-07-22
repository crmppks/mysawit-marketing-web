import ModalKategori, { ModalKategoriItem } from '@/components/ModalKategoriComponent';
import { confirmAlert } from '@/helpers/swal_helper';
import {
  deleteHapusKategoriProduk,
  getKategoriProdukDetail,
  getSemuaKategoriProdukCascader,
  getSemuaProduk,
  postTambahKategoriProduk,
  putUpdateKategoriProduk,
} from '@/services/produk';
import Kategori from '@/types/Kategori';
import Paging from '@/types/Paging';
import Produk from '@/types/Produk';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Empty, message, PageHeader, Skeleton, Image } from 'antd';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

export default function HalamanDetailKategoriProduk() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState<boolean>(true);
  const [kategori, setKategori] = useState<Kategori | null>(null);
  const [loadingHalaman, setLoadingHalaman] = useState<boolean>(false);
  const [modalKategoriItem, setModalKategoriItem] = useState<ModalKategoriItem | null>(
    null,
  );
  const [produks, setProduks] = useState<Paging<Produk>>({
    data: [],
    loading: true,
  });

  const handleHapusKategori = () => {
    confirmAlert(
      'Hapus Kategori',
      <>
        Apakah anda yakin untuk menghapus kategori <b>{kategori!.nama}</b>
        {kategori!.sub_kategori_simple?.length > 0 && ' dan sub kategorinya'}?
      </>,
    ).then((willDelete: boolean) => {
      if (willDelete) {
        deleteHapusKategoriProduk(id as string).then(() => {
          message.success('Kategori berhasil dihapus');
          navigate('/produk');
        });
      }
    });
  };

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
      <ModalKategori
        tipe="Produk"
        visible={!!modalKategoriItem}
        kategoriItem={modalKategoriItem}
        getCascaderAction={getSemuaKategoriProdukCascader}
        postAddAction={(params) => postTambahKategoriProduk(params)}
        putUpdateAction={(kategori_id, params) =>
          putUpdateKategoriProduk(kategori_id, params)
        }
        onFinishAdd={(kategori: Kategori) => {}}
        onFinishUpdate={(kategori: Kategori) => setKategori(kategori)}
        onCancel={() => setModalKategoriItem(null)}
      />
      <div className="md:pr-5 flex flex-col md:space-x-5 md:flex-row md:items-center md:justify-between">
        <PageHeader
          onBack={() => navigate('/produk')}
          breadcrumb={{
            routes: [
              {
                path: 'produk',
                breadcrumbName: 'Daftar Produk',
              },
              {
                path: id as string,
                breadcrumbName: 'Detail Kategori Produk',
              },
            ],
          }}
          title={kategori!.nama}
          subTitle={
            kategori?.parent_kategori
              ? `Sub kategori dari ${kategori.parent_kategori.nama}`
              : null
          }
        />
        <div className="flex space-x-3">
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => setModalKategoriItem({ tipe: 'EDIT', item: kategori! })}
          >
            Perbaharui
          </Button>
          <Button
            danger
            type="primary"
            icon={<DeleteOutlined />}
            onClick={handleHapusKategori}
          >
            Hapus
          </Button>
        </div>
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
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-5">
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
                      <Link
                        to={`/kategori/produk/${produk.kategori.id}`}
                        className="text-yellow-500"
                      >
                        <span className="leading-tight">{produk.kategori.nama}</span>
                      </Link>

                      <div className="mt-3 mb-0 font-bold flex justify-between">
                        <span className="text-lg">
                          {produk.harga_diff} / {produk.unit}
                        </span>
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
