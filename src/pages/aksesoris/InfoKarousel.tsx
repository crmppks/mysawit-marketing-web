import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import '../../styles/custom-swiper.css';
import { Navigation, Pagination } from 'swiper';
import { useEffect, useState } from 'react';
import {
  deleteHapusKarousel,
  getSemuaKarousel,
  postUrutkanKarousel,
} from '@/services/karousel';
import { Button, PageHeader, Table } from 'antd';
import { confirmAlert } from '@/helpers/swal_helper';
import {
  DeleteOutlined,
  EditOutlined,
  MenuOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc';
import { arrayMoveImmutable } from 'array-move';
import ModalKarousel, { ModalKarouselItem } from '@/components/ModalKarouselComponent';

const DragHandle = SortableHandle(() => (
  <MenuOutlined style={{ cursor: 'grab', color: '#999', fontSize: 'large' }} />
));
const SortableItem = SortableElement((props: any) => <tr {...props} />);
const SortableBody = SortableContainer((props: any) => <tbody {...props} />);

export default function HalamanInfoKarousel() {
  const [loading, setLoading] = useState<boolean>(true);
  const [modalKarouselItem, setModalKarouselItem] = useState<ModalKarouselItem | null>(
    null,
  );
  const [items, setItems] = useState<
    Array<{
      id: number;
      key: number;
      judul: string;
      deskripsi: string;
      banner: string;
    }>
  >([]);

  const handleHapusBanner = (banner: any) => {
    confirmAlert(
      'Hapus Banner',
      <>
        Apakah anda yakin untuk menghapus banner <b>{banner.judul}</b>?
      </>,
    ).then((willDelete: boolean) => {
      if (willDelete) {
        setLoading(true);
        deleteHapusKarousel(banner.id)
          .then(() => {
            setItems(items.filter((item: any) => item.id !== banner.id));
          })
          .finally(() => setLoading(false));
      }
    });
  };

  const onSortEnd = ({ oldIndex, newIndex }: any) => {
    if (oldIndex !== newIndex) {
      setLoading(true);
      setItems(
        arrayMoveImmutable(([] as any[]).concat(items), oldIndex, newIndex).filter(
          (el) => !!el,
        ),
      );
      postUrutkanKarousel({
        new_id: items.find((_, index) => index === newIndex)?.id,
        prev_id: items.find((_, index) => index === oldIndex)?.id,
      })
        .catch(() => {
          getSemuaKarousel()
            .then(({ data }) => setItems(data))
            .finally(() => setLoading(false));
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  const DraggableContainer = (props: any) => (
    <SortableBody
      useDragHandle
      disableAutoscroll
      helperClass="row-dragging"
      onSortEnd={onSortEnd}
      {...props}
    />
  );

  const DraggableBodyRow = ({ ...restProps }) => {
    // function findIndex base on Table rowKey props and should always be a right array index
    const index = items.findIndex((x) => x.key === restProps['data-row-key']);
    return <SortableItem index={index} {...restProps} />;
  };

  useEffect(() => {
    setLoading(true);
    getSemuaKarousel()
      .then(({ data }) => setItems(data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <ModalKarousel
        visible={!!modalKarouselItem}
        modalItem={modalKarouselItem}
        onCancel={() => setModalKarouselItem(null)}
        onFinishAdd={(item) => setItems([...items, item])}
        onFinishUpdate={(newItem) =>
          setItems((old) =>
            old.map((oldItem) => (oldItem.id === newItem.id ? newItem : oldItem)),
          )
        }
      />
      <div className="md:pr-5 flex flex-col md:space-x-5 md:flex-row md:items-center md:justify-between">
        <PageHeader
          title="Banner Karousel"
          subTitle="Daftar semua banner yang tersedia"
        />
        <Button
          className="mx-5 md:mx-0"
          onClick={() => setModalKarouselItem({ tipe: 'TAMBAH' })}
          icon={<PlusOutlined />}
          type="primary"
        >
          Tambah Banner
        </Button>
      </div>

      <section className="p-5">
        <div className="overflow-hidden rounded-md relative z-10">
          <Swiper
            slidesPerView={1}
            spaceBetween={30}
            loop={true}
            pagination={{
              clickable: true,
            }}
            navigation
            modules={[Pagination, Navigation]}
            className="mySwiper"
          >
            {items.map((item, index) => (
              <SwiperSlide key={index}>
                <img src={item.banner} alt={item.judul} className="max-w-full" />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <Table
          className="mt-14"
          pagination={false}
          loading={loading}
          scroll={{
            x: true,
          }}
          columns={[
            {
              title: (
                <MenuOutlined
                  style={{ cursor: 'grab', color: '#999', fontSize: 'large' }}
                />
              ),
              dataIndex: 'sort',
              width: 30,
              className: 'drag-visible',
              render: () => <DragHandle />,
            },
            {
              title: 'Banner',
              dataIndex: 'banner',
              render: (banner: string) => (
                <img src={banner} alt="" className="w-52 md:max-w-xs md:rounded-md" />
              ),
            },
            {
              title: 'Judul',
              dataIndex: 'judul',
              render: (judul: string) => <h4 className="text-lg">{judul}</h4>,
            },
            {
              title: 'Aksi',
              dataIndex: 'aksi',
              render: (_, record) => (
                <div className="flex items-center space-x-2">
                  <Button
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => handleHapusBanner(record)}
                  ></Button>
                  <Button
                    type="primary"
                    icon={<EditOutlined />}
                    onClick={() => setModalKarouselItem({ tipe: 'EDIT', item: record })}
                  ></Button>
                </div>
              ),
            },
          ]}
          dataSource={items}
          components={{
            body: {
              wrapper: DraggableContainer,
              row: DraggableBodyRow,
            },
          }}
        />
      </section>
    </>
  );
}
