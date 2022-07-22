import { Form, Input, Button } from 'antd';
import { useAppDispatch, useAppSelector } from '@/hooks/redux_hooks';
import { signInUserAction } from '@/store/actions/sesi';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { parseError } from '@/helpers/form_helper';

export default function HalamanMasuk() {
  const dispatch = useAppDispatch();
  const loading = useAppSelector((state) => state.sesi.request_login?.loading);
  const errors = useAppSelector((state) => state.sesi.request_login?.errors);

  const [form] = Form.useForm();

  const handleSubmit = (params: any) => {
    dispatch(signInUserAction(params));
  };

  useEffect(() => {
    if (errors) {
      parseError(form, {
        response: {
          data: {
            errors,
          },
        },
      });
    }
  }, [errors, form]);

  return (
    <section className="flex bg-white w-full h-screen place-items-center items-center flex-col">
      <div className="bg-white relative mx-6 my-auto md:m-auto w-full md:w-5/12 lg:w-4/12 rounded-md shadow p-8 h-auto border-color-theme border-2">
        <div className="mb-10 flex flex-col items-center">
          <img alt="Logo" className="w-40" src="/logo_mysawit.png" />
          {/* <h1 className="font-bold text-xl md:text-3xl mt-2">Marketing MySawit</h1> */}
          <p className="text-gray-500 text-center mt-5">
            Selamat datang ke portal {process.env.REACT_APP_NAME}, masuk untuk mengelola
            data anda
          </p>
        </div>
        <Form form={form} layout="vertical" name="basic" onFinish={handleSubmit}>
          <Form.Item
            label="Email"
            name="id"
            rules={[{ required: true, message: 'Email dibutuhkan' }]}
          >
            <Input size="large" allowClear />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Password dibutuhkan' }]}
          >
            <Input.Password size="large" allowClear />
          </Form.Item>
          <p className="text-right text-gray-500">
            <Link to="/auth/lupa-password">Lupa Password</Link>
          </p>

          <Form.Item className="mt-8">
            <Button
              loading={loading}
              block
              shape="round"
              size="large"
              type="primary"
              htmlType="submit"
            >
              Masuk
            </Button>
          </Form.Item>
        </Form>
      </div>
    </section>
  );
}
