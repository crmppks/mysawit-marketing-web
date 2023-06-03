import { ReactNode, useEffect, useState } from 'react';
import { Menu, message, notification } from 'antd';
import {
  HomeOutlined,
  ShoppingOutlined,
  UserOutlined,
  BellFilled,
  StarOutlined,
  LineChartOutlined,
} from '@ant-design/icons';
import { Link, useLocation } from 'react-router-dom';
import { getFCMToken, onMessageListener } from '@/services/firebase';
import { postStoreFCMToken } from '@/services/notifikasi';
import { ID_KATEGORI_PRODUK_KECAMBAH } from '@/helpers/constants';
import { useAppSelector } from '@/hooks/redux_hooks';
import HeaderComponent from './HeaderComponent';

const mainBgColor = 'bg-gray-200';

export default function WrapperComponent({ children }: { children: ReactNode }) {
  const location = useLocation();
  const user = useAppSelector((state) => state.sesi.user);
  const [showSidebar, setShowSidebar] = useState<boolean>(false);

  useEffect(() => {
    getFCMToken()
      .then(postStoreFCMToken)
      .catch((e) => {
        message.error(e.message);
      });

    onMessageListener()
      .then((payload: any) => {
        notification.open({
          message: payload.notification.title,
          description: payload.notification.body,
          icon: <BellFilled className="text-2xl text-green-700" />,
          onClick: () => {
            //   console.log('Notification Clicked!');
          },
        });
      })
      .catch((err) => console.log('failed: ', err));
  }, []);

  useEffect(() => {
    setShowSidebar(false);
  }, [location.pathname]);

  return (
    <>
      <HeaderComponent onClickSidebarMenu={() => setShowSidebar((prev) => !prev)} />
      <main className={`${mainBgColor} flex`}>
        <nav
          className={`my-sidebar bg-black bg-opacity-75 md:bg-white md:bg-opacity-100 ${
            showSidebar ? 'flex' : 'hidden md:flex'
          } fixed inset-0 md:top-0 md:bottom-0 md:left-0 md:right-auto md:w-[250px] lg:w-[23vw] z-50 md:z-40`}
        >
          <div className="w-72 md:w-full bg-white flex flex-col flex-none">
            <div className="px-5 pb-5 mt-5 flex space-x-3 flex-none border-b">
              <div className="w-28 lg:w-32 flex-none flex items-center">
                <img src="/logo_mysawit.png" alt="Logo PPKS" className="w-full" />
              </div>

              <div className="hidden xl:flex flex-col justify-center flex-grow mt-3 border-l pl-3">
                <span className="text-gray-500">Marketing</span>
                <span className="text-gray-500 font-bold uppercase tracking-wider">
                  {user.kategori_produk?.nama}
                </span>
              </div>
            </div>
            <div className="py-6 overflow-y-auto flex-grow">
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
                <Menu.SubMenu
                  key={'laporan'}
                  icon={<LineChartOutlined />}
                  title="Laporan"
                >
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
            </div>
          </div>
          <div
            className="flex-grow"
            onClick={() => setShowSidebar((prev) => !prev)}
          ></div>
        </nav>
        <div className="relative flex flex-col flex-grow md:ml-[250px] lg:ml-[23vw] min-h-[100vh] overflow-x-auto">
          {children}
        </div>
      </main>
    </>
  );
}
