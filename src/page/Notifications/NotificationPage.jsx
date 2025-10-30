// src/page/Notifications/NotificationPage.jsx
import React, { useEffect, useState } from 'react';
import {
  Card,
  List,
  Badge,
  Button,
  Space,
  Tag,
  Modal,
  Form,
  Input,
  Select,
  message,
  Empty,
  Spin,
  Tabs,
} from 'antd';
import {
  BellOutlined,
  ReloadOutlined,
  PlusOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  SendOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons';
import { notificationService } from '../../service/notificationServices';
import { USER_URLS } from '../../../api/apiUrl';
import axiosInstance from '../../../utils/axiosInstance';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const { TabPane } = Tabs;
const { TextArea } = Input;

const NotificationPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [createForm] = Form.useForm();
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  const userRole = sessionStorage.getItem('role');
  const isAdmin = userRole === 'Admin';

  useEffect(() => {
    fetchNotifications();
  }, []);

  // Fetch all notifications
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await notificationService.getAllNotifications();
      if (response.success) {
        // Sort by date, newest first
        const sorted = (response.data || []).sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setNotifications(sorted);
      } else {
        message.error(response.message || 'Failed to load notifications');
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      message.error('Failed to fetch notifications');
    } finally {
      setLoading(false);
    }
  };

  // Mark notification as read
  const handleMarkAsRead = async (notificationId) => {
    try {
      const response = await notificationService.markAsRead(notificationId);
      if (response.success) {
        message.success('Marked as read');
        fetchNotifications(); // Refresh list
      } else {
        message.error(response.message || 'Failed to mark as read');
      }
    } catch (error) {
      console.error('Error marking as read:', error);
      message.error('Failed to mark as read');
    }
  };

  // Fetch all users for notification target
  const fetchAllUsers = async () => {
    setLoadingUsers(true);
    try {
      const response = await axiosInstance.get(USER_URLS.GET_ALL_USERS);
      if (response.data.success) {
        setUsers(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      message.error('Failed to load users');
    } finally {
      setLoadingUsers(false);
    }
  };

  // Open create notification modal
  const handleOpenCreateModal = () => {
    if (!isAdmin) {
      message.warning('Only admins can create notifications');
      return;
    }
    setIsCreateModalVisible(true);
    fetchAllUsers();
  };

  // Create notification
  const handleCreateNotification = async () => {
    try {
      const values = await createForm.validateFields();
      
      const notificationData = {
        userId: values.userId,
        title: values.title,
        message: values.message,
        notificationType: values.notificationType || 'General',
      };

      const response = await notificationService.createNotification(notificationData);
      if (response.success) {
        message.success('Notification sent successfully!');
        setIsCreateModalVisible(false);
        createForm.resetFields();
        fetchNotifications();
      } else {
        message.error(response.message || 'Failed to send notification');
      }
    } catch (error) {
      if (error.errorFields) {
        message.error('Please fill in all required fields');
      } else {
        console.error('Error creating notification:', error);
        message.error('Failed to send notification');
      }
    }
  };

  // Test admin notification
  const handleTestAdminNotification = async () => {
    if (!isAdmin) {
      message.warning('Only admins can test notifications');
      return;
    }

    Modal.confirm({
      title: 'Send Test Notification',
      content: 'This will send a test notification to all admins. Continue?',
      okText: 'Yes, Send',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          const response = await notificationService.testAdminNotification();
          if (response.success) {
            message.success('Test notification sent to all admins!');
            fetchNotifications();
          } else {
            message.error(response.message || 'Failed to send test notification');
          }
        } catch (error) {
          console.error('Error:', error);
          message.error('Failed to send test notification');
        }
      },
    });
  };

  // Get notification type color
  const getTypeColor = (type) => {
    const colors = {
      General: 'blue',
      Alert: 'red',
      Success: 'green',
      Warning: 'orange',
      Info: 'cyan',
    };
    return colors[type] || 'default';
  };

  // Separate read and unread notifications
  const unreadNotifications = notifications.filter(n => !n.isRead);
  const readNotifications = notifications.filter(n => n.isRead);

  return (
    <div style={{ padding: '24px' }}>
      <Card
        title={
          <Space>
            <BellOutlined style={{ fontSize: '24px' }} />
            <span style={{ fontSize: '20px', fontWeight: 'bold' }}>
              Notifications
            </span>
            <Badge count={unreadNotifications.length} />
          </Space>
        }
        extra={
          <Space>
            <Button
              icon={<ReloadOutlined />}
              onClick={fetchNotifications}
              loading={loading}
            >
              Refresh
            </Button>
            {isAdmin && (
              <>
                <Button
                  type="dashed"
                  icon={<ThunderboltOutlined />}
                  onClick={handleTestAdminNotification}
                >
                  Test Admin Notification
                </Button>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={handleOpenCreateModal}
                >
                  Create Notification
                </Button>
              </>
            )}
          </Space>
        }
      >
        <Tabs defaultActiveKey="unread">
          <TabPane
            tab={
              <span>
                <ClockCircleOutlined />
                Unread ({unreadNotifications.length})
              </span>
            }
            key="unread"
          >
            {loading ? (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <Spin size="large" tip="Loading notifications..." />
              </div>
            ) : unreadNotifications.length === 0 ? (
              <Empty
                description="No unread notifications"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            ) : (
              <List
                itemLayout="horizontal"
                dataSource={unreadNotifications}
                renderItem={(item) => (
                  <List.Item
                    style={{
                      background: '#f0f7ff',
                      padding: '16px',
                      marginBottom: '8px',
                      borderRadius: '8px',
                      border: '1px solid #91d5ff',
                    }}
                    actions={[
                      <Button
                        type="link"
                        icon={<CheckCircleOutlined />}
                        onClick={() => handleMarkAsRead(item.notificationId)}
                      >
                        Mark as Read
                      </Button>,
                    ]}
                  >
                    <List.Item.Meta
                      avatar={<BellOutlined style={{ fontSize: '24px', color: '#1890ff' }} />}
                      title={
                        <Space>
                          <span style={{ fontWeight: 'bold' }}>{item.title}</span>
                          <Tag color={getTypeColor(item.notificationType)}>
                            {item.notificationType}
                          </Tag>
                          <Badge status="processing" text="New" />
                        </Space>
                      }
                      description={
                        <div>
                          <p style={{ margin: '8px 0' }}>{item.message}</p>
                          <span style={{ fontSize: '12px', color: '#999' }}>
                            {dayjs(item.createdAt).fromNow()} •{' '}
                            {dayjs(item.createdAt).format('DD/MM/YYYY HH:mm')}
                          </span>
                        </div>
                      }
                    />
                  </List.Item>
                )}
              />
            )}
          </TabPane>

          <TabPane
            tab={
              <span>
                <CheckCircleOutlined />
                Read ({readNotifications.length})
              </span>
            }
            key="read"
          >
            {loading ? (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <Spin size="large" tip="Loading notifications..." />
              </div>
            ) : readNotifications.length === 0 ? (
              <Empty
                description="No read notifications"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            ) : (
              <List
                itemLayout="horizontal"
                dataSource={readNotifications}
                renderItem={(item) => (
                  <List.Item
                    style={{
                      padding: '16px',
                      marginBottom: '8px',
                      borderRadius: '8px',
                      opacity: 0.7,
                    }}
                  >
                    <List.Item.Meta
                      avatar={<BellOutlined style={{ fontSize: '24px', color: '#bfbfbf' }} />}
                      title={
                        <Space>
                          <span>{item.title}</span>
                          <Tag color={getTypeColor(item.notificationType)}>
                            {item.notificationType}
                          </Tag>
                        </Space>
                      }
                      description={
                        <div>
                          <p style={{ margin: '8px 0' }}>{item.message}</p>
                          <span style={{ fontSize: '12px', color: '#999' }}>
                            {dayjs(item.createdAt).fromNow()} •{' '}
                            {dayjs(item.createdAt).format('DD/MM/YYYY HH:mm')}
                          </span>
                        </div>
                      }
                    />
                  </List.Item>
                )}
              />
            )}
          </TabPane>
        </Tabs>
      </Card>

      {/* Create Notification Modal */}
      <Modal
        title={
          <span>
            <SendOutlined style={{ marginRight: 8 }} />
            Send New Notification
          </span>
        }
        open={isCreateModalVisible}
        onOk={handleCreateNotification}
        onCancel={() => {
          setIsCreateModalVisible(false);
          createForm.resetFields();
        }}
        okText="Send"
        width={600}
      >
        <Form
          form={createForm}
          layout="vertical"
          name="createNotificationForm"
        >
          <Form.Item
            name="userId"
            label="Recipient"
            rules={[{ required: true, message: 'Please select a recipient' }]}
          >
            <Select
              placeholder="Select user to notify"
              showSearch
              loading={loadingUsers}
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
              options={users.map(user => ({
                value: user.userId,
                label: `${user.fullName} (${user.userId}) - ${user.role}`,
              }))}
            />
          </Form.Item>

          <Form.Item
            name="notificationType"
            label="Notification Type"
            rules={[{ required: true, message: 'Please select type' }]}
          >
            <Select placeholder="Select notification type">
              <Select.Option value="General">General</Select.Option>
              <Select.Option value="Alert">Alert</Select.Option>
              <Select.Option value="Success">Success</Select.Option>
              <Select.Option value="Warning">Warning</Select.Option>
              <Select.Option value="Info">Info</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="title"
            label="Title"
            rules={[{ required: true, message: 'Please enter title' }]}
          >
            <Input placeholder="e.g., Important Update" />
          </Form.Item>

          <Form.Item
            name="message"
            label="Message"
            rules={[{ required: true, message: 'Please enter message' }]}
          >
            <TextArea
              rows={4}
              placeholder="Enter your notification message..."
              maxLength={500}
              showCount
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default NotificationPage;