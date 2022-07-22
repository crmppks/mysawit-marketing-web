import { Form, Input, Button, PageHeader } from 'antd';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '@/hooks/redux_hooks';
import { updateSesiAction } from '@/store/actions/sesi';
import { CheckCircleFilled } from '@ant-design/icons';

export default function HalamanUpdateProfile() {
  const dispatch = useDispatch();

  const session = useAppSelector((state) => state.sesi.user);
  const loading = useAppSelector((state) => state.sesi.loading);

  const navigate = useNavigate();
  const [form] = Form.useForm();

  const handleUpdateProfile = (params: any) => {
    dispatch(updateSesiAction(params));
  };

  return (
    <>
      <PageHeader
        onBack={() => navigate('/profile')}
        breadcrumb={{
          routes: [
            { path: '/profile', breadcrumbName: 'Profile' },
            { path: '/perbaharui', breadcrumbName: 'Perbaharui Informasi' },
          ],
        }}
        title="Perbaharui Profile"
        subTitle="Perbaharui informasi akun"
      />
      <section className="p-5">
        <Form
          form={form}
          className="md:w-7/12"
          layout={'vertical'}
          onFinish={handleUpdateProfile}
          initialValues={session!}
        >
          <Form.Item
            name="nama"
            label="Nama"
            rules={[{ required: true, message: 'Nama lama diperlukan' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Email lama diperlukan' },
              { type: 'email', message: 'Format email tidak valid' },
            ]}
          >
            <Input />
          </Form.Item>
        </Form>
        <div className="mt-5">
          <Button
            size="large"
            icon={<CheckCircleFilled />}
            loading={loading}
            onClick={() => form.submit()}
            type="primary"
          >
            Simpan Perubahan
          </Button>
        </div>
      </section>
    </>
  );
}
