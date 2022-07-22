import { useAppDispatch, useAppSelector } from '@/hooks/redux_hooks';
import { getJumlahBadgeNotifikasi } from '@/services/notifikasi';
import { clearSesiAction } from '@/store/actions/sesi';
import { LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { Badge, Button, Dropdown, Empty, Menu } from 'antd';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SearchBoxComponent from './SearchBoxComponent';

export default function HeaderComponent() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.sesi.user);

  const [badgeNotification, setBadgeNotification] = useState<number>(0);
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
      <div className="flex-none flex items-center mr-5">
        <Dropdown
          overlay={
            <Menu>
              <Menu.Item icon={<UserOutlined />}>
                <Link to={'/profile'}>Akun Saya</Link>
              </Menu.Item>
              <Menu.Item icon={<LogoutOutlined />}>
                <button onClick={handleSignOut}>Keluar</button>
              </Menu.Item>
            </Menu>
          }
          placement="bottomLeft"
          arrow
        >
          <button>
            <img
              src={user?.avatar}
              alt={user?.nama}
              className="w-10 h-10 rounded-full ring ring-green-600"
            />
          </button>
        </Dropdown>
      </div>
      <div className="flex items-center space-x-5 flex-grow">
        <SearchBoxComponent />
        <div className="flex items-center space-x-3 flex-grow justify-end md:pr-5">
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
            <Badge count={badgeNotification}>
              <Button>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                </svg>
              </Button>
            </Badge>
          </Dropdown>
          <Badge count={badgeMessage}>
            <Button>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5 3a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2H5zm0 2h10v7h-2l-1 2H8l-1-2H5V5z"
                  clipRule="evenodd"
                />
              </svg>
            </Button>
          </Badge>
        </div>
      </div>
    </nav>
  );
}
