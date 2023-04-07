import { useAppSelector } from '@/hooks/redux_hooks';
import ChatMessage from '@/types/chat/ChatMessage';
import moment from 'moment';

interface Prop {
  message: ChatMessage;
}

export default function BubbleChat({ message }: Prop) {
  const me = useAppSelector((state) => state.sesi.user);

  if (message.type === 'EVENT') {
    return (
      <div className="flex justify-center my-5">
        <div className="text-center flex flex-col">
          <small>{moment(message.created_at?.toDate()).format('HH:mm')}</small>
          <span className="flex px-3 py-[5px] bg-green-100 rounded text-xs">
            {message.message}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex ${
        me.user_id === message.user_id ? 'justify-end' : 'justify-start'
      } `}
    >
      <div
        className={`flex ${
          me.user_id === message.user_id ? 'bg-color-theme text-white ' : 'bg-gray-200'
        } rounded px-3 py-[5px] mt-1 space-x-2 max-w-[49%]`}
      >
        <span>{message.message}</span>
        <small>{moment(message.created_at?.toDate()).format('HH:mm')}</small>
      </div>
    </div>
  );
}
