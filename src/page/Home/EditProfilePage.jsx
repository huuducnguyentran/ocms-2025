// src/page/Home/EditProfilePage.jsx
import { useState, useEffect } from 'react';
import { Card, Form, Input, Button, message, Spin, Select, DatePicker } from 'antd';
import { UserOutlined, MailOutlined, PhoneOutlined, IdcardOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router';
import { profileService } from '../../service/profileService';
import dayjs from 'dayjs';

const EditProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    fetchProfile();
  }, []);

const fetchProfile = async () => {
  try {
    const response = await profileService.getProfile();
    const profileData = response.data;
    setProfile(profileData);

    let dateOfBirth = null;
    
    if (profileData.dateOfBirth) {
      const dob = profileData.dateOfBirth;
      
      // Check if it's a string (DateOnly format)
      if (typeof dob === 'string') {
        dateOfBirth = dayjs(dob, 'YYYY-MM-DD');
      } 
      // Or if it's an object with year/month/day
      else if (dob.year && dob.month && dob.day && dob.year > 1900) {
        dateOfBirth = dayjs(new Date(dob.year, dob.month - 1, dob.day));
      }
      
      // Validate parsed date
      if (dateOfBirth && !dateOfBirth.isValid()) {
        console.error('Invalid date parsed:', dob);
        dateOfBirth = null;
      }
    }

    // Set form values
    form.setFieldsValue({
      fullName: profileData.fullName || '',
      email: profileData.email || '',
      phoneNumber: profileData.phoneNumber || '',
      sex: profileData.sex || 'Male',
      dateOfBirth: dateOfBirth,
      citizenId: profileData.citizenId || '',
    });
  } catch (error) {
    console.error('Failed to fetch profile:', error);
    messageApi.error('Failed to load profile');
  } finally {
    setLoading(false);
  }
};

const handleSubmit = async (values) => {
  setSaving(true);
  try {
    // Validate dateOfBirth
    if (!values.dateOfBirth) {
      messageApi.error('Please select your date of birth');
      setSaving(false);
      return;
    }

    const dateOfBirth = values.dateOfBirth.format('YYYY-MM-DD');

    const profileData = {
      fullName: values.fullName.trim(),
      email: values.email.trim(),
      phoneNumber: values.phoneNumber.trim(),
      sex: values.sex,
      dateOfBirth: dateOfBirth,  
      citizenId: values.citizenId.trim(),
    };

    // Debug log
    console.log('Sending data:', JSON.stringify(profileData, null, 2));

    const result = await profileService.updateProfile(profileData);
    console.log('Update result:', result);
    
    messageApi.success('Profile updated successfully!');
    
    // Redirect back to profile page after 1 second
    setTimeout(() => {
      navigate('/profile');
    }, 1000);
  } catch (error) {
    console.error('Update profile error:', error);
    console.error('Error response:', error.response?.data);
    
    let errorMessage = 'Failed to update profile. Please try again.';
    
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
    setSaving(false);
  }
};
  const handleCancel = () => {
    navigate('/profile');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Spin size="large" />
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
              <span className="text-xl font-semibold">Edit Profile</span>
            </div>
          }
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            requiredMark={false}
          >
            <Form.Item
              label={<span className="text-gray-700 font-medium">Full Name</span>}
              name="fullName"
              rules={[
                { required: true, message: 'Please enter your full name' },
                { min: 3, message: 'Full name must be at least 3 characters' },
                { max: 50, message: 'Full name must not exceed 50 characters' },
              ]}
            >
              <Input
                prefix={<UserOutlined className="text-gray-400" />}
                placeholder="Enter your full name"
                size="large"
              />
            </Form.Item>

            <Form.Item
              label={<span className="text-gray-700 font-medium">Email</span>}
              name="email"
              rules={[
                { required: true, message: 'Please enter your email' },
                { type: 'email', message: 'Please enter a valid email' },
              ]}
            >
              <Input
                prefix={<MailOutlined className="text-gray-400" />}
                placeholder="Enter your email"
                size="large"
              />
            </Form.Item>

            <Form.Item
              label={<span className="text-gray-700 font-medium">Phone Number</span>}
              name="phoneNumber"
              rules={[
                { required: true, message: 'Please enter your phone number' },
                { pattern: /^[0-9]{10,11}$/, message: 'Phone number must be 10-11 digits' },
              ]}
            >
              <Input
                prefix={<PhoneOutlined className="text-gray-400" />}
                placeholder="Enter your phone number"
                size="large"
              />
            </Form.Item>

            <Form.Item
              label={<span className="text-gray-700 font-medium">Gender</span>}
              name="sex"
              rules={[{ required: true, message: 'Please select your gender' }]}
            >
              <Select size="large" placeholder="Select gender">
                <Select.Option value="Male">Male</Select.Option>
                <Select.Option value="Female">Female</Select.Option>
                <Select.Option value="Other">Other</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item
              label={<span className="text-gray-700 font-medium">Date of Birth</span>}
              name="dateOfBirth"
              rules={[
                { required: true, message: 'Please select your date of birth' },
              ]}
            >
              <DatePicker
                size="large"
                placeholder="Select date of birth (MM/DD/YYYY)"
                format="MM/DD/YYYY"
                className="w-full"
                disabledDate={(current) => current && current > dayjs().endOf('day')}
              />
            </Form.Item>

            <Form.Item
              label={<span className="text-gray-700 font-medium">Citizen ID</span>}
              name="citizenId"
              rules={[
                { required: true, message: 'Please enter your citizen ID' },
                { pattern: /^[0-9]{9,12}$/, message: 'Citizen ID must be 9-12 digits' },
              ]}
            >
              <Input
                prefix={<IdcardOutlined className="text-gray-400" />}
                placeholder="Enter your citizen ID"
                size="large"
              />
            </Form.Item>

            <Form.Item>
              <div className="flex gap-3 justify-end">
                <Button size="large" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  loading={saving}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 border-none"
                >
                  Save Changes
                </Button>
              </div>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </>
  );
};

export default EditProfilePage;