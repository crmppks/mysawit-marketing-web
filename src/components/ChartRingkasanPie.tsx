import { Pie } from '@ant-design/charts';

interface Props {
  data: Array<{
    title: string;
    total: number;
  }>;
}

export default function ChartRingkasanPie({ data }: Props) {
  const config = {
    appendPadding: 10,
    data,
    angleField: 'total',
    colorField: 'title',
    radius: 0.8,
    label: {
      type: 'outer',
      content: '{name} {percentage}',
    },
    interactions: [
      {
        type: 'pie-legend-active',
      },
      {
        type: 'element-active',
      },
    ],
  };
  return <Pie {...config} autoFit />;
}
