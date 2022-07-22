import { useState, ReactNode, useEffect } from 'react';
import { Menu, notification } from 'antd';
import {
  HomeOutlined,
  ShoppingOutlined,
  UserOutlined,
  BellFilled,
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { getFCMToken, onMessageListener } from '@/services/firebase';
import HeaderComponent from './HeaderComponent';

const mainBgColor = 'bg-gray-200';

export default function WrapperComponent({ children }: { children: ReactNode }) {
  const [showSidebar, setShowSidebar] = useState(false);

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
      <div className={`flex md:fixed inset-x-0 z-10 min-h-screen`}>
        <div
          className={`${
            showSidebar
              ? 'fixed flex inset-y-0 bg-black bg-opacity-50 z-40 md:hidden'
              : 'hidden md:block'
          } h-screen w-full md:w-2/7 lg:w-2/9 flex-none`}
        >
          <nav
            className={`my-sidebar overflow-y-auto py-5 leading-loose w-8/12 md:w-full bg-color-theme h-full overflow-x-hidden`}
          >
            <div className="flex items-center space-x-5 px-5 mb-5">
              <img
                src="/logo_mysawit.png"
                alt="Logo PPKS"
                className="max-w-full md:w-8/12"
              />
            </div>
            <Menu mode="inline" defaultSelectedKeys={['dashboard']}>
              <Menu.Item key={'dashboard'} icon={<HomeOutlined />}>
                <Link to="/">Dashboard</Link>
              </Menu.Item>
              <Menu.Item key={'konsumen'} icon={<UserOutlined />}>
                <Link to="/konsumen">Konsumen</Link>
              </Menu.Item>
              <Menu.Item key={'pesanan'} icon={<ShoppingOutlined />}>
                <Link to="/pesanan">Pesanan</Link>
              </Menu.Item>
            </Menu>
          </nav>
          <section onClick={() => setShowSidebar(false)} className="flex-grow" />
        </div>

        <main
          className={`flex-grow ${mainBgColor} overflow-y-scroll flex flex-col h-screen`}
        >
          <HeaderComponent />
          {children}
        </main>
      </div>
    </>
  );
}
