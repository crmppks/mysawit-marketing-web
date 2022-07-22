/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useCallback } from 'react';
import lodash from 'lodash';
import { Skeleton } from 'antd';

import { postCariProduk } from '@/services/produk';

import Paging from '@/types/Paging';
import Produk from '@/types/Produk';
import { Link } from 'react-router-dom';

export default function SearchBoxComponent() {
  const [searchValue, setSearchValue] = useState<string>('');
  const [searchResult, setSearchResult] = useState<Paging<Produk>>({
    loading: false,
    data: [],
  });

  const debounceSearch = useCallback(
    lodash.debounce((value: string) => {
      if (value) {
        setSearchResult({ ...searchResult, loading: true });
        postCariProduk(value).then(({ data }) => setSearchResult(data));
      }
    }, 350),
    [],
  );

  useEffect(() => {
    if (!searchValue) setSearchResult({ ...searchResult, data: [] });
  }, [searchValue]);

  return (
    <div className="relative flex-grow">
      {searchValue && (
        <button
          onClick={() => setSearchValue('')}
          className="absolute right-2 z-40 top-0 bottom-0 flex items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      )}

      <input
        value={searchValue}
        onChange={(e) => {
          setSearchValue(e.target.value);
          debounceSearch(e.target.value);
        }}
        placeholder="Cari produk"
        type="search"
        className={`relative w-full px-4 py-[8px] bg-gray-200 border-2 border-white focus:border-green-700 ${
          searchValue ? 'rounded-t-md focus:border-b-white' : 'rounded-md'
        }`}
      />
      {searchValue && (
        <div className="z-40 overflow-hidden absolute -mt-[2px] inset-x-0 border-b-2 border-x-2 border-color-theme rounded-b-md bg-white">
          {searchResult.loading ? (
            <div className="w-full flex space-x-3 p-5">
              <Skeleton active />
            </div>
          ) : searchResult.data.length === 0 ? (
            <p className="p-3 text-gray-500 text-center mb-0">
              Tidak ada hasil ditemukan
            </p>
          ) : (
            searchResult.data.map((item) => (
              <Link
                to={`/produk/${item.id}`}
                key={item.id}
                onClick={() => setSearchValue('')}
                className="flex space-x-5 w-full hover:bg-gray-100 py-2 px-3"
              >
                <img src={item.banner} alt={item.nama} className="w-12 flex-none" />
                <div className="flex-grow">
                  <h3 className="mb-0">{item.nama}</h3>
                  <p className="mb-0 text-xs">{item.kategori.nama}</p>
                </div>
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  );
}
