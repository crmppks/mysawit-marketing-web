import { useAppSelector } from '@/hooks/redux_hooks';
import ChatMessage from '@/types/chat/ChatMessage';
import { FileOutlined } from '@ant-design/icons';
import moment from 'moment';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';

interface Prop {
  before?: ChatMessage;
  message: ChatMessage;
  after?: ChatMessage;
}

export default function ChatBubble({ message, before, after }: Prop) {
  const my_id = useAppSelector((state) => state.sesi.user.user_id);

  const borderRadiusStyle = useMemo(() => {
    let value = '';

    if (message.user_id === my_id) {
      value = 'rounded-l-lg';

      if (
        before?.user_id !== message.user_id ||
        !moment(before?.created_at?.toDate()).isSame(
          moment(message.created_at?.toDate()),
          'day',
        )
      ) {
        value = `${value} rounded-tr-lg`;
      }

      if (
        after?.user_id !== message.user_id ||
        !moment(after?.created_at?.toDate()).isSame(
          moment(message.created_at?.toDate()),
          'day',
        )
      ) {
        value = `${value} rounded-br-lg`;
      }

      return value;
    }

    if (message.user_id !== my_id) {
      value = 'rounded-r-lg';

      if (
        before?.user_id !== message.user_id ||
        !moment(before?.created_at?.toDate()).isSame(
          moment(message.created_at?.toDate()),
          'day',
        )
      ) {
        value = `${value} rounded-tl-lg`;
      }

      if (
        after?.user_id !== message.user_id ||
        !moment(after?.created_at?.toDate()).isSame(
          moment(message.created_at?.toDate()),
          'day',
        )
      ) {
        value = `${value} rounded-bl-lg`;
      }

      return value;
    }

    return value;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [message, before, after]);

  if (message.type === 'EVENT') {
    return (
      <div className="flex justify-center my-5">
        <div className="text-center flex flex-col">
          <small>
            {moment(message.created_at?.toDate()).format(
              moment().isSame(moment(message.created_at?.toDate()), 'day')
                ? 'HH:mm'
                : 'DD MMMM yyyy, HH:mm',
            )}
          </small>
          <span className="flex px-3 py-[5px] bg-blue-100 rounded-full text-xs">
            {message.message}
          </span>
        </div>
      </div>
    );
  }

  return (
    <>
      {before?.type === 'MESSAGE' &&
        !moment(message.created_at?.toDate()).isSame(
          moment(before.created_at.toDate()),
          'day',
        ) && (
          <div className="flex justify-center my-5">
            <div className="text-center flex flex-col">
              <span className="flex px-3 py-[5px] bg-blue-100 rounded-full text-xs">
                {moment(message.created_at?.toDate()).format('DD MMMM yyyy')}
              </span>
            </div>
          </div>
        )}
      <div
        className={`flex ${my_id === message.user_id ? 'justify-end' : 'justify-start'} `}
      >
        <div
          className={`flex ${
            message.attachment ? 'flex-col space-y-1 items-end' : 'flex-row space-x-2'
          } ${
            my_id === message.user_id ? 'bg-color-theme text-white ' : 'bg-gray-200'
          } ${borderRadiusStyle} px-3 py-[5px] mt-1 max-w-[75%]`}
        >
          {message.attachment ? (
            <>
              <small>{moment(message.created_at?.toDate()).format('HH:mm')}</small>
              <div
                className={`flex flex-col space-y-1 ${
                  message.user_id !== my_id ? 'items-start' : 'items-end'
                }`}
              >
                {message.attachment.type === 'FILE' &&
                  (message.attachment.file.mime.includes('image') ? (
                    <img
                      src={message.attachment.file.url}
                      alt={message.attachment.file.name}
                      className="max-w-full rounded"
                    />
                  ) : (
                    <a
                      target="_blank"
                      href={message.attachment.file.url}
                      rel="noreferrer"
                      className={`flex items-center space-x-2 p-1 pr-2 rounded border ${
                        message.user_id !== my_id
                          ? 'border-color-theme text-color-theme'
                          : 'border-gray-200 hover:border-white text-gray-200 hover:text-white'
                      } mt-1`}
                    >
                      <span
                        className={`${
                          message.user_id !== my_id
                            ? 'bg-color-theme text-white'
                            : 'bg-gray-200 text-color-theme'
                        } px-3 py-2 rounded`}
                      >
                        <FileOutlined />
                      </span>
                      <strong>{message.attachment.file.name}</strong>
                    </a>
                  ))}
                {message.attachment.type === 'PRODUCT' && (
                  <Link to={`/produk/${message.attachment.product.id}`}>
                    <button
                      className={`border bg-white w-28 rounded overflow-hidden shadow`}
                    >
                      <img
                        src={message.attachment.product.banner}
                        alt={message.attachment.product.nama}
                        className="w-full"
                      />
                      <h4 className="text-xs p-2 text-ellipsis overflow-hidden whitespace-nowrap">
                        {message.attachment.product.nama}
                      </h4>
                    </button>
                  </Link>
                )}
                <span>{message.message}</span>
              </div>
            </>
          ) : (
            <>
              <span>{message.message}</span>
              <small>{moment(message.created_at?.toDate()).format('HH:mm')}</small>
            </>
          )}
        </div>
      </div>
    </>
  );
}
