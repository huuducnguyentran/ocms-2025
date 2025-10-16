// src/page/Home/ProfilePage.jsx
import { useState, useEffect, useRef } from 'react';
import { Card, Descriptions, Spin, Button, message, Avatar, Modal, Dropdown } from 'antd';
import { UserOutlined, EditOutlined, LockOutlined, CameraOutlined, EyeOutlined, DeleteOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router';
import { profileService } from '../../service/profileService';

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [previewVisible, setPreviewVisible] = useState(false);
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await profileService.getProfile();
      setProfile(response.data);
      // Set avatar URL if exists
      if (response.data.avatarUrl) {
        setAvatarUrl(response.data.avatarUrl);
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      messageApi.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const formatDate = (dateObj) => {
    if (!dateObj) return 'N/A';
    
    if (typeof dateObj === 'string') {
      try {
        const date = new Date(dateObj);
        return date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });
      } catch (err) {
        return dateObj;
      }
    }
    
    if (dateObj.year && dateObj.month && dateObj.day) {
      const date = new Date(dateObj.year, dateObj.month - 1, dateObj.day);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    }
    
    return 'N/A';
  };

  const handleEditProfile = () => {
    navigate('/edit-profile');
  };

// Handle avatar upload - FIXED with detailed logging
const handleChangeAvatar = async (file) => {
  // Log file info
  console.log('=== UPLOAD AVATAR START ===');
  console.log('File selected:', {
    name: file.name,
    type: file.type,
    size: file.size,
    sizeInMB: (file.size / 1024 / 1024).toFixed(2) + ' MB',
  });

  const isLt5M = file.size / 1024 / 1024 < 5;
  if (!isLt5M) {
    messageApi.error('Image must be smaller than 5MB!');
    console.log('Validation failed: File too large');
    return false;
  }

  setUploadingAvatar(true);
  try {
    console.log('Sending upload request...');
    console.log('Request URL:', '/User/profile/avatar');
    console.log('Request method:', 'PUT');
    console.log('Request data:', 'FormData with file');
    
    const response = await profileService.uploadAvatar(file);
    
    // Log response
    console.log('Upload response received:', response);
    console.log('Response structure:', {
      success: response.success,
      message: response.message,
      hasData: !!response.data,
      hasAvatarUrl: !!response.data?.avatarUrl,
      avatarUrl: response.data?.avatarUrl,
    });
    
    // Handle response structure correctly
    // API returns: { data: { avatarUrl, ... }, success: true, message: "..." }
    if (response.success && response.data?.avatarUrl) {
      console.log('Avatar URL updated:', response.data.avatarUrl);
      setAvatarUrl(response.data.avatarUrl);
      messageApi.success(response.message || 'Avatar uploaded successfully!');
      
      console.log('Refreshing profile...');
      await fetchProfile();
      console.log('Profile refreshed');
    } else {
      console.log('No avatarUrl in response, using fallback');
      messageApi.success('Avatar uploaded successfully!');
      
      // Create local preview URL as fallback
      const reader = new FileReader();
      reader.onload = (e) => {
        console.log('Local preview created');
        setAvatarUrl(e.target.result);
      };
      reader.readAsDataURL(file);
      
      await fetchProfile();
    }
    
    console.log('=== UPLOAD AVATAR SUCCESS ===');
  } catch (error) {
    console.error('Upload avatar error:', error);
    console.error('Error details:', {
      message: error.message,
      response: error.response,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
    });
    
    let errorMessage = 'Failed to upload avatar. Please try again.';
    
    if (error.response?.data?.errors) {
      const errors = error.response.data.errors;
      const errorMessages = Object.values(errors).flat();
      errorMessage = errorMessages.join(', ');
      console.log('Validation errors:', errorMessages);
    } else if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
      console.log('Error message:', errorMessage);
    } else if (error.response?.data?.title) {
      errorMessage = error.response.data.title;
      console.log('Error title:', errorMessage);
    } else if (error.message) {
      errorMessage = error.message;
      console.log('Generic error:', errorMessage);
    }
    
    messageApi.error(errorMessage);
    console.log('=== UPLOAD AVATAR FAILED ===');
  } finally {
    setUploadingAvatar(false);
  }

  return false;
};
  // Handle view avatar
  const handleViewAvatar = () => {
    if (!avatarUrl) {
      messageApi.info('No avatar to view');
      return;
    }
    setPreviewVisible(true);
  };

  // Handle delete avatar
  const handleDeleteAvatar = () => {
    Modal.confirm({
      title: 'Delete Avatar',
      content: 'Are you sure you want to delete your avatar? This action cannot be undone.',
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          // Call delete API if exists, or just clear local state
          setAvatarUrl(null);
          messageApi.success('Avatar deleted successfully!');
          
          // If you have a delete API endpoint, uncomment this:
          // await profileService.deleteAvatar();
          // await fetchProfile();
        } catch (error) {
          console.error('Delete avatar error:', error);
          messageApi.error('Failed to delete avatar. Please try again.');
        }
      },
    });
  };

  // Avatar menu items
  const avatarMenuItems = [
    {
      key: 'view',
      icon: <EyeOutlined />,
      label: 'View Avatar',
      onClick: handleViewAvatar,
      disabled: !avatarUrl,
    },
    {
      key: 'change',
      icon: <CameraOutlined />,
      label: 'Change Avatar',
      onClick: () => fileInputRef.current?.click(),
    },
    {
      type: 'divider',
    },
    {
      key: 'delete',
      icon: <DeleteOutlined />,
      label: 'Delete Avatar',
      onClick: handleDeleteAvatar,
      danger: true,
      disabled: !avatarUrl,
    },
  ];

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
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Profile Header */}
        <Card>
          <div className="flex items-center gap-6">
            {/* Avatar with dropdown menu */}
            <div className="relative">
              <Dropdown
                menu={{ items: avatarMenuItems }}
                trigger={['click']}
                placement="bottomLeft"
              >
                <div className="relative cursor-pointer group">
                  <Avatar
                    size={120}
                    src={avatarUrl}
                    style={{
                      backgroundColor: '#6366f1',
                      fontSize: '48px',
                      fontWeight: 'bold',
                    }}
                    icon={!avatarUrl && !profile?.fullName && <UserOutlined />}
                  >
                    {!avatarUrl && profile?.fullName && getInitials(profile.fullName)}
                  </Avatar>
                  
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black bg-opacity-40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <CameraOutlined className="text-white text-2xl" />
                  </div>
                  
                  {uploadingAvatar && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                      <Spin />
                    </div>
                  )}
                </div>
              </Dropdown>
              
              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                style={{ display: 'none' }}
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    handleChangeAvatar(file);
                  }
                }}
              />
            </div>

            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                {profile?.fullName || 'User'}
              </h1>
              <p className="text-gray-600 text-lg mb-1">
                User ID: {profile?.userId || 'N/A'}
              </p>
              <p className="text-gray-500 text-sm mb-3">
                Click on avatar to view, change, or delete photo
              </p>
              <div className="flex gap-3">
                <Button
                  type="primary"
                  icon={<EditOutlined />}
                  onClick={handleEditProfile}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 border-none"
                >
                  Edit Profile
                </Button>
                <Button
                  icon={<LockOutlined />}
                  onClick={() => navigate('/change-password')}
                >
                  Change Password
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Profile Details */}
        <Card title="Personal Information">
          <Descriptions bordered column={1}>
            <Descriptions.Item label="Full Name">
              {profile?.fullName || 'N/A'}
            </Descriptions.Item>
            <Descriptions.Item label="Email">
              {profile?.email || 'N/A'}
            </Descriptions.Item>
            <Descriptions.Item label="Phone Number">
              {profile?.phoneNumber || 'N/A'}
            </Descriptions.Item>
            <Descriptions.Item label="Gender">
              {profile?.sex || 'N/A'}
            </Descriptions.Item>
            <Descriptions.Item label="Date of Birth">
              {formatDate(profile?.dateOfBirth)}
            </Descriptions.Item>
            <Descriptions.Item label="Citizen ID">
              {profile?.citizenId || 'N/A'}
            </Descriptions.Item>
          </Descriptions>
        </Card>
      </div>

      {/* Avatar Preview Modal */}
      <Modal
        open={previewVisible}
        title="Profile Avatar"
        footer={null}
        onCancel={() => setPreviewVisible(false)}
        width={600}
        centered
      >
        <div className="flex justify-center p-4">
          <img
            src={avatarUrl}
            alt="Avatar Preview"
            style={{ maxWidth: '100%', maxHeight: '70vh', objectFit: 'contain' }}
          />
        </div>
      </Modal>
    </>
  );
};

export default ProfilePage;