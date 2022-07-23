import { Button, PageHeader } from 'antd';
import moment from 'moment';
import { useAppSelector } from '@/hooks/redux_hooks';
import { Link } from 'react-router-dom';
import { LockOutlined, UserOutlined } from '@ant-design/icons';

export default function HalamanDetailProfile() {
  const session = useAppSelector((state) => state.sesi.user);

  return (
    <>
      <PageHeader title="Profile" subTitle="Informasi mengenai akun anda" />
      <section className="px-5">
        <div className="flex space-x-5 md:space-x-10 w-full bg-white p-5 rounded border">
          <span className="flex-none">
            <img
              className="w-20 md:w-36 rounded-full shadow"
              src={session?.avatar}
              alt={session?.nama}
            />
          </span>
          <div className="flex flex-grow flex-col justify-center">
            <h2 className="font-bold text-2xl">{session?.nama}</h2>
            <p className="text-gray-400 mb-0">
              Email <b>{session?.email}</b>
            </p>
            <p className="text-gray-400 mb-0">
              Akun dibuat pada{' '}
              <b>
                {moment(new Date(session?.created_at!)).format('DD MMMM yyyy, HH:mm')}
              </b>
            </p>

            <div className="space-x-5 mt-5">
              <Link to="perbaharui" className="text-green-700 font-bold">
                <Button icon={<UserOutlined />}>Perbaharui Informasi</Button>
              </Link>
              <Link to="password" className="text-yellow-700 font-bold">
                <Button icon={<LockOutlined />}>Ubah Password</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
