// src/page/Login/ResetPasswordPage.jsx
import { useState, useEffect } from 'react';
import { Form, Input, Button, message, Result } from 'antd';
import { LockOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { useNavigate, useSearchParams } from 'react-router';
import { loginService } from '../../service/loginServices';

const ResetPasswordPage = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [messageApi, contextHolder] = message.useMessage();
  const [token, setToken] = useState('');

  useEffect(() => {
    // Get token from URL query params (e.g., ?token=abc123)
    const tokenFromUrl = searchParams.get('token');
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
      form.setFieldsValue({ token: tokenFromUrl });
    }
  }, [searchParams, form]);

  const handleResetPassword = async (values) => {
    setLoading(true);
    try {
      await loginService.resetPassword(values.token, values.newPassword);
      
      setSuccess(true);
      messageApi.success('Password reset successfully!');
      
      // Auto redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error) {
      console.error('Reset password error:', error);
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.title || 
                          'Failed to reset password. Please try again or request a new reset link.';
      messageApi.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate('/login');
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-purple-600">
        {contextHolder}
        <div className="w-full max-w-md mx-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <Result
              status="success"
              icon={<CheckCircleOutlined className="text-green-500" />}
              title="Password Reset Successfully!"
              subTitle="Your password has been reset. You can now login with your new password."
              extra={[
                <Button 
                  type="primary" 
                  key="login"
                  onClick={handleBackToLogin}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 border-none"
                >
                  Go to Login
                </Button>,
              ]}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-purple-600">
      {contextHolder}
      <div className="w-full max-w-md mx-4">
        <div className="bg-white rounded-2xl shadow-2xl p-12">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-4">
              <LockOutlined className="text-3xl text-indigo-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Reset Password
            </h1>
            <p className="text-gray-500">
              Enter your reset token and new password
            </p>
          </div>

          <Form
            form={form}
            name="reset-password"
            onFinish={handleResetPassword}
            layout="vertical"
            requiredMark={false}
          >

            <Form.Item
              label={<span className="text-gray-700 font-medium">New Password</span>}
              name="newPassword"
              rules={[
                {
                  required: true,
                  message: 'Please enter your new password',
                },
                {
                  min: 6,
                  message: 'Password must be at least 6 characters',
                },
                {
                  pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,}$/,
                  message: 'Password must contain at least one letter and one number',
                },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="text-gray-400" />}
                placeholder="Enter new password"
                size="large"
                className="rounded-lg"
              />
            </Form.Item>

            <Form.Item
              label={<span className="text-gray-700 font-medium">Confirm Password</span>}
              name="confirmPassword"
              dependencies={['newPassword']}
              rules={[
                {
                  required: true,
                  message: 'Please confirm your password',
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('newPassword') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Passwords do not match!'));
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="text-gray-400" />}
                placeholder="Confirm new password"
                size="large"
                className="rounded-lg"
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                size="large"
                className="w-full h-12 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 border-none rounded-lg text-lg font-medium shadow-lg"
              >
                Reset Password
              </Button>
            </Form.Item>

            <div className="text-center">
              <Button
                type="link"
                onClick={handleBackToLogin}
                className="text-gray-600 hover:text-indigo-600"
              >
                Back to Login
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;