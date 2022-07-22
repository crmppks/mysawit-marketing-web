import { getDashbordCounters } from '@/services/dashboard';
import { Skeleton } from 'antd';
import { useEffect, useState } from 'react';

export default function HalamanDashboard() {
  const [counters, setCounters] = useState<{
    loading: boolean;
    data: {
      konsumen: number;
      marketing: number;
      produk: number;
    };
  }>({
    loading: true,
    data: {
      konsumen: 0,
      marketing: 0,
      produk: 0,
    },
  });

  useEffect(() => {
    getDashbordCounters()
      .then(({ data }) => setCounters({ loading: false, data }))
      .finally(() => setCounters((old) => ({ ...old, loading: false })));
  }, []);

  return (
    <section className="p-5">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {counters.loading && (
          <>
            <div>
              <Skeleton.Input className="mb-1" block active />
              <Skeleton.Input active />
            </div>
            <div>
              <Skeleton.Input className="mb-1" block active />
              <Skeleton.Input active />
            </div>
            <div>
              <Skeleton.Input className="mb-1" block active />
              <Skeleton.Input active />
            </div>
          </>
        )}
        {!counters.loading && (
          <>
            <div className="rounded border-2 border-color-theme p-3">
              <h3 className="text-2xl text-gray-400">Konsumen</h3>
              <span className="font-bold text-3xl md:text-5xl text-color-theme">
                {counters.data.konsumen}
              </span>
            </div>
            <div className="rounded border-2 border-color-theme p-3">
              <h3 className="text-2xl text-gray-400">Marketing</h3>
              <span className="font-bold text-3xl md:text-5xl text-color-theme">
                {counters.data.marketing}
              </span>
            </div>
            <div className="rounded border-2 border-color-theme p-3">
              <h3 className="text-2xl text-gray-400">Produk</h3>
              <span className="font-bold text-3xl md:text-5xl text-color-theme">
                {counters.data.produk}
              </span>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
