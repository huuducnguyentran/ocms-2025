// src/components/TopBar.jsx
import { useState, useEffect } from 'react';
import { Avatar, Dropdown, message, Spin } from 'antd';
import { UserOutlined, LogoutOutlined, SettingOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router';
import { profileService } from '../../service/profileService';

const TopBar = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await profileService.getProfile();
      setProfile(response.data);
      // Store fullName in sessionStorage for later use
      if (response.fullName) {
        sessionStorage.setItem('fullName', response.fullName);
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      messageApi.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.clear();
    messageApi.success('Logged out successfully');
    setTimeout(() => {
      navigate('/login');
    }, 500);
  };

  const handleViewProfile = () => {
    navigate('/profile');
  };

  const menuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'View Profile',
      onClick: handleViewProfile,
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Settings',
      disabled: true, // Coming soon
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      onClick: handleLogout,
      danger: true,
    },
  ];

  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <>
      {contextHolder}
      <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm sticky top-0 z-10">
        <div className="text-xl font-semibold text-gray-800">
          Welcome to VJ Academy
        </div>
        
        <div className="flex items-center gap-4">
          {loading ? (
            <Spin size="small" />
          ) : (
            <Dropdown menu={{ items: menuItems }} placement="bottomRight" trigger={['click']}>
              <div className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors">
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-700">
                    {profile?.fullName || 'User'}
                  </div>
                  <div className="text-xs text-gray-500">
                    {profile?.email || ''}
                  </div>
                </div>
                <Avatar
                  size={40}
                  style={{
                    backgroundColor: '#6366f1',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                  }}
                  icon={!profile?.fullName && <UserOutlined />}
                >
                  {profile?.fullName && getInitials(profile.fullName)}
                </Avatar>
              </div>
            </Dropdown>
          )}
        </div>
      </div>
    </>
  );
};

export default TopBar;