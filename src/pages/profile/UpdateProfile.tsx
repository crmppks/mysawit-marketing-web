import { Form, Input, Button, PageHeader, message } from 'antd';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '@/hooks/redux_hooks';
import { updateProfileAction } from '@/store/actions/sesi';
import { CheckCircleFilled } from '@ant-design/icons';
import { useEffect } from 'react';
import { parseError } from '@/helpers/form_helper';
import { usePrevious } from '@/hooks/additional_hooks';

export default function HalamanUpdateProfile() {
  const dispatch = useDispatch();

  const session = useAppSelector((state) => state.sesi.user);
  const update_request = useAppSelector((state) => state.sesi.request_profile);
  const is_previously_loading = usePrevious(update_request.loading);

  const navigate = useNavigate();
  const [form] = Form.useForm();

  const handleUpdateProfile = (params: any) => {
    dispatch(updateProfileAction(params));
  };

  useEffect(() => {
    if (update_request.errors) {
      parseError(form, update_request.errors, false);
    }

    if (is_previously_loading && !update_request.errors) {
      message.success('Profile anda berhasil diperbaharui');
      navigate('/profile');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [update_request]);

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
            rules={[{ required: true, message: 'Nama diperlukan' }]}
          >
            <Input size="large" allowClear />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Email diperlukan' },
              { type: 'email', message: 'Format email tidak valid' },
            ]}
          >
            <Input size="large" allowClear />
          </Form.Item>
          <Form.Item
            name="username"
            label="Username"
            rules={[
              { required: true, message: 'Username diperlukan' },
              {
                pattern: /^[\w](?!.*?\.{2})[\w.]{1,28}[\w]$/,
                message: 'Format username tidak valid',
              },
            ]}
          >
            <Input size="large" allowClear />
          </Form.Item>
          <Form.Item
            name="no_hp"
            label="No HP"
            rules={[
              { required: true, message: 'No HP diperlukan' },
              { pattern: /^([0-9])*$/, message: 'No.HP harus berupa angka' },
            ]}
          >
            <Input addonBefore={<span>+62</span>} size="large" allowClear />
          </Form.Item>
          <Form.Item
            name="nik"
            label="NIK"
            rules={[
              { required: true, message: 'NIK diperlukan' },
              { pattern: /^([0-9])*$/, message: 'NIK harus berupa angka' },
            ]}
          >
            <Input size="large" allowClear />
          </Form.Item>
        </Form>
        <div className="mt-5">
          <Button
            size="large"
            shape="round"
            icon={<CheckCircleFilled />}
            loading={update_request.loading}
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
