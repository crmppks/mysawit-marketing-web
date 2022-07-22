import { Form, Input, Button } from 'antd';
import { useAppDispatch, useAppSelector } from '@/hooks/redux_hooks';
import { getSesiAction } from '@/store/actions/sesi';
import { Link } from 'react-router-dom';

export default function HalamanMasuk() {
  const dispatch = useAppDispatch();
  const loading = useAppSelector((state) => state.sesi.loading);

  const [form] = Form.useForm();

  const handleSubmit = (params: any) => {
    dispatch(getSesiAction(params));
  };

  return (
    <section className="flex bg-white w-full h-screen place-items-center items-center flex-col">
      <div className="bg-white relative mx-6 my-auto md:m-auto w-full md:w-5/12 lg:w-4/12 rounded p-8 h-auto">
        <div className="mb-10">
          {/* <img alt='Logo' className='w-44' src='./logo_pensiunhebat.png'/> */}
          <h1 className="font-bold text-xl md:text-3xl">Administrator</h1>
          <p className="text-gray-500">
            Masuk sebagai Administrator untuk mengelola data
          </p>
        </div>
        <Form form={form} layout="vertical" name="basic" onFinish={handleSubmit}>
          <Form.Item
            label="Email"
            name="id"
            rules={[{ required: true, message: 'Email dibutuhkan' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Password dibutuhkan' }]}
          >
            <Input.Password />
          </Form.Item>
          <p className="text-right text-gray-500">
            <Link to="/auth/lupa-password">Lupa Password</Link>
          </p>

          <Form.Item className="mt-8">
            <Button loading={loading} block size="large" type="primary" htmlType="submit">
              Masuk
            </Button>
          </Form.Item>
        </Form>
      </div>
    </section>
  );
}
