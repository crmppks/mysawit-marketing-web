import { formatCurrency } from '@/helpers/order_helper';
import { useAppSelector } from '@/hooks/redux_hooks';
import Pesanan, { PesananProduk } from '@/types/Pesanan';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';

interface Props {
  pesanan: Pesanan;
  showHeader?: boolean;
}

export default function DaftarProdukPesanan({ pesanan, showHeader = true }: Props) {
  const user = useAppSelector((state) => state.sesi.user);
  const categorized = useMemo(() => {
    return pesanan.items.reduce((acc, current) => {
      if (!acc[current.kategori.id]) {
        return {
          ...acc,
          [current.kategori.id]: {
            kategori: current.kategori,
            items: [current],
          },
        };
      }

      return {
        ...acc,
        [current.kategori.id]: {
          ...acc[current.kategori.id],
          items: [...acc[current.kategori.id].items, current],
        },
      };
    }, {});
  }, [pesanan]);

  return (
    <>
      {showHeader && (
        <>
          <div className="flex justify-between">
            <h4 className="font-bold text-lg mb-0">Info Produk</h4>
          </div>
          <hr className="border-dashed mb-4 mt-2" />
        </>
      )}
      <div className="divide-y">
        {Object.keys(categorized).map((kategori_id) => (
          <div key={kategori_id} className="py-3 first:pt-0 last:pb-0 relative">
            {kategori_id !== user.kategori_produk_id && (
              <div className="absolute inset-0 bg-white bg-opacity-50"></div>
            )}
            <h3 className="text-lg">{categorized[kategori_id].kategori.nama}</h3>
            <div className="space-y-3">
              {categorized[kategori_id].items.map((produk: PesananProduk) => (
                <div key={produk.id} className="flex-grow flex space-x-3">
                  <div className="flex-none w-24">
                    <img
                      alt={produk.nama}
                      src={produk.banner}
                      className="rounded max-w-full"
                    />
                  </div>

                  <div className="flex-grow">
                    <h4 className="mb-0 text-lg">
                      <Link to={`/produk/${produk.id}`}>{produk.nama}</Link>
                    </h4>
                    <span className="text-gray-500">
                      {`${produk.order_quantity} x ${formatCurrency(
                        produk.order_item_price,
                      )}`}
                    </span>
                  </div>
                  <div className="flex flex-col flex-none items-end">
                    <span className="text-gray-500 text-xs">Total Harga</span>
                    <b>
                      {formatCurrency(produk.order_item_price * produk.order_quantity)}
                    </b>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
