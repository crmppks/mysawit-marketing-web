import { ReactNode, useEffect } from 'react';
import { Menu, notification } from 'antd';
import {
  HomeOutlined,
  ShoppingOutlined,
  UserOutlined,
  BellFilled,
  ProjectOutlined,
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { getFCMToken, onMessageListener } from '@/services/firebase';
import HeaderComponent from './HeaderComponent';

const mainBgColor = 'bg-gray-200';

export default function WrapperComponent({ children }: { children: ReactNode }) {
  useEffect(() => {
    getFCMToken()
      .then((token) => console.log(`token ${token}`))
      .catch((e) => console.log(e));

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
          <div className="px-5 mt-10 mb-[50px]">
            <img src="/logo_mysawit.png" alt="Logo PPKS" className="w-12 md:w-32" />
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
