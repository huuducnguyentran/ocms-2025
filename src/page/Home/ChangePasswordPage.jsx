// src/page/Home/ChangePasswordPage.jsx
import { useState } from 'react';
import { Card, Form, Input, Button, message, Result } from 'antd';
import { LockOutlined, ArrowLeftOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router';
import { profileService } from '../../service/profileService';

const ChangePasswordPage = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();

  const handleChangePassword = async (values) => {
    setLoading(true);
    try {
      await profileService.changePassword(
        values.currentPassword,
        values.newPassword,
        values.confirmPassword
      );
      
      setSuccess(true);
      messageApi.success('Password changed successfully!');
      
      // Auto redirect to profile after 3 seconds
      setTimeout(() => {
        navigate('/profile');
      }, 3000);
    } catch (error) {
      console.error('Change password error:', error);
      
      let errorMessage = 'Failed to change password. Please try again.';
      
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        const errorMessages = Object.values(errors).flat();
        errorMessage = errorMessages.join(', ');
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.title) {
        errorMessage = error.response.data.title;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      messageApi.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/profile');
  };

  if (success) {
    return (
      <div className="max-w-3xl mx-auto">
        {contextHolder}
        <Card>
          <Result
            status="success"
            icon={<CheckCircleOutlined className="text-green-500" />}
            title="Password Changed Successfully!"
            subTitle="Your password has been updated. You can continue using your account with the new password."
            extra={[
              <Button 
                type="primary" 
                key="profile"
                onClick={handleCancel}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 border-none"
              >
                Back to Profile
              </Button>,
            ]}
          />
        </Card>
      </div>
    );
  }

  return (
    <>
      {contextHolder}
      <div className="max-w-3xl mx-auto">
        <Card
          title={
            <div className="flex items-center gap-2">
              <Button
                type="text"
                icon={<ArrowLeftOutlined />}
                onClick={handleCancel}
              />
              <span className="text-xl font-semibold">Change Password</span>
            </div>
          }
        >
          <div className="mb-6">
            <p className="text-gray-600">
              Please enter your current password and choose a new password. 
              Your new password must be at least 6 characters long and contain letters and numbers.
            </p>
          </div>

          <Form
            form={form}
            layout="vertical"
            onFinish={handleChangePassword}
            requiredMark={false}
          >
            <Form.Item
              label={<span className="text-gray-700 font-medium">Current Password</span>}
              name="currentPassword"
              rules={[
                {
                  required: true,
                  message: 'Please enter your current password',
                },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="text-gray-400" />}
                placeholder="Enter current password"
                size="large"
              />
            </Form.Item>

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
              />
            </Form.Item>

            <Form.Item
              label={<span className="text-gray-700 font-medium">Confirm New Password</span>}
              name="confirmPassword"
              dependencies={['newPassword']}
              rules={[
                {
                  required: true,
                  message: 'Please confirm your new password',
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
              />
            </Form.Item>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h4 className="text-sm font-semibold text-blue-800 mb-2">Password Requirements:</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• At least 6 characters long</li>
                <li>• Must contain at least one letter</li>
                <li>• Must contain at least one number</li>
                <li>• Can include special characters (@$!%*?&)</li>
              </ul>
            </div>

            <Form.Item>
              <div className="flex gap-3 justify-end">
                <Button size="large" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  loading={loading}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 border-none"
                >
                  Change Password
                </Button>
              </div>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </>
  );
};

export default ChangePasswordPage;