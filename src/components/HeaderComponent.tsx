import { useAppDispatch, useAppSelector } from '@/hooks/redux_hooks';
import { getJumlahBadgeNotifikasi } from '@/services/notifikasi';
import { clearSesiAction } from '@/store/actions/sesi';
import { LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { Badge, Dropdown, Empty, Menu } from 'antd';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SearchBoxComponent from './SearchBoxComponent';

export default function HeaderComponent() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.sesi.user);

  const [badgeNotification, setBadgeNotification] = useState<number>(13);
  const [badgeMessage] = useState<number>(5);

  const handleSignOut = () => {
    dispatch(clearSesiAction());
  };

  useEffect(() => {
    getJumlahBadgeNotifikasi().then(({ data }) => setBadgeNotification(data));
  }, []);

  return (
    <nav className="flex justify-end px-5 py-2 bg-white">
      {/* <div className="w-full md:w-1/4 flex-none flex items-center">
        <h4 className="font-bold text-lg mb-0">Hai, {user?.nama}</h4>
      </div> */}
      <div className="flex items-center space-x-5 flex-grow">
        <SearchBoxComponent />
        <div className="flex items-center space-x-5 flex-grow justify-end md:pr-5">
          <div className="flex">
            <Dropdown
              overlay={
                <div
                  className="bg-white rounded p-5 border shadow"
                  style={{ maxWidth: '80vh' }}
                >
                  {badgeNotification === 0 && (
                    <Empty
                      description={
                        <span className="text-gray-500">
                          Semua aman, tidak ada notifikasi tersedia
                        </span>
                      }
                    />
                  )}
                </div>
              }
              placement="bottomRight"
              arrow
            >
              <Badge offset={[-7, 10]} count={badgeNotification}>
                <button className="rounded-full hover:bg-gray-200 p-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-7 w-7"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                  </svg>
                </button>
              </Badge>
            </Dropdown>
            <Badge offset={[-7, 10]} count={badgeMessage}>
              <button className="rounded-full hover:bg-gray-200 p-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-7 w-7"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </Badge>
            <Badge offset={[-7, 10]} count={badgeMessage}>
              <button className="rounded-full hover:bg-gray-200 p-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-7 w-7"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </Badge>
          </div>
          <Dropdown
            overlay={
              <Menu>
                <Menu.Item icon={<UserOutlined />}>
                  <Link to={'/profile'}>Akun Saya ({user?.nama})</Link>
                </Menu.Item>
                <Menu.Item icon={<LogoutOutlined />}>
                  <button onClick={handleSignOut}>Keluar</button>
                </Menu.Item>
              </Menu>
            }
            placement="bottomLeft"
            arrow
          >
            <button className="rounded-full overflow-hidden shadow hover:ring ring-gray-200">
              <img src={user?.avatar} alt={user?.nama} className="w-10 h-10" />
            </button>
          </Dropdown>
        </div>
      </div>
    </nav>
  );
}
