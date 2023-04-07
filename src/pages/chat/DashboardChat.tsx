/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { Avatar, Badge, Button, Input } from 'antd';
import {
  query,
  where,
  collection,
  orderBy,
  onSnapshot,
  limit,
  addDoc,
  updateDoc,
  doc,
  serverTimestamp,
} from 'firebase/firestore';
import { firestore } from '@/services/firebase';
import { useCallback, useEffect, useRef, useState } from 'react';
import moment from 'moment';
import {
  ArrowLeftOutlined,
  LoadingOutlined,
  MoreOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { getSearchPerson } from '@/services/chat';
import lodash from 'lodash';
import { useAppSelector } from '@/hooks/redux_hooks';
import ChatRoom from '@/types/chat/ChatRoom';
import BubbleChat from '@/components/chat/BubbleChat';

export default function HalamanDashboardChat() {
  const me = useAppSelector((state) => state.sesi.user);

  const [rooms, setRooms] = useState<Array<ChatRoom>>([]);
  const [selectedRoom, setSelectedRoom] = useState<ChatRoom>(null);
  const [messages, setMessages] = useState<Array<any>>([]);
  const [messageValue, setMessageValue] = useState<string>('');
  const [searchRoomValue, setSearchRoomValue] = useState<string>('');
  const [searchRoomLoading, setSearchRoomLoading] = useState<boolean>(false);

  const writeMessageBoxRef = useRef<any>();
  const messagesAnchorRef = useRef<any>();

  const otherPersonId = (room: ChatRoom) => {
    if (room) {
      const value = room.user_ids.find((item) => item !== me.user_id);
      return value;
    }
    return null;
  };

  const debounceSearchRoom = useCallback(
    lodash.debounce((value: string) => {
      if (value) {
        handleSearchRoom(value);
      }
    }, 400),
    [],
  );

  const handleSearchRoom = (query: string) => {
    setSearchRoomLoading(true);
    getSearchPerson(query)
      .then(({ data }) => setRooms(data))
      .finally(() => setSearchRoomLoading(false));
  };

  const handleStartConversation = async () => {
    setSelectedRoom((prev) => ({
      ...prev,
      is_starting: true,
    }));

    const chatRoomDoc = await addDoc(collection(firestore, 'chat'), {
      ...selectedRoom,
      is_new: false,
      updated_at: serverTimestamp(),
    });

    await addDoc(collection(doc(firestore, 'chat', chatRoomDoc.id), 'messages'), {
      type: 'EVENT',
      message: 'Percakapan dimulai',
      user_id: me.user_id,
      created_at: serverTimestamp(),
    });

    setSelectedRoom((prev) => ({
      ...prev,
      id: chatRoomDoc.id,
      is_new: false,
      is_starting: false,
      updated_at: moment().toISOString(),
    }));
  };

  const handleSendMessage = async () => {
    await addDoc(collection(doc(firestore, 'chat', selectedRoom.id), 'messages'), {
      type: 'MESSAGE',
      message: messageValue,
      user_id: me.user_id,
      created_at: serverTimestamp(),
    });
    setMessageValue('');
    messagesAnchorRef.current.scrollIntoView({ behavior: 'smooth' });

    updateDoc(doc(firestore, 'chat', selectedRoom.id), {
      updated_at: serverTimestamp(),
      last_sender: {
        user_id: me.user_id,
        message: messageValue,
      },
    });
  };

  useEffect(() => {
    if (!searchRoomValue) {
      const q = query(
        collection(firestore, 'chat'),
        where('user_ids', 'array-contains', me.user_id),
        orderBy('updated_at', 'desc'),
        limit(50),
      );
      const unsubscribe = onSnapshot(q, (QuerySnapshot) => {
        const roomDocs = [];
        QuerySnapshot.forEach((doc) => {
          roomDocs.push({ ...doc.data(), id: doc.id });
        });
        setRooms(roomDocs);

        if (selectedRoom) {
          if (!roomDocs.find((value) => value.id === selectedRoom.id)) {
            setSelectedRoom(null);
          }
        }
      });
      return () => {
        unsubscribe();
      };
    }
  }, [searchRoomValue]);

  useEffect(() => {
    if (selectedRoom) {
      setMessages([]);

      if (!selectedRoom.is_new) {
        writeMessageBoxRef.current.scrollIntoView({ behavior: 'smooth' });

        updateDoc(doc(firestore, 'chat', selectedRoom.id), {
          last_seen: {
            ...selectedRoom.last_seen,
            [me.user_id]: 'ONLINE',
          },
          avatar: {
            ...selectedRoom.avatar,
            [me.user_id]: me.avatar,
          },
          title: {
            ...selectedRoom.title,
            [me.user_id]: me.nama,
          },
        });

        const q = query(
          collection(firestore, `chat/${selectedRoom.id}/messages`),
          orderBy('created_at'),
          limit(50),
        );
        const unsubscribe = onSnapshot(q, (QuerySnapshot) => {
          const messageDocs = [];
          QuerySnapshot.forEach((doc) => {
            messageDocs.push({ ...doc.data(), id: doc.id });
          });
          setMessages(messageDocs);
          messagesAnchorRef.current.scrollIntoView({ behavior: 'smooth' });
        });

        return () => {
          updateDoc(doc(firestore, 'chat', selectedRoom.id), {
            last_seen: {
              ...selectedRoom.last_seen,
              [me.user_id]: moment().toISOString(),
            },
          });
          unsubscribe();
        };
      }
    }
  }, [selectedRoom]);

  return (
    <section className="absolute inset-0 w-full flex bg-white z-40">
      <div className="relative flex flex-col w-full md:w-4/12 lg:w-3/12 bg-gray-300 border-r border-l border-gray-400 overflow-y-auto">
        <div className="p-3 z-50">
          <Input
            addonBefore={
              searchRoomValue ? (
                <>
                  {searchRoomLoading ? (
                    <LoadingOutlined />
                  ) : (
                    <button onClick={() => setSearchRoomValue('')}>
                      <ArrowLeftOutlined />
                    </button>
                  )}
                </>
              ) : (
                <SearchOutlined />
              )
            }
            allowClear
            size="large"
            value={searchRoomValue}
            onChange={(event) => {
              setSearchRoomValue(event.target.value);
              debounceSearchRoom(event.target.value);
            }}
            onKeyUp={(event) => {
              if (event.key === 'Enter') {
                handleSearchRoom(searchRoomValue);
              }
            }}
            placeholder="Cari orang atau group"
            className="w-full"
          />
        </div>
        <div className="flex-1 divide-y divide-gray-400 border-gray-400">
          {rooms.length === 0 && (
            <div className="absolute px-5 inset-0 flex flex-col items-center justify-center">
              {searchRoomValue ? (
                <>
                  {searchRoomLoading ? (
                    <LoadingOutlined className="text-4xl" />
                  ) : (
                    <>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="text-gray-400 w-16 h-16"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                        />
                      </svg>
                      <p className="text-gray-400 text-center">
                        Tidak ada hasil pencarian
                      </p>
                    </>
                  )}
                </>
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="text-gray-400 w-16 h-16"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
                    />
                  </svg>
                  <p className="text-gray-400 text-center">
                    Cari pengguna untuk memulai percakapan
                  </p>
                </>
              )}
            </div>
          )}
          {rooms.map((room) => (
            <div
              key={room.id}
              onClick={() => setSelectedRoom(room)}
              className={`p-3 space-x-3 flex cursor-pointer hover:bg-gray-100 ${
                selectedRoom?.id === room.id && 'bg-gray-100'
              }`}
            >
              {room.id === selectedRoom?.id && selectedRoom?.is_starting ? (
                <div className="w-[40px] flex items-center">
                  <LoadingOutlined className="text-3xl" />
                </div>
              ) : room.last_seen[otherPersonId(room)] === 'ONLINE' ? (
                <Badge dot status="warning">
                  <Avatar size="large" src={room.avatar[otherPersonId(room)]} />
                </Badge>
              ) : (
                <Avatar size="large" src={room.avatar[otherPersonId(room)]} />
              )}
              <div
                className="flex-1 leading-tight overflow-hidden"
                title={`${
                  room.last_sender
                    ? room.last_sender.message
                    : room.title[otherPersonId(room)]
                }`}
              >
                <h4 className="mb-0">{room.title[otherPersonId(room)]}</h4>
                <div className="flex space-x-1 items-center">
                  {room.last_sender?.user_id === me.user_id && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="w-3 h-3 flex-0"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                  <p className="flex-1 mb-0 text-gray-500 text-ellipsis overflow-hidden whitespace-nowrap">
                    {room.last_sender
                      ? room.last_sender.message
                      : room.subtitle[otherPersonId(room)]}
                  </p>
                </div>
              </div>
              {room.updated_at && (
                <small className="text-gray-400">
                  {moment(room.updated_at.toDate()).format(
                    moment().isSame(moment(room.updated_at.toDate()), 'day')
                      ? 'HH:mm'
                      : moment().isSame(moment(room.updated_at.toDate()), 'year')
                      ? 'DD/MM HH:mm'
                      : 'YYYY/MM/DD',
                  )}
                </small>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="w-full md:w-8/12 lg:w-9/12 relative flex flex-col">
        {!selectedRoom && (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="text-gray-400 w-16 h-16"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155"
              />
            </svg>
            <p className="text-gray-400">
              Buka riwayat percakapan atau mulai percakapan baru
            </p>
          </div>
        )}
        {selectedRoom && (
          <>
            <div className="bg-gray-300 flex space-x-3 py-3 px-5">
              <Avatar
                size="large"
                src={selectedRoom.avatar[otherPersonId(selectedRoom)]}
              />
              <div className="flex-1 flex flex-col justify-center leading-tight">
                <h5 className="mb-0">
                  {selectedRoom.title[otherPersonId(selectedRoom)]}
                </h5>
                {selectedRoom.is_group ? (
                  <span className="text-gray-400">
                    {selectedRoom.user_ids.length} anggota
                  </span>
                ) : (
                  <>
                    {selectedRoom.last_seen[otherPersonId(selectedRoom)] === 'NULL' ? (
                      selectedRoom.subtitle[otherPersonId(selectedRoom)]
                    ) : selectedRoom.last_seen[otherPersonId(selectedRoom)] ===
                      'ONLINE' ? (
                      <span className="font-bold text-color-theme">online</span>
                    ) : (
                      <span className="text-gray-400">
                        {moment(
                          selectedRoom.last_seen[otherPersonId(selectedRoom)],
                        ).fromNow()}
                      </span>
                    )}
                  </>
                )}
              </div>
              <button className="text-lg">
                <SearchOutlined />
              </button>
              <button className="text-lg">
                <MoreOutlined />
              </button>
            </div>
            <div className="flex-1 relative overflow-y-auto">
              {selectedRoom.is_new && (
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="text-gray-400 w-20 h-20"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
                    />
                  </svg>
                  <p className="text-gray-400">
                    Anda belum memiliki riwayat percakapan dengan pengguna ini
                  </p>
                  <Button
                    shape="round"
                    type="primary"
                    loading={selectedRoom.is_starting}
                    onClick={() => handleStartConversation()}
                  >
                    Mulai Percakapan
                  </Button>
                </div>
              )}
              {!selectedRoom.is_new && (
                <div className="py-5 px-10">
                  {messages.map((message) => (
                    <BubbleChat key={message.id} message={message} />
                  ))}
                </div>
              )}
              <div ref={messagesAnchorRef}></div>
            </div>
            {!selectedRoom.is_new && (
              <div
                ref={writeMessageBoxRef}
                className="flex space-x-5 items-center bg-gray-300 py-2 px-5"
              >
                <button className="text-lg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18.97 3.659a2.25 2.25 0 00-3.182 0l-10.94 10.94a3.75 3.75 0 105.304 5.303l7.693-7.693a.75.75 0 011.06 1.06l-7.693 7.693a5.25 5.25 0 11-7.424-7.424l10.939-10.94a3.75 3.75 0 115.303 5.304L9.097 18.835l-.008.008-.007.007-.002.002-.003.002A2.25 2.25 0 015.91 15.66l7.81-7.81a.75.75 0 011.061 1.06l-7.81 7.81a.75.75 0 001.054 1.068L18.97 6.84a2.25 2.25 0 000-3.182z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
                <div className="flex-1">
                  <Input
                    autoFocus
                    value={messageValue}
                    onChange={(event) => setMessageValue(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') {
                        handleSendMessage();
                      }
                    }}
                    placeholder="Tulis pesan"
                    className="w-full"
                    size="large"
                  />
                </div>
                <button
                  onClick={() => {
                    if (messageValue) {
                      handleSendMessage();
                    }
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-6 h-6"
                  >
                    <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
                  </svg>
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
