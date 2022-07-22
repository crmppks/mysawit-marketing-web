import { Form, Input, Button, PageHeader } from 'antd';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { parseError } from '@/helpers/form_helper';
import { useAppSelector } from '@/hooks/redux_hooks';
import { postUpdatePassword } from '@/services/profile';
import { CheckCircleFilled } from '@ant-design/icons';

export default function HalamanUpdatePassword() {
  const session = useAppSelector((state) => state.sesi.user);
  const navigate = useNavigate();

  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);

  return (
    <>
      <PageHeader
        onBack={() => navigate('/profile')}
        breadcrumb={{
          routes: [
            { path: '/home/profile', breadcrumbName: 'Profile' },
            { path: '/update-password', breadcrumbName: 'Ubah Password' },
          ],
        }}
        title="Perbaharui Password"
        subTitle="Tingkatkan keamanan akun dengan mengubah password secara regular"
      />
      <section className="p-5">
        <Form
          form={form}
          className="md:w-6/12"
          layout={'vertical'}
          onFinish={(values) => {
            setLoading(true);
            postUpdatePassword(values)
              .then(() => navigate('/profile'))
              .catch((e: any) => parseError(form, e))
              .finally(() => setLoading(false));
          }}
          initialValues={session!}
        >
          <Form.Item
            name="old_password"
            label="Password Lama"
            rules={[{ required: true, message: 'Password lama diperlukan' }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            name="password"
            label="Password Baru"
            rules={[{ required: true, message: 'Password baru diperlukan' }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            name="password_confirmation"
            label="Konfirmasi Password Baru"
            rules={[
              { required: true, message: 'Konfirmasi password diperlukan' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Konfirmasi password tidak valid'));
                },
              }),
            ]}
          >
            <Input.Password />
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
