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
import { collection, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { firestore } from '@/services/firebase';
import NotificationItem from './NotificationItemComponent';
import SearchBoxComponent from './SearchBoxComponent';

export default function HeaderComponent() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.sesi.user);
  const notifikasi = useAppSelector((state) => state.notifikasi);

  const [badgeChat, setBadgeChat] = useState<number>(0);

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
        setBadgeChat(roomDocs.length);
      });
      return () => {
        unsubscribe();
      };
    }
  }, [user]);

  return (
    <>
      <div className="bg-amber-500 flex justify-end px-5 pt-1 z-50 relative">
        <div className="divide-x">
          <a
            href={`${process.env.REACT_APP_HOME_URL}/aplikasi`}
            className="first:pr-2 last:pl-2 text-white hover:text-black"
          >
            Kebijakan Privasi
          </a>
          <a
            href={process.env.REACT_APP_HOME_URL}
            className="first:pr-2 last:pl-2 text-white hover:text-black"
          >
            Situs MySawit
          </a>
        </div>
      </div>
      <nav className="flex justify-end px-5 py-2 bg-color-theme z-50 relative">
        <div className="flex space-x-3 flex-none w-[250px] lg:w-[23vw]">
          <div className="w-28 lg:w-32 flex-none flex items-center">
            <img src="/logo_mysawit.png" alt="Logo PPKS" className="w-full" />
          </div>

          <div className="flex flex-col justify-center flex-grow mt-3 border-l pl-3 space-y-1 py-1">
            <span className="text-xs text-gray-500">Marketing</span>
            <span className="font-bold uppercase text-gray-700 leading-tight">
              {user.kategori_produk.nama}
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
                overlay={
                  <div className="bg-white rounded p-3 border shadow overflow-auto w-96 md:max-w-[80vw] lg:max-w-[35vw] max-h-[70vh]">
                    {notifikasi.loading && notifikasi.list.total === 0 && (
                      <Skeleton active />
                    )}
                    {!notifikasi.loading && notifikasi.list.total === 0 && (
                      <Empty
                        description={
                          <p className="text-gray-500">
                            Semua aman, tidak ada notifikasi
                          </p>
                        }
                      />
                    )}
                    {notifikasi.list.data.map((notifikasi) => (
                      <NotificationItem key={notifikasi.id} notifikasi={notifikasi} />
                    ))}
                    {notifikasi.list.next_page_url && (
                      <div className="px-5 pt-3 flex item-center justify-center">
                        <Button
                          loading={notifikasi.loading}
                          shape="round"
                          type="primary"
                          onClick={() =>
                            dispatch(
                              getMoreNotificationAction(notifikasi.list.next_page_url),
                            )
                          }
                        >
                          Muat lebih banyak
                        </Button>
                      </div>
                    )}
                  </div>
                }
                placement="bottomRight"
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
              <Badge offset={[-7, 10]} count={badgeChat}>
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
                        <span>{user.kategori_produk?.nama}</span>
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
              arrow
            >
              <button className="rounded-full overflow-hidden shadow hover:ring ring-gray-200">
                <img src={user?.avatar} alt={user?.nama} className="w-10 h-10" />
              </button>
            </Dropdown>
          </div>
        </div>
      </nav>
    </>
  );
}
