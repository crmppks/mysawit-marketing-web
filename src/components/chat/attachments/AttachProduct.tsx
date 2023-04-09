import { getMostSeenProducts, postCariProduk } from '@/services/produk';
import Paging from '@/types/Paging';
import Produk from '@/types/Produk';
import { SearchOutlined } from '@ant-design/icons';
import { Input, Skeleton, Tooltip } from 'antd';
import lodash from 'lodash';
import { useCallback, useEffect, useState } from 'react';

interface Props {
  onClose: () => void;
  onProductSelected: (produk: Produk) => void;
}

export default function AttachProductComponent({ onClose, onProductSelected }: Props) {
  const [selected, setSelected] = useState<Produk>(null);
  const [searchValue, setSearchValue] = useState<string>('');
  const [searchResult, setSearchResult] = useState<Paging<Produk>>({
    loading: false,
    data: [],
  });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debounceSearch = useCallback(
    lodash.debounce((value: string) => {
      if (value) {
        setSearchResult((old) => ({ ...old, loading: true }));
        postCariProduk(value, 5).then(({ data }) => setSearchResult(data));
      }
    }, 350),
    [],
  );

  useEffect(() => {
    setSearchResult((old) => ({ ...old, loading: true }));
    getMostSeenProducts(6)
      .then(({ data }) => setSearchResult(data))
      .finally(() => setSearchResult((old) => ({ ...old, loading: false })));
  }, []);

  useEffect(() => {
    onProductSelected(selected);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  return (
    <div className="relative p-5 rounded bg-white mb-1">
      <button
        className="absolute -top-2 -right-2 rounded-full bg-white p-1"
        onClick={() => onClose()}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-4 h-4"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      <Input
        className="w-full"
        placeholder="Cari produk"
        addonBefore={<SearchOutlined />}
        value={searchValue}
        onChange={(event) => {
          setSearchValue(event.target.value);
          debounceSearch(event.target.value);
        }}
      />
      {searchResult.loading ? (
        <Skeleton active className="pt-5" />
      ) : (
        <div className="grid grid-cols-3 lg:grid-cols-6 gap-3 mt-3">
          {searchResult.data.map((product) => (
            <Tooltip title={product.nama} key={product.id}>
              <button
                key={product.id}
                onClick={() =>
                  setSelected((prev) => (prev?.id === product.id ? null : product))
                }
                className={`${
                  selected?.id === product.id ? 'border-2 border-color-theme' : 'border'
                } rounded hover:border-color-theme overflow-hidden shadow`}
              >
                <img src={product.banner} alt={product.nama} className="w-full" />
                <h4 className="text-xs p-2 text-ellipsis overflow-hidden whitespace-nowrap">
                  {product.nama}
                </h4>
              </button>
            </Tooltip>
          ))}
        </div>
      )}
    </div>
  );
}