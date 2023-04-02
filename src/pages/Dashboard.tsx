import ChartRingkasanDonut from '@/components/ChartRingkasanDonut';
import { getOrderInsight } from '@/services/insight';
import Insight from '@/types/Insight';
import { useEffect, useState } from 'react';

export default function HalamanDashboard() {
  const [insightPesanan, setInsightPesanan] = useState<{
    loading: boolean;
    data: Array<Insight>;
  }>({ loading: true, data: [] });

  useEffect(() => {
    getOrderInsight().then(({ data }) => setInsightPesanan({ data, loading: false }));
  }, []);

  return (
    <section className="p-5">
      <div className="relative rounded shadow bg-white p-5">
        <h1 className="text-color-theme text-xl font-bold">Ringkasan Pesanan</h1>
        <ChartRingkasanDonut data={insightPesanan.data} />
      </div>
    </section>
  );
}
