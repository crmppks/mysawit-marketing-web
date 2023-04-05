import { ReactNode, useEffect } from 'react';
import { Menu, message, notification } from 'antd';
import {
  HomeOutlined,
  ShoppingOutlined,
  UserOutlined,
  BellFilled,
  LineChartOutlined,
  StarOutlined,
} from '@ant-design/icons';
import { getFCMToken, onMessageListener } from '@/services/firebase';
import { useAppSelector } from '@/hooks/redux_hooks';
import { postStoreFCMToken } from '@/services/notifikasi';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { getAllNotificationAction } from '@/store/actions/notifikasi';
import HeaderComponent from '@/components/HeaderComponent';
import { ID_KATEGORI_PRODUK_KECAMBAH } from '@/helpers/constants';

const mainBgColor = 'bg-gray-200';

export default function WrapperComponent({ children }: { children: ReactNode }) {
  const dispatch = useDispatch();
  const user = useAppSelector((state) => state.sesi.user);

  useEffect(() => {
    getFCMToken()
      .then(postStoreFCMToken)
      .catch((e) => {
        message.error(e.message);
      });

    onMessageListener()
      .then((payload: any) => {
        dispatch(getAllNotificationAction());
        console.log(payload);
        notification.open({
          message: payload.notification.title,
          description: payload.notification.body,
          icon: (
            <span className="text-color-theme">
              <BellFilled className="text-2xl" />
            </span>
          ),
          onClick: () => {
            //   console.log('Notification Clicked!');
          },
        });
      })
      .catch((err) => console.log('failed: ', err));
  }, [dispatch]);

  return (
    <>
      <HeaderComponent />
      <main className={`${mainBgColor} flex`}>
        <nav className="my-sidebar bg-white w-[150px] md:w-[250px] lg:w-[23vw] flex-none fixed left-0 top-0 z-40">
          <div className="px-5 pb-5 mt-5 mb-[50px] flex space-x-3 flex-none border-b overflow-hidden">
            <div className="w-28 lg:w-32 flex-none flex items-center">
              <img src="/logo_mysawit.png" alt="Logo PPKS" className="w-full" />
            </div>

            <div className="hidden md:flex flex-col justify-center flex-grow mt-3 border-l pl-3 space-y-1 py-1">
              <span className="text-xs text-gray-500">Marketing</span>
              <span className="font-bold uppercase text-gray-700 leading-tight">
                {user.kategori_produk.nama}
              </span>
            </div>
          </div>
          <Menu mode="inline" defaultSelectedKeys={['dashboard']}>
            <Menu.Item key={'dashboard'} icon={<HomeOutlined />}>
              <Link to="/">Dashboard</Link>
            </Menu.Item>
            <Menu.Item key={'produk'} icon={<StarOutlined />}>
              <Link to="/produk">Produk</Link>
            </Menu.Item>
            {user.kategori_produk_id === ID_KATEGORI_PRODUK_KECAMBAH && (
              <Menu.Item key={'konsumen'} icon={<UserOutlined />}>
                <Link to="/konsumen">Konsumen</Link>
              </Menu.Item>
            )}
            <Menu.Item key={'pesanan'} icon={<ShoppingOutlined />}>
              <Link to="/pesanan">Pesanan</Link>
            </Menu.Item>
            <Menu.SubMenu key={'laporan'} icon={<LineChartOutlined />} title="Laporan">
              <Menu.Item key={'annual'}>
                <Link to="/laporan/annual">Annual Sales Report</Link>
              </Menu.Item>
              <Menu.Item key={'monthly'}>
                <Link to="/laporan/monthly">Monthly Sales Report</Link>
              </Menu.Item>
              <Menu.Item key={'daily'}>
                <Link to="/laporan/daily">Daily Sales Report</Link>
              </Menu.Item>
            </Menu.SubMenu>
          </Menu>
        </nav>
        <section className="flex-grow ml-[150px] md:ml-[250px] lg:ml-[23vw] min-h-[100vh] overflow-x-auto">
          {children}
        </section>
      </main>
    </>
  );
}
