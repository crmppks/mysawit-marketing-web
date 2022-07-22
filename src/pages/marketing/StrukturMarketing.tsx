import { getStrukturMarketing } from '@/services/struktur';
import { DecompositionTreeGraph } from '@ant-design/graphs';
import { useEffect, useState } from 'react';

export default function HalamanStrukturMarketing() {
  const config = {
    behaviors: ['drag-canvas', 'drag-node'],
    // width: 800,
    autoFit: false,
    nodeCfg: {
      autoWidth: true,
      size: [120, 25],
      title: {
        containerStyle: {
          fill: 'transparent',
        },
        style: {
          fill: '#000',
          fontWeight: 'bold',
        },
      },
      items: {
        containerStyle: {
          fill: '#fff',
        },
        style: (cfg: any, group: any, type: any) => {
          const styles: any = {
            icon: {
              width: cfg.id === 'root' ? 50 : 10,
              height: cfg.id === 'root' ? 50 : 10,
            },
            value: {
              fill: '#52c41a',
            },
            text: {
              fill: '#aaa',
            },
          };
          return styles[type];
        },
      },
      style: (item: any) => {
        return {
          stroke: 'transparent',
          ...(item.id === 'root' ? { strokeOpacity: 0 } : {}),
        };
      },
      nodeStateStyles: {
        hover: {
          stroke: '#239140',
        },
      },
    },
    edgeCfg: {
      endArrow: {
        show: false,
      },
      style: (item: any, graph: any) => {
        /**
         * graph.findById(item.target).getModel()
         * item.source: 获取 source 数据
         * item.target: 获取 target 数据
         */
        // console.log(graph.findById(item.source).getModel());
        return {
          stroke: '#239140',
          lineWidth: 4,
          strokeOpacity: 0.5,
        };
      },
      // edgeStateStyles: false,
    },
    onReady: (graph: any) => {
      graph.on('node:click', (evt: any) => {
        //
      });
    },
  };

  const [values, setValues] = useState<any>({
    id: 'root',
    value: {
      // title: 'MY SAWIT',
      items: [
        {
          icon: '/logo_ppks.png',
        },
      ],
    },
  });

  useEffect(() => {
    getStrukturMarketing().then(({ data }) =>
      setValues((old: any) => ({
        ...old,
        children: data,
      })),
    );
  }, []);

  return (
    <section className="m-5 bg-white rounded-md overflow-hidden shadow">
      <h1 className="font-bold text-lg mx-5 my-3 text-color-theme">
        Struktur Marketing {process.env.REACT_APP_NAME}
      </h1>
      <DecompositionTreeGraph data={values} {...config} />
    </section>
  );
}
