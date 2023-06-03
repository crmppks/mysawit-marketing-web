import { useAppDispatch, useAppSelector } from '@/hooks/redux_hooks';
import {
  getAllNotificationAction,
  getMoreNotificationAction,
  readsAllNotificationAction,
} from '@/store/actions/notifikasi';
import { clearSesiAction, getProfileDetailAction } from '@/store/actions/sesi';
import { Badge, Button, Dropdown, Empty, Skeleton } from 'antd';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import NotificationItem from '@/components/NotificationItemComponent';
import SearchBoxComponent from '@/components/SearchBoxComponent';
import { collection, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { firestore } from '@/services/firebase';

const NotifikasiOverlay = () => {
  const dispatch = useAppDispatch();
  const notifikasi = useAppSelector((state) => state.notifikasi);

  return (
    <div className="bg-white rounded p-3 border shadow overflow-auto w-80 md:max-w-[80vw] lg:max-w-[35vw] max-h-[70vh]">
      {notifikasi.loading && notifikasi.list.total === 0 && <Skeleton active />}
      {!notifikasi.loading && notifikasi.list.total === 0 && (
        <Empty
          description={<p className="text-gray-500">Semua aman, tidak ada notifikasi</p>}
        />
      )}
      {notifikasi.list.data.map((n) => (
        <NotificationItem key={n.id} notifikasi={n} />
      ))}
      {notifikasi.list.next_page_url && (
        <div className="px-5 pt-3 flex item-center justify-center">
          <Button
            loading={notifikasi.loading}
            shape="round"
            type="primary"
            onClick={() =>
              dispatch(getMoreNotificationAction(notifikasi.list.next_page_url))
            }
          >
            Muat lebih banyak
          </Button>
        </div>
      )}
    </div>
  );
};

interface Props {
  onClickSidebarMenu: () => void;
}

export default function HeaderComponent({ onClickSidebarMenu }: Props) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.sesi.user);
  const notifikasi = useAppSelector((state) => state.notifikasi);

  const [chat, setChat] = useState<number>(0);

  const handleSignOut = () => {
    dispatch(clearSesiAction());
  };

  const handleReadsNotification = () => {
    dispatch(readsAllNotificationAction(notifikasi.reads));
  };

  useEffect(() => {
    dispatch(getProfileDetailAction());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      const q = query(
        collection(firestore, process.env.REACT_APP_CHAT_COLLECTION),
        where('user_ids', 'array-contains', user.user_id),
        orderBy('updated_at', 'desc'),
      );

      const unsubscribe = onSnapshot(q, (QuerySnapshot) => {
        const roomDocs = [];
        QuerySnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.last_sender?.user_id !== user.user_id) {
            if (!data.last_sender?.read_at) {
              if (!data.deleted_by) {
                roomDocs.push({ ...data, id: doc.id });
              } else {
                if (!data.deleted_by.includes(user.user_id)) {
                  roomDocs.push({ ...data, id: doc.id });
                }
              }
            }
          }
        });
        setChat(roomDocs.length);
      });
      return () => {
        unsubscribe();
      };
    }
  }, [user]);

  return (
    <>
      <div className="bg-color-theme flex items-center justify-between md:justify-end px-5 py-1 z-50 relative">
        <div className="w-28 md:hidden">
          <Link to={'/'}>
            <img src="/logo_mysawit.png" alt="Logo PPKS" className="w-full" />
          </Link>
        </div>
        <div className="divide-x">
          <a
            href={`${process.env.REACT_APP_HOME_URL}/kebijakan-privasi`}
            className="first:pr-2 last:pl-2 text-white hover:text-black text-xs md:text-sm"
          >
            Kebijakan Privasi
          </a>
          <a
            href={process.env.REACT_APP_HOME_URL}
            className="first:pr-2 last:pl-2 text-white hover:text-black text-xs md:text-sm"
          >
            Situs MySawit
          </a>
        </div>
      </div>
      <nav className="flex justify-end px-5 py-2 bg-color-theme z-50 relative">
        <div className="flex md:hidden items-center space-x-5 flex-none justify-start">
          <button onClick={onClickSidebarMenu}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 text-white"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          </button>
        </div>
        <div className="hidden md:flex space-x-3 flex-none w-[150px] lg:w-[23vw]">
          <div className="w-28 lg:w-32 flex-none flex items-center">
            <Link to={'/'}>
              <img src="/logo_mysawit.png" alt="Logo PPKS" className="w-full" />
            </Link>
          </div>

          <div className="hidden xl:flex flex-col justify-center flex-grow border-l pl-3 py-1">
            <span className="text-white">Marketing</span>
            <span className="text-white uppercase tracking-wider font-bold">
              {user.kategori_produk?.nama}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-5 flex-grow justify-end">
          <SearchBoxComponent />
          <div className="flex items-center space-x-5 flex-none justify-end md:pr-5">
            <div className="flex">
              <Dropdown
                onVisibleChange={(visible) => {
                  if (!visible) handleReadsNotification();
                  if (visible) dispatch(getAllNotificationAction());
                }}
                overlay={<NotifikasiOverlay />}
                placement="bottomRight"
                trigger={['click']}
                arrow
              >
                <Badge offset={[-7, 10]} count={notifikasi.badge}>
                  <button className="rounded-full hover:bg-gray-400 p-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-white"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                    </svg>
                  </button>
                </Badge>
              </Dropdown>
              <Badge offset={[-7, 10]} count={chat}>
                <button
                  onClick={() => navigate('/chat')}
                  className="rounded-full hover:bg-gray-400 p-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-white"
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
            </div>
            <Dropdown
              overlay={
                <div className="bg-white rounded border shadow">
                  <div className="p-5">
                    <div className="flex space-x-5 items-center mt-2">
                      <img
                        src={user.avatar}
                        alt={user.nama}
                        className="w-12 flex-none rounded-full shadow"
                      />
                      <div className="flex-grow">
                        <h5 className="font-bold mb-0 leading-tight">{user.nama}</h5>
                        <span>{user.email}</span>
                      </div>
                    </div>
                  </div>
                  <ul className="mb-0 divide-y border-t">
                    <li>
                      <Link
                        className="block uppercase text-left hover:bg-gray-200 text-gray-500 hover:text-gray-500 px-5 py-2"
                        to={'/profile'}
                      >
                        Kelola Akun
                      </Link>
                    </li>
                    <li>
                      <button
                        className="w-full uppercase text-left hover:bg-gray-200 text-gray-500 px-5 py-2"
                        onClick={handleSignOut}
                      >
                        Keluar
                      </button>
                    </li>
                  </ul>
                </div>
              }
              placement="bottomRight"
              trigger={['click']}
              arrow
            >
              <button className="rounded-full overflow-hidden shadow hover:ring ring-gray-200">
                <img
                  src={user?.avatar}
                  alt={user?.nama}
                  className="w-6 h:6 md:w-10 md:h-10"
                />
              </button>
            </Dropdown>
          </div>
        </div>
      </nav>
    </>
  );
}
