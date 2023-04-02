import { Pie } from '@ant-design/charts';

interface Props {
  data: Array<{
    title: string;
    total: number;
  }>;
}

export default function ChartRingkasanDonut({ data }: Props) {
  const config = {
    appendPadding: 10,
    data,
    angleField: 'total',
    colorField: 'title',
    radius: 1,
    innerRadius: 0.64,
    label: {
      type: 'inner',
      offset: '-50%',
      style: {
        textAlign: 'center',
      },
      autoRotate: false,
      content: '{value}',
    },
    statistic: {
      title: {
        offsetY: -4,
      },
      content: {
        offsetY: 4,
        style: {
          fontSize: '32px',
        },
      },
    },
    // 添加 中心统计文本 交互
    interactions: [
      {
        type: 'element-selected',
      },
      {
        type: 'element-active',
      },
      {
        type: 'pie-statistic-active',
      },
    ],
  };
  return <Pie {...config} autoFit />;
}
