import { readsNotificationAction } from '@/store/actions/notifikasi';
import Notifikasi from '@/types/Notifikasi';
import moment from 'moment';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

interface Props {
  notifikasi: Notifikasi;
}
export default function NotificationItem({ notifikasi }: Props) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleOnRead = () => {
    if (!notifikasi.read_at) dispatch(readsNotificationAction(notifikasi.id));
    if (notifikasi.data.reference_type === 'App\\Pesanan') {
      navigate(`/pesanan/${notifikasi.data.reference_id}`);
    }
  };

  return (
    <div
      key={notifikasi.id}
      onClick={handleOnRead}
      className="flex space-x-5 rounded px-5 py-3 hover:bg-gray-200 cursor-pointer"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={`h-8 w-8 flex-none ${
          notifikasi.read_at ? 'text-gray-500' : 'text-color-theme'
        }`}
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
      </svg>
      <div className="flex-grow">
        <div className="flex space-x-3">
          <h6
            className={`font-bold my-0 leading-tight ${
              notifikasi.read_at ? 'text-gray-500' : 'text-black'
            }`}
          >
            {notifikasi.data.title}
          </h6>
          <span className="text-gray-400 text-xs">
            {moment(notifikasi.created_at).fromNow()}
          </span>
        </div>
        <p className={`mb-0 ${notifikasi.read_at ? 'text-gray-500' : 'text-black'}`}>
          {notifikasi.data.body}
        </p>
      </div>
    </div>
  );
}
