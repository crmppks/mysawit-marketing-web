import { ReactNode, useEffect } from 'react';
import { Menu, message, notification } from 'antd';
import {
  HomeOutlined,
  ShoppingOutlined,
  UserOutlined,
  BellFilled,
  ProjectOutlined,
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { getFCMToken, onMessageListener } from '@/services/firebase';
import { useAppSelector } from '@/hooks/redux_hooks';
import { postStoreFCMToken } from '@/services/notifikasi';
import HeaderComponent from './HeaderComponent';

const mainBgColor = 'bg-gray-200';

export default function WrapperComponent({ children }: { children: ReactNode }) {
  const user = useAppSelector((state) => state.sesi.user);

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

  return (
    <>
      <HeaderComponent />
      <main className={`${mainBgColor} flex`}>
        <nav className="my-sidebar bg-white w-[250px] lg:w-[23vw] flex-none md:fixed left-0 top-0 z-40">
          <div className="px-5 pb-5 mt-5 mb-[50px] flex space-x-3 flex-none border-b">
            <div className="w-12 md:w-28 lg:w-32 flex-none flex items-center">
              <img src="/logo_mysawit.png" alt="Logo PPKS" className="w-full" />
            </div>

            <div className="flex flex-col justify-center flex-grow mt-3 border-l pl-3 space-y-1 py-1">
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
            <Menu.Item key={'konsumen'} icon={<UserOutlined />}>
              <Link to="/konsumen">Konsumen</Link>
            </Menu.Item>
            <Menu.Item key={'pesanan'} icon={<ProjectOutlined />}>
              <Link to="/pesanan">Pesanan</Link>
            </Menu.Item>
            <Menu.Item key={'produk'} icon={<ShoppingOutlined />}>
              <Link to="/produk">Produk</Link>
            </Menu.Item>
          </Menu>
        </nav>
        <section className="flex-grow md:ml-[250px] lg:ml-[23vw] min-h-[100vh]">
          {children}
        </section>
      </main>
    </>
  );
}
