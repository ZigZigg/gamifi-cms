import { useAppDispatch } from '@/stores';
import { login } from '@/stores/slices/auth';
import { LoginRequest } from '@/types/auth';
import { Button, Checkbox, Form, Input, Spin } from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const LoginPageComponent = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { t } = useTranslation(['authentication']);
  const [error, setError] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();

  const initialValues = localStorage.getItem('login-auto-fill')
    ? JSON.parse(localStorage.getItem('login-auto-fill') as string)
    : {};

  const [remember, setRemember] = useState(initialValues.remember || false);

  const onRememberMe = (request: any) => {
    if (remember) {
      localStorage.setItem('login-auto-fill', JSON.stringify(request));
    } else localStorage.removeItem('login-auto-fill');
  };

  const onFinish = async (request: LoginRequest): Promise<void> => {
    try {
      setLoading(true);
      const params: LoginRequest = {
        email: request.email,
        password: request.password,
      };
      await dispatch(login(params)).unwrap();

      navigate('/');

      onRememberMe(request);
    } catch (error: any) {
      setError(t(`error.${error.message}`, { ns: 'common' }));
      form.setFields([
        {
          name: 'password',
          errors: [t(`error.${error.message}`, { ns: 'common' })],
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="col-span-10 col-start-2 rounded-2xl bg-white md:col-span-8 md:col-start-3 lg:col-span-6 lg:col-start-2">
        <div className="px-5 py-[10%] md:px-10">
          <div>
            <img src="/images/logo.svg" className="h-auto w-1/2" alt="" />
          </div>
          <div className="px-5 pt-[10%] text-left md:px-10">
            <Spin spinning={loading}>
              <div className="text-[2rem] font-semibold">Đăng nhập</div>
              <Form
                form={form}
                name="login-form"
                layout={'vertical'}
                autoComplete="off"
                size="large"
                className="pt-5"
                onFinish={onFinish}
                validateTrigger={'onBlur'}
                initialValues={initialValues}
              >
                <Form.Item
                  label={'Email'}
                  name="email"
                  className="text-sm"
                  rules={[
                    { required: true, message: 'Vui lòng nhâp email' },
                    { type: 'email', message: 'Email không hợp lệ' },
                  ]}
                  validateStatus={error ? 'error' : undefined}
                  normalize={(value) => value.trim()}
                >
                  <Input placeholder={'Email'} maxLength={154} />
                </Form.Item>
                <Form.Item
                  label={'Mật khẩu'}
                  name="password"
                  className="text-sm"
                  rules={[
                    { required: true, message: 'Vui lòng nhâp mật khẩu' },
                  ]}
                  validateStatus={error ? 'error' : undefined}
                >
                  <Input.Password
                    placeholder={'Mật khẩu'}
                    maxLength={128}
                  />
                </Form.Item>
                <div className="flex items-center justify-between">
                  <Form.Item
                    valuePropName="checked"
                    className="m-0"
                    name="remember"
                  >
                    <Checkbox
                      className="!text-light-10"
                      onClick={() => {
                        setRemember(!remember);
                      }}
                    >
                      {'Ghi nhớ'}
                    </Checkbox>
                  </Form.Item>
                </div>
                <div className="pt-10">
                  <Button
                    className="w-full"
                    htmlType="submit"
                    size="large"
                    type="primary"
                  >
                    {'Đăng nhập'}
                  </Button>
                </div>
              </Form>
            </Spin>
          </div>
        </div>
      </div>
      <div className="hidden lg:col-span-5 lg:block">
        <img
          src="/images/auth/banner-one.svg"
          className="h-auto w-[90%]"
          alt=""
        />
      </div>
    </>
  );
};

export default LoginPageComponent;
