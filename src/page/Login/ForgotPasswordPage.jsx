// src/page/Login/ForgotPasswordPage.jsx
import { useState } from 'react';
import { Form, Input, Button, message, Result } from 'antd';
import { MailOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router';
import { loginService } from '../../service/loginServices';

const ForgotPasswordPage = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();

  const handleForgotPassword = async (values) => {
    setLoading(true);
    try {
      await loginService.forgotPassword(values.emailOrUsername);
      
      setSuccess(true);
      messageApi.success('Password reset instructions sent to your email!');
      
      // Auto redirect to login after 5 seconds
      setTimeout(() => {
        navigate('/login');
      }, 5000);
    } catch (error) {
      console.error('Forgot password error:', error);
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.title || 
                          'Failed to send reset email. Please try again.';
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
              title="Email Sent!"
              subTitle="We've sent password reset instructions to your email. Please check your inbox and follow the link to reset your password."
              extra={[
                <Button 
                  type="primary" 
                  key="back"
                  onClick={handleBackToLogin}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 border-none"
                >
                  Back to Login
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
              <MailOutlined className="text-3xl text-indigo-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Forgot Password?
            </h1>
            <p className="text-gray-500">
              Enter your email or username and we'll send you admin to reset your password
            </p>
          </div>

          <Form
            form={form}
            name="forgot-password"
            onFinish={handleForgotPassword}
            layout="vertical"
            requiredMark={false}
          >
            <Form.Item
              label={<span className="text-gray-700 font-medium">Email or Username</span>}
              name="emailOrUsername"
              rules={[
                {
                  required: true,
                  message: 'Please enter your email or username',
                },
              ]}
            >
              <Input
                prefix={<MailOutlined className="text-gray-400" />}
                placeholder="Enter your email or username"
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
                Send Reset Link
              </Button>
            </Form.Item>

            <div className="text-center">
              <Button
                type="link"
                icon={<ArrowLeftOutlined />}
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

export default ForgotPasswordPage;