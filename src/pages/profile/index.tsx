import { Button, message, PageHeader, Switch, Tooltip, Upload } from 'antd';
import moment from 'moment';
import { useAppSelector } from '@/hooks/redux_hooks';
import { Link } from 'react-router-dom';
import { LoadingOutlined, LockOutlined, UserOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { getProfileDetailAction, overrideUserAction } from '@/store/actions/sesi';
import { useDispatch } from 'react-redux';
import ImgCrop from 'antd-img-crop';
import Cookies from 'js-cookie';
import { beforeUploadImage, getBase64 } from '@/helpers/form_helper';
import { postToggleStatus } from '@/services/profile';

export default function HalamanDetailProfile() {
  const dispatch = useDispatch();
  const marketing = useAppSelector((state) => state.sesi.user);

  const [isChangingStatus, setIsChangingStatus] = useState<boolean>(false);
  const [avatar, setAvatar] = useState<{
    loading: boolean;
    url: string;
    file?: any;
  }>({ loading: false, url: marketing.avatar });

  const handleStatusChange = (status: boolean) => {
    setIsChangingStatus(true);
    postToggleStatus(status)
      .then(({ data }) => {
        dispatch(overrideUserAction({ ...marketing, is_aktif: data.is_aktif }));
      })
      .finally(() => setIsChangingStatus(false));
  };

  useEffect(() => {
    dispatch(getProfileDetailAction());
  }, [dispatch]);

  return (
    <>
      <PageHeader title="Profile" subTitle="Informasi mengenai akun anda" />
      <section className="px-5">
        <div className="rounded bg-white p-5 shadow grid grid-cols-12 gap-5 md:gap-10">
          <div className="col-span-12 md:col-span-3 lg:col-span-2">
            <ImgCrop rotate>
              <Upload
                data={{
                  role: 'MARKETING',
                }}
                listType="picture-card"
                showUploadList={false}
                withCredentials
                action={`${process.env.REACT_APP_BASE_URL_API}/profile/update-avatar`}
                beforeUpload={(file) => beforeUploadImage(file)}
                headers={{
                  Authorization: `Bearer ${Cookies.get(
                    process.env.REACT_APP_ACCESS_TOKEN,
                  )}`,
                  Accept: 'application/json',
                }}
                onChange={(info) => {
                  if (info.file.status === 'uploading') {
                    setAvatar((old) => ({ ...old, loading: true }));
                    return;
                  }
                  if (info.file.status === 'error') {
                    message.error(
                      info.file?.response?.message || 'Error uploading image',
                    );

                    setAvatar((old) => ({ ...old, loading: false }));
                    return;
                  }
                  if (info.file.status === 'done') {
                    const res = info.file.response;
                    dispatch(overrideUserAction({ ...marketing, ...res }));

                    // Get this url from response in real world.
                    getBase64(info.file.originFileObj, (imageUrl) =>
                      setAvatar({
                        url: imageUrl,
                        loading: false,
                        file: info.file,
                      }),
                    );
                  }
                }}
              >
                {avatar.loading ? (
                  <LoadingOutlined />
                ) : (
                  <Tooltip placement="right" title="Klik untuk mengubah foto profile">
                    <img src={avatar.url} alt="avatar" className="w-full rounded" />
                  </Tooltip>
                )}
              </Upload>
            </ImgCrop>
          </div>
          <div className="col-span-12 md:col-span-9 lg:col-span-10">
            <div className="flex justify-between">
              <div className="flex-grow">
                <h1 className="font-bold text-xl mb-0">{marketing?.nama}</h1>
                <span className="text-gray-500">{marketing?.kode_marketing}</span>
              </div>
              <div className="flex-none relative flex items-center space-x-3">
                <Switch
                  loading={isChangingStatus}
                  defaultChecked={marketing?.is_aktif}
                  checkedChildren={'Aktif'}
                  unCheckedChildren={'Non-Aktif'}
                  onChange={handleStatusChange}
                />
              </div>
            </div>
            <hr className="my-5" />
            <div className="grid grid-cols-2">
              <div>
                <span className="text-gray-400">Kategori</span>
                <p>{marketing?.kategori_produk.nama}</p>
                <span className="text-gray-400">Username</span>
                <p>{marketing?.username}</p>
                <span className="text-gray-400">Email</span>
                <p>{marketing?.email}</p>
                <span className="text-gray-400">Posisi / Jabatan</span>
                <p>{marketing?.jabatan}</p>
                <span className="text-gray-400">Jumlah Anggota</span>
                <p>{marketing?.anggota_count}</p>
              </div>
              <div>
                <span className="text-gray-400">Atasan</span>
                <p>
                  {marketing?.atasan ? (
                    <Link to={`/marketing/${marketing?.atasan.user_id}`}>
                      {marketing?.atasan?.nama}
                    </Link>
                  ) : (
                    '-'
                  )}
                </p>
                <span className="text-gray-400">No. HP</span>
                <p>{marketing?.no_hp}</p>
                <span className="text-gray-400">Alamat</span>
                <p>{marketing?.alamat}</p>
                <span className="text-gray-400">NIK</span>
                <p>{marketing?.nik}</p>
                <span className="text-gray-400">Jumlah Konsumen</span>
                <p>{marketing?.konsumen_count}</p>
              </div>
            </div>
            <hr className="my-5" />
            <div className="grid grid-cols-2">
              <div>
                <span>Bergabung pada</span>
                <p>{moment(marketing?.created_at).format('DD MMMM yyyy, HH:mm')}</p>
              </div>
              {marketing?.created_at !== marketing?.updated_at && (
                <div>
                  <span>Diperbaharui pada</span>
                  <p>{moment(marketing?.updated_at).format('DD MMMM yyyy, HH:mm')}</p>
                </div>
              )}
            </div>

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
