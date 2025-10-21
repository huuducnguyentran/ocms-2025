// src/page/Account/AccountPage.jsx
import React, { useEffect, useState } from 'react';
import { Table, Card, message, Alert, Spin, Tag, Button, Space, Input, Badge } from 'antd';
import { 
  UserOutlined, 
  MailOutlined, 
  PhoneOutlined,
  ArrowLeftOutlined,
  SearchOutlined,
  ReloadOutlined,
  UserAddOutlined,
  IdcardOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router';
import { accountService } from '../../service/accountServices';

const AccountPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasPermission, setHasPermission] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  
  const userRole = sessionStorage.getItem('role');
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user has permission (Admin, Administrator or Education Officer)
    const allowedRoles = ['Admin', 'Administrator', 'Education Officer'];
    const permitted = allowedRoles.includes(userRole);
    setHasPermission(permitted);

    if (permitted) {
      fetchAllUsers();
    } else {
      setLoading(false);
    }
  }, [userRole]);

  useEffect(() => {
    // Filter users based on search text
    if (searchText.trim() === '') {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(user => 
        user.userId?.toLowerCase().includes(searchText.toLowerCase()) ||
        user.fullName?.toLowerCase().includes(searchText.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchText.toLowerCase()) ||
        user.phoneNumber?.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  }, [searchText, users]);

  const fetchAllUsers = async () => {
    try {
      setLoading(true);
      const response = await accountService.getAllUsers();
      
      if (response.success) {
        setUsers(response.data || []);
        setFilteredUsers(response.data || []);
        message.success('Users loaded successfully');
      } else {
        message.error(response.message || 'Failed to load users');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      message.error(
        error.response?.data?.message || 
        'Failed to fetch users. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate(-1); // Go back to previous page
  };

  // Define table columns
  const columns = [
    {
      title: 'User ID',
      dataIndex: 'userId',
      key: 'userId',
      width: 130,
      fixed: 'left',
      render: (text) => (
        <Tag color="blue" style={{ fontSize: '13px', padding: '4px 10px' }}>
          {text}
        </Tag>
      ),
    },
    {
      title: 'Full Name',
      dataIndex: 'fullName',
      key: 'fullName',
      width: 200,
      render: (text) => (
        <Space>
          <UserOutlined style={{ color: '#4A90E2' }} />
          <span style={{ fontWeight: 500 }}>{text || 'N/A'}</span>
        </Space>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      width: 250,
      render: (text) => (
        <Space>
          <MailOutlined style={{ color: '#4A90E2' }} />
          <span style={{ color: '#666' }}>{text || 'N/A'}</span>
        </Space>
      ),
    },
    {
      title: 'Phone Number',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
      width: 150,
      render: (text) => (
        <Space>
          <PhoneOutlined style={{ color: '#4A90E2' }} />
          <span>{text || 'N/A'}</span>
        </Space>
      ),
    },
    {
      title: 'Date of Birth',
      dataIndex: 'dateOfBirth',
      key: 'dateOfBirth',
      width: 130,
      render: (date) => date ? new Date(date).toLocaleDateString('en-GB') : 'N/A',
    },
    {
      title: 'Citizen ID',
      dataIndex: 'citizenId',
      key: 'citizenId',
      width: 150,
      render: (text) => (
        <Space>
          <IdcardOutlined style={{ color: '#4A90E2' }} />
          <span>{text || 'N/A'}</span>
        </Space>
      ),
    },
    {
      title: 'Role',
      dataIndex: 'roleId',
      key: 'roleId',
      width: 140,
      render: (roleId) => {
        const roleColors = {
          1: '#FFD700',      // Admin - Gold
          2: '#52C41A',     // Education - Green
          3: '#1890FF',      // Instructor - Blue
          4: '#722ED1',    // Trainee - Purple
        };
        const roleNames = {
          1: 'Admin',
          2: 'Education',
          3: 'Instructor',
          4: 'Trainee',
        };
        return (
          <Tag 
            color={roleColors[roleId] || 'default'}
            style={{ 
              fontSize: '12px', 
              padding: '2px 12px',
              fontWeight: 500,
            }}
          >
            {roleNames[roleId] || roleId}
          </Tag>
        );
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      fixed: 'right',
      render: (status) => (
        <Badge 
          status={status === 'Active' ? 'success' : 'error'} 
          text={
            <span style={{ fontWeight: 500 }}>
              {status || 'Unknown'}
            </span>
          }
        />
      ),
    },
  ];

  // If user doesn't have permission
  if (!hasPermission) {
    return (
      <div style={{ 
        marginBottom: '24px',
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      }}>
        <>
          <Button 
            icon={<ArrowLeftOutlined />} 
            onClick={handleBack}
            size="large"
            style={{
              borderRadius: '10px',
          border: 'none',
          background: 'white',
          boxShadow: '0 2px 8px rgba(74, 144, 226, 0.2)',
          height: '42px',
          padding: '0 20px',
          fontWeight: 500,
            }}
            className="back-button"
          >
            Back
          </Button>
          <Alert
            message="Access Denied"
            description={
              <div>
                <p style={{ fontSize: '15px', marginBottom: '12px' }}>
                  You don't have permission to view this page. Only Admin and Education Officer roles can access this page.
                </p>
                <p style={{ fontSize: '14px', color: '#666' }}>
                  <strong>Your current role:</strong> {userRole || 'Unknown'}
                </p>
              </div>
            }
            type="error"
            showIcon
            style={{
              borderRadius: '12px',
              border: 'none',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            }}
          />
        </>
      </div>
    );
  }

  return (
    <div style={{ 
      padding: '32px', 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 50%, #90CAF9 100%)',
      overflow: 'auto',
    }}>
      {/* Header Section */}
      <div style={{ 
        marginBottom: '24px',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
      }}>
        <Button 
          icon={<ArrowLeftOutlined />} 
          onClick={handleBack}
          size="large"
          style={{
            borderRadius: '10px',
            border: 'none',
            background: 'white',
            boxShadow: '0 2px 8px rgba(74, 144, 226, 0.2)',
            height: '42px',
            padding: '0 20px',
            fontWeight: 500,
          }}
          className="back-button"
        >
          Back
        </Button>
        
        <div style={{ 
          flex: 1,
          background: 'linear-gradient(135deg, #4A90E2 0%, #357ABD 100%)',
          padding: '20px 32px',
          borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(74, 144, 226, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '12px',
              background: 'rgba(255, 255, 255, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backdropFilter: 'blur(10px)',
            }}>
              <TeamOutlined style={{ fontSize: '28px', color: 'white' }} />
            </div>
            <div>
              <h1 style={{ 
                margin: 0, 
                color: 'white', 
                fontSize: '28px',
                fontWeight: 700,
                letterSpacing: '-0.5px',
              }}>
                User Account Management
              </h1>
              <p style={{ 
                margin: 0, 
                color: 'rgba(255, 255, 255, 0.9)', 
                fontSize: '14px',
                marginTop: '4px',
              }}>
                View and manage all user accounts in the system
              </p>
            </div>
          </div>
          
          <Badge 
            count={filteredUsers.length} 
            showZero
            style={{ 
              backgroundColor: 'white',
              color: '#4A90E2',
              fontSize: '16px',
              fontWeight: 'bold',
              padding: '0 12px',
              height: '32px',
              lineHeight: '32px',
              borderRadius: '16px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            }}
          />
        </div>
      </div>

      {/* Main Card */}
      <Card
        style={{
          borderRadius: '16px',
          boxShadow: '0 8px 32px rgba(74, 144, 226, 0.15)',
          border: 'none',
          overflow: 'hidden',
        }}
        bodyStyle={{ padding: 0 }}
      >
        {/* Card Header with Actions */}
        <div style={{
          padding: '24px 24px 20px 24px',
          background: 'linear-gradient(to right, #F8FBFF, #EBF5FF)',
          borderBottom: '2px solid #E3F2FD',
        }}>
          <Space direction="vertical" size={16} style={{ width: '100%' }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '16px',
            }}>
              <Space size={12}>
                <Input
                  placeholder="Search by name, email, phone or ID..."
                  prefix={<SearchOutlined style={{ color: '#4A90E2' }} />}
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  style={{ 
                    width: 350,
                    borderRadius: '10px',
                    border: '2px solid #E3F2FD',
                  }}
                  size="large"
                />
              </Space>
              
              <Space size={12}>
                <Button
                  type="default"
                  icon={<ReloadOutlined />}
                  onClick={fetchAllUsers}
                  loading={loading}
                  size="large"
                  style={{
                    borderRadius: '10px',
                    border: '2px solid #E3F2FD',
                  }}
                >
                  Refresh
                </Button>
                <Button
                  type="primary"
                  icon={<UserAddOutlined />}
                  size="large"
                  style={{
                    borderRadius: '10px',
                    background: 'linear-gradient(135deg, #4A90E2 0%, #357ABD 100%)',
                    border: 'none',
                    boxShadow: '0 4px 12px rgba(74, 144, 226, 0.3)',
                  }}
                  onClick={() => navigate('/create-account')}
                >
                  Add New User
                </Button>
              </Space>
            </div>

            {/* Statistics */}
            <div style={{ 
              display: 'flex', 
              gap: '16px',
              flexWrap: 'wrap',
            }}>
              <div style={{
                padding: '12px 20px',
                borderRadius: '10px',
                background: 'white',
                border: '2px solid #E3F2FD',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}>
                <TeamOutlined style={{ fontSize: '24px', color: '#4A90E2' }} />
                <div>
                  <div style={{ fontSize: '12px', color: '#999' }}>Total Users</div>
                  <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#4A90E2' }}>
                    {users.length}
                  </div>
                </div>
              </div>
              
              <div style={{
                padding: '12px 20px',
                borderRadius: '10px',
                background: 'white',
                border: '2px solid #E3F2FD',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}>
                <SearchOutlined style={{ fontSize: '24px', color: '#52C41A' }} />
                <div>
                  <div style={{ fontSize: '12px', color: '#999' }}>Filtered Results</div>
                  <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#52C41A' }}>
                    {filteredUsers.length}
                  </div>
                </div>
              </div>
            </div>
          </Space>
        </div>

        {/* Table Section */}
        <div style={{ padding: '24px' }}>
          {loading ? (
            <div style={{ 
              textAlign: 'center', 
              padding: '80px 0',
              background: '#F8FBFF',
              borderRadius: '12px',
            }}>
              <Spin size="large" tip={
                <span style={{ 
                  color: '#4A90E2', 
                  fontSize: '16px',
                  marginTop: '16px',
                  display: 'block',
                }}>
                  Loading users...
                </span>
              } />
            </div>
          ) : (
           <Table
  columns={columns}
  dataSource={filteredUsers}
  rowKey="userId"
  pagination={{
    pageSize: 10,
    showSizeChanger: true,
    showTotal: (total, range) => (
      <span style={{ color: '#666', fontWeight: 500 }}>
        Showing {range[0]}-{range[1]} of {total} users
      </span>
    ),
    style: { marginTop: '16px' },
  }}
  scroll={{ x: 1200 }}
  style={{
    borderRadius: '12px',
    overflow: 'hidden',
  }}
  rowClassName={(record, index) => 
    index % 2 === 0 ? 'table-row-light' : 'table-row-dark'
  }
/>
          )}
        </div>
      </Card>
    </div>
  );
};

export default AccountPage;