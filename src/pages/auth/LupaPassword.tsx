import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Input, Button, message, Steps } from 'antd';
import { postAuthLupaPassword, postAuthResetPassword } from '@/services/auth';
import { parseError } from '@/helpers/form_helper';

interface TabPanelProps {
  children: React.ReactNode;
  value: number;
  index: number;
}

const TabPanel = ({ children, value, index, ...other }: TabPanelProps) => (
  <div
    {...other}
    role="tabpanel"
    className={`${value !== index ? 'hidden' : 'block'}`}
    hidden={value !== index}
  >
    {children}
  </div>
);

export default function HalamanLupaPassword() {
  const navigate = useNavigate();

  const [isLoading, setLoading] = useState(false);
  const [activeStep, setActiveStep] = useState<number>(0);
  const [token, setToken] = useState('');
  const [email, setEmail] = useState('');

  const [formEmail] = Form.useForm();
  const [formToken] = Form.useForm();
  const [formReset] = Form.useForm();

  const handleSubmitEmail = (params: any) => {
    setLoading(true);

    postAuthLupaPassword(params)
      .then(() => {
        message.success('Kami telah mengirimkan token ke email anda');
        setEmail(params.email);
        setActiveStep(1);
      })
      .catch((e: any) => parseError(formEmail, e))
      .finally(() => setLoading(false));
  };

  const handleSubmitToken = (params: any) => {
    setToken(params.token);
    setActiveStep(2);
  };

  const handleSubmitPassword = (params: any) => {
    setLoading(true);

    postAuthResetPassword({ ...params, token, email })
      .then(() => {
        message.success('Password anda berhasil direset, silahkan masuk lagi');
        navigate('/auth/masuk');
      })
      .catch((e: any) => parseError(formReset, e))
      .finally(() => setLoading(false));
  };

  return (
    <section
      style={{ minHeight: '100vh' }}
      className="flex bg-white md:bg-gray-100 w-full justify-center items-center flex-col"
    >
      <p className="px-5 md:px-0 md:mx-auto md:w-8/12 lg:w-7/12 mb-5 mt-10">
        <Link to="/auth/masuk" className="text-gray-500">
          &larr; Kembali ke halaman Masuk
        </Link>
      </p>
      <div className="md:border bg-white relative md:border-gray-300 mx-6 my-auto md:m-auto w-full md:w-8/12 lg:w-7/12 rounded p-8 lg:p-10 h-auto">
        <div className="flex justify-center mb-5">
          <img alt="Logo" className="w-44" src="/logo_mysawit.png" />
        </div>
        <Steps current={activeStep} className="mb-16">
          <Steps.Step />
          <Steps.Step />
          <Steps.Step />
        </Steps>
        <div className="mt-10">
          <TabPanel value={activeStep} index={0}>
            <h2 className="font-bold text-2xl">Masukkan email anda</h2>
            <p className="text-gray-500">
              Kami akan mengirimkan token untuk reset password ke email anda yang
              terdaftar di sistem kami.
            </p>

            <Form
              form={formEmail}
              className="mt-10"
              layout="vertical"
              name="basic"
              onFinish={handleSubmitEmail}
            >
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: 'Email dibutuhkan' },
                  { type: 'email', message: 'Email tidak valid' },
                ]}
              >
                <Input allowClear size="large" />
              </Form.Item>

              <Form.Item>
                <Button
                  loading={isLoading}
                  block
                  size="large"
                  type="primary"
                  htmlType="submit"
                >
                  Kirim Token
                </Button>
              </Form.Item>
            </Form>
          </TabPanel>
          <TabPanel value={activeStep} index={1}>
            <h2 className="font-bold text-2xl">Masukkan token reset password</h2>
            <p className="text-gray-500">
              Salin dan tempelkan disini token yang telah kami kirim ke email anda.
            </p>

            <Form
              form={formToken}
              className="mt-10"
              layout="vertical"
              name="basic"
              onFinish={handleSubmitToken}
            >
              <Form.Item
                label="Token"
                name="token"
                rules={[{ required: true, message: 'Token dibutuhkan' }]}
              >
                <Input />
              </Form.Item>

              <Form.Item>
                <Button block size="large" type="primary" htmlType="submit">
                  Konfirmasi Token
                </Button>
              </Form.Item>
            </Form>

            <div className="mt-8 flex justify-start">
              <button type="button" onClick={() => setActiveStep(0)}>
                &larr; Sebelumnya
              </button>
            </div>
          </TabPanel>
          <TabPanel value={activeStep} index={2}>
            <h2 className="font-bold text-2xl">Masukkan password baru anda</h2>
            <p className="text-gray-500">
              Sekarang kamu bisa memasukkan password baru yang akan digunakan untuk akun
              anda.
            </p>

            <Form
              form={formReset}
              className="mt-10"
              layout="vertical"
              name="basic"
              onFinish={handleSubmitPassword}
            >
              <Form.Item
                label="Password Baru"
                name="password"
                rules={[{ required: true, message: 'Password dibutuhkan' }]}
              >
                <Input.Password />
              </Form.Item>
              <Form.Item
                label="Konfirmasi Password"
                name="password_confirmation"
                rules={[{ required: true, message: 'Konfirmasi password dibutuhkan' }]}
              >
                <Input.Password />
              </Form.Item>

              <Form.Item>
                <Button
                  loading={isLoading}
                  block
                  size="large"
                  type="primary"
                  htmlType="submit"
                >
                  Simpan Password
                </Button>
              </Form.Item>
            </Form>

            <div className="mt-8 flex justify-start">
              <button type="button" onClick={() => setActiveStep(1)}>
                &larr; Sebelumnya
              </button>
            </div>
          </TabPanel>
        </div>
      </div>
    </section>
  );
}
