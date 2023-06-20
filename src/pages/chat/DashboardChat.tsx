/* eslint-disable react-hooks/exhaustive-deps */
import { Avatar, Badge, Button, Dropdown, Input, Menu, Skeleton } from 'antd';
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
  deleteDoc,
  startAfter,
  getDocs,
} from 'firebase/firestore';
import { firestore } from '@/services/firebase';
import { useCallback, useEffect, useRef, useState } from 'react';
import moment from 'moment';
import {
  ArrowLeftOutlined,
  DeleteOutlined,
  LoadingOutlined,
  MoreOutlined,
  PaperClipOutlined,
  SearchOutlined,
  // UserAddOutlined,
} from '@ant-design/icons';
import { getPersonInitial, getSearchPerson } from '@/services/chat';
import lodash from 'lodash';
import { useAppSelector } from '@/hooks/redux_hooks';
import ChatRoom from '@/types/chat/ChatRoom';
import ChatBubble from '@/components/chat/ChatBubble';
import ChatComposer from '@/components/chat/ChatComposer';
import { useParams } from 'react-router-dom';
import { AxiosResponse } from 'axios';
import { confirmAlert } from '@/helpers/swal_helper';

export default function HalamanDashboardChat() {
  const me = useAppSelector((state) => state.sesi.user);
  const { user_id } = useParams();

  const [showListChat, setShowListChat] = useState<boolean>(true);
  const [rooms, setRooms] = useState<Array<ChatRoom>>([]);
  const [users, setUsers] = useState<Array<ChatRoom>>([]);
  const [selectedRoom, setSelectedRoom] = useState<ChatRoom>(null);
  const [messages, setMessages] = useState<Array<any>>([]);
  const [lastMessageDocument, setLastMessageDocument] = useState<any>(null);
  const [searchRoomValue, setSearchRoomValue] = useState<string>('');
  const [searchRoomLoading, setSearchRoomLoading] = useState<boolean>(false);
  const [listUserIdAlreadyChatWith, setListUserIdAlreadyChatWith] = useState<string[]>(
    [],
  );

  const selectedRoomRef = useRef<ChatRoom>(null);
  const writeMessageBoxRef = useRef<any>();
  const messagesAnchorRef = useRef<any>();
  const messagesListRef = useRef<any>();

  //this could be an array or string
  const otherPersonId: any = (room: ChatRoom) => {
    if (room) {
      if (!room.is_group) {
        return room.user_ids.find((item) => item !== me.user_id);
      }
      return room.user_ids.filter((item) => item !== me.user_id);
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

  const handleSearchRoom = (q: string) => {
    setSearchRoomLoading(true);
    getSearchPerson(q)
      .then(({ data }: AxiosResponse<ChatRoom[]>) => {
        setUsers(
          data.filter((user) => {
            return !listUserIdAlreadyChatWith.includes(user.id);
          }),
        );
      })
      .finally(() => setSearchRoomLoading(false));
    setRooms((prev) =>
      prev.filter((room) => {
        if (room.is_group) {
          return room.title[me.user_id].toLowerCase().includes(q.toLowerCase());
        }
        return room.title[otherPersonId(room)].toLowerCase().includes(q.toLowerCase());
      }),
    );
  };

  const handleStartConversation = async () => {
    setSelectedRoom((prev) => ({
      ...prev,
      is_starting: true,
    }));

    const chatRoomDoc = await addDoc(
      collection(firestore, process.env.REACT_APP_CHAT_COLLECTION),
      {
        ...selectedRoom,
        is_new: false,
        updated_at: serverTimestamp(),
      },
    );

    await addDoc(
      collection(
        doc(firestore, process.env.REACT_APP_CHAT_COLLECTION, chatRoomDoc.id),
        'messages',
      ),
      {
        type: 'EVENT',
        message: 'Percakapan dimulai',
        created_at: serverTimestamp(),
      },
    );

    setSearchRoomValue('');
    setSelectedRoom((prev) => ({
      ...prev,
      id: chatRoomDoc.id,
      is_new: false,
      is_starting: false,
      updated_at: moment().toISOString(),
    }));
  };

  const handleDeleteConversation = () => {
    confirmAlert(
      'Hapus Percakapan',
      'Apakah anda yakin untuk menghapus percakapan ini?',
    ).then((yes) => {
      if (yes) {
        // updateDoc(
        //   doc(firestore, process.env.REACT_APP_CHAT_COLLECTION, selectedRoom.id),
        //   {
        //     deleted_by: selectedRoom.deleted_by
        //       ? [...selectedRoom.deleted_by, me.user_id]
        //       : [me.user_id],
        //   },
        // );
        setRooms((prev) => prev.filter((item) => item.id !== selectedRoom.id));
        setSelectedRoom(null);

        // if (selectedRoom.deleted_by?.includes(otherPersonId(selectedRoom))) {
        deleteDoc(doc(firestore, process.env.REACT_APP_CHAT_COLLECTION, selectedRoom.id));
        // }
      }
    });
  };

  const handleLoadPreviousMessages = async () => {
    if (lastMessageDocument) {
      const q = query(
        collection(
          firestore,
          `${process.env.REACT_APP_CHAT_COLLECTION}/${selectedRoom.id}/messages`,
        ),
        orderBy('created_at', 'desc'),
        startAfter(lastMessageDocument),
        limit(50),
      );

      getDocs(q).then((QuerySnapshot) => {
        if (QuerySnapshot.size > 0) {
          setLastMessageDocument(QuerySnapshot.docs[QuerySnapshot.size - 1]);
        } else {
          setLastMessageDocument(null);
        }

        const messageDocs = [];
        QuerySnapshot.forEach((doc) => {
          messageDocs.push({ ...doc.data(), id: doc.id });
        });
        const reversed = messageDocs.reverse();
        setMessages((prev) => [...reversed, ...prev]);
      });
    }
  };

  const handleScroll = () => {
    const container = messagesListRef.current;
    const scrollTop = container?.scrollTop;

    if (scrollTop === 0) {
      handleLoadPreviousMessages();
    }
  };

  useEffect(() => {
    if (!searchRoomValue) {
      setUsers([]);

      const q = query(
        collection(firestore, process.env.REACT_APP_CHAT_COLLECTION),
        where('user_ids', 'array-contains', me.user_id),
        orderBy('updated_at', 'desc'),
      );

      const unsubscribe = onSnapshot(q, (QuerySnapshot) => {
        const roomDocs = [];
        QuerySnapshot.forEach((doc) => {
          roomDocs.push({ ...doc.data(), id: doc.id });
        });
        setRooms(
          roomDocs.filter((room) => {
            if (!room.deleted_by) {
              return true;
            }
            return !room.deleted_by.includes(me.user_id);
          }),
        );
        setListUserIdAlreadyChatWith(
          roomDocs
            .filter((room) => {
              if (room.is_group) return false;
              if (!room.deleted_by) return true;
              return room.deleted_by.length === 0;
            })
            .map((item) => {
              return item.user_ids.find((id: string) => id !== me.user_id);
            }),
        );

        if (user_id) {
          const selected = roomDocs.find((room) => {
            return !room.is_group && room.user_ids.includes(user_id);
          });

          // if (selected) setTimeout(() => setSelectedRoom(selected), 5000);
          if (!selected && !selectedRoomRef.current) {
            getPersonInitial(user_id).then(({ data }: AxiosResponse<ChatRoom[]>) => {
              setUsers(data);
              setSelectedRoom(
                data.find((room) => {
                  return !room.is_group && room.user_ids.includes(user_id);
                }),
              );
            });
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
      setShowListChat(false);
      setMessages([]);

      if (!selectedRoom.is_new) {
        writeMessageBoxRef.current.scrollIntoView({ behavior: 'smooth' });

        const updateRoomDocument: any = {
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
        };

        if (selectedRoom.last_sender) {
          if (selectedRoom.last_sender.user_id !== me.user_id) {
            updateRoomDocument.last_sender = {
              ...selectedRoom.last_sender,
              read_at: moment().toISOString(),
            };
          }
        }

        updateDoc(
          doc(firestore, process.env.REACT_APP_CHAT_COLLECTION, selectedRoom.id),
          updateRoomDocument,
        );

        const q = query(
          collection(
            firestore,
            `${process.env.REACT_APP_CHAT_COLLECTION}/${selectedRoom.id}/messages`,
          ),
          orderBy('created_at', 'desc'),
          limit(50),
        );
        const unsubscribe = onSnapshot(q, (QuerySnapshot) => {
          if (QuerySnapshot.size > 0) {
            setLastMessageDocument(QuerySnapshot.docs[QuerySnapshot.size - 1]);
          }

          const messageDocs = [];
          QuerySnapshot.forEach((doc) => {
            messageDocs.push({ ...doc.data(), id: doc.id });
          });
          setMessages(messageDocs.reverse());
          messagesAnchorRef.current.scrollIntoView({ behavior: 'smooth' });
        });
        return () => {
          updateDoc(
            doc(firestore, process.env.REACT_APP_CHAT_COLLECTION, selectedRoom.id),
            {
              last_seen: {
                ...selectedRoom.last_seen,
                [me.user_id]: moment().toISOString(),
              },
            },
          ).catch((e) => console.log(e));
          unsubscribe();
        };
      }
    }
  }, [selectedRoom]);

  useEffect(() => {
    if (rooms.length > 0) {
      if (!selectedRoom && user_id) {
        setSelectedRoom(
          rooms.find((room) => {
            return !room.is_group && room.user_ids.includes(user_id as string);
          }),
        );
      }
    }
  }, [rooms]);

  useEffect(() => {
    const container = messagesListRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [lastMessageDocument]);

  return (
    <>
      <button
        onClick={() => setShowListChat((prev) => !prev)}
        className="flex md:hidden px-5 py-3 border-b border-gray-400"
      >
        {showListChat ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-6 h-6"
          >
            <path
              fillRule="evenodd"
              d="M7.72 12.53a.75.75 0 010-1.06l7.5-7.5a.75.75 0 111.06 1.06L9.31 12l6.97 6.97a.75.75 0 11-1.06 1.06l-7.5-7.5z"
              clipRule="evenodd"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-6 h-6"
          >
            <path
              fillRule="evenodd"
              d="M16.28 11.47a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 011.06-1.06l7.5 7.5z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </button>
      <section className="flex-grow w-full flex bg-white z-40 relative">
        <div
          className={`absolute inset-0 md:inset-auto md:relative z-40 md:z-auto ${
            showListChat ? 'flex' : 'hidden md:flex'
          } flex-col flex-none w-full md:w-4/12 lg:w-3/12 bg-gray-300 border-r border-l border-gray-400 overflow-y-auto h-screen`}
        >
          <div className="px-5 py-3 md:p-3 z-50">
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
          <div className="flex-1">
            {rooms.length === 0 && !searchRoomValue && (
              <div className="absolute px-3 md:px-5 inset-0 flex flex-col items-center justify-center">
                <Skeleton />
              </div>
            )}
            <div className="divide-y divide-gray-400">
              {searchRoomValue && (
                <>
                  <div className="px-5 py-3 md:p-3">
                    <strong className="text-color-theme">PERCAKAPAN</strong>
                  </div>
                  {rooms.length === 0 && (
                    <div className="p-5 flex flex-col items-center justify-center text-gray-400">
                      <SearchOutlined className="text-4xl" />
                      <p className="text-center">Tidak ada percakapan ditemukan</p>
                    </div>
                  )}
                </>
              )}
              {rooms.map((room) => (
                <div
                  key={room.id}
                  onClick={() => {
                    setSelectedRoom(room);
                    selectedRoomRef.current = room;
                  }}
                  className={`px-5 py-3 md:p-3 space-x-3 flex cursor-pointer hover:bg-gray-100 ${
                    selectedRoom?.id === room.id && 'bg-gray-100'
                  }`}
                >
                  {room.id === selectedRoom?.id && selectedRoom?.is_starting ? (
                    <div className="w-[40px] flex items-center">
                      <LoadingOutlined className="text-3xl" />
                    </div>
                  ) : room.last_seen[otherPersonId(room)] === 'ONLINE' ? (
                    <Badge dot color="blue">
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
                    <h4
                      className={`mb-0 ${
                        room.last_sender?.user_id !== me.user_id &&
                        !room.last_sender?.read_at
                          ? 'font-bold'
                          : 'font-regular'
                      }`}
                    >
                      {room.title[otherPersonId(room)]}
                    </h4>
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
                      <p
                        className={`flex-1 mb-0 text-ellipsis overflow-hidden whitespace-nowrap ${
                          room.last_sender?.user_id !== me.user_id &&
                          !room.last_sender?.read_at
                            ? 'font-bold'
                            : 'font-regular text-gray-500'
                        }`}
                      >
                        {room.last_sender ? (
                          room.last_sender.is_attachment ? (
                            <>
                              <PaperClipOutlined /> {room.last_sender.message}
                            </>
                          ) : (
                            room.last_sender.message
                          )
                        ) : (
                          room.subtitle[otherPersonId(room)]
                        )}
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
              {searchRoomValue && (
                <>
                  <div className="px-5 py-3 md:p-3">
                    <strong className="text-color-theme">PENGGUNA</strong>
                  </div>
                  {searchRoomLoading ? (
                    <Skeleton active className="px-3" />
                  ) : (
                    <>
                      {users.length === 0 && (
                        <div className="p-5 flex flex-col items-center justify-center text-gray-400">
                          <SearchOutlined className="text-4xl" />
                          <p className="text-center">Tidak ada pengguna ditemukan</p>
                        </div>
                      )}
                      {users.map((room) => (
                        <div
                          key={room.id}
                          onClick={() => {
                            setSelectedRoom(room);
                            selectedRoomRef.current = room;
                          }}
                          className={`px-5 py-3 md:p-3 space-x-3 flex cursor-pointer hover:bg-gray-100 ${
                            selectedRoom?.id === room.id && 'bg-gray-100'
                          }`}
                        >
                          {room.id === selectedRoom?.id && selectedRoom?.is_starting ? (
                            <div className="w-[40px] flex items-center">
                              <LoadingOutlined className="text-3xl" />
                            </div>
                          ) : room.last_seen[otherPersonId(room)] === 'ONLINE' ? (
                            <Badge dot color="blue">
                              <Avatar
                                size="large"
                                src={room.avatar[otherPersonId(room)]}
                              />
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
                                  : moment().isSame(
                                      moment(room.updated_at.toDate()),
                                      'year',
                                    )
                                  ? 'DD/MM HH:mm'
                                  : 'YYYY/MM/DD',
                              )}
                            </small>
                          )}
                        </div>
                      ))}
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
        <div className="relative flex-grow flex flex-col">
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
              <p className="text-gray-400 p-5 text-center">
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
                <div className="flex-grow flex flex-col justify-center">
                  <h5 className="mb-0 w-[70vw] md:w-auto text-ellipsis whitespace-nowrap overflow-hidden leading-tight">
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
                        <span className="font-bold text-green-600">online</span>
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
                {!selectedRoom.is_new && (
                  <Dropdown
                    arrow
                    placement="bottomRight"
                    overlay={
                      <Menu>
                        {/* <Menu.Item key={'add-people'} icon={<UserAddOutlined />}>
                        Tambah Orang
                      </Menu.Item> */}
                        <Menu.Item
                          key={'remove-room'}
                          icon={<DeleteOutlined />}
                          onClick={() => handleDeleteConversation()}
                        >
                          Hapus Percakapan
                        </Menu.Item>
                      </Menu>
                    }
                    trigger={['click']}
                  >
                    <button className="text-lg">
                      <MoreOutlined />
                    </button>
                  </Dropdown>
                )}
              </div>
              <div ref={messagesListRef} className="flex-1 relative overflow-y-auto">
                {selectedRoom.is_new && (
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
                    <p className="text-gray-400 p-5 text-center">
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
                  <div className="p-5 md:px-10">
                    {messages.map((message, index) => (
                      <ChatBubble
                        key={message.id}
                        message={message}
                        before={index > 0 ? messages[index - 1] : null}
                        after={index < messages.length ? messages[index + 1] : null}
                      />
                    ))}
                  </div>
                )}
                <div ref={messagesAnchorRef}></div>
              </div>
              {!selectedRoom.is_new && (
                <ChatComposer
                  firestore={firestore}
                  containerRef={writeMessageBoxRef}
                  rooms={rooms}
                  selectedRoom={selectedRoom}
                  onRoomGone={() => setSelectedRoom(null)}
                />
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
}
