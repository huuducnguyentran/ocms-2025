// src/page/Request/RequestPage.jsx
import React, { useEffect, useState } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  Tag,
  Modal,
  message,
  Empty,
  Tooltip,
  Badge,
} from 'antd';
import {
  FileTextOutlined,
  ReloadOutlined,
  EyeOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  SearchOutlined,
  CheckOutlined,
  CloseOutlined,
} from '@ant-design/icons';
import { requestService } from '../../service/requestServices';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Input } from 'antd';

dayjs.extend(relativeTime);

const RequestPage = () => {
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);

  const userRole = sessionStorage.getItem('role');
  const canManage = userRole === 'Admin' || userRole === 'Education Officer';

  useEffect(() => {
    if (canManage) {
      fetchAllRequests();
    }
  }, [canManage]);

  // Search filter
  useEffect(() => {
    if (searchText.trim() === '') {
      setFilteredRequests(requests);
    } else {
      const filtered = requests.filter(
        (req) =>
          req.requestId?.toString().toLowerCase().includes(searchText.toLowerCase()) ||
          req.entityId?.toLowerCase().includes(searchText.toLowerCase()) ||
          req.requestType?.toLowerCase().includes(searchText.toLowerCase()) ||
          req.status?.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredRequests(filtered);
    }
  }, [searchText, requests]);

  const fetchAllRequests = async () => {
    try {
      setLoading(true);
      const response = await requestService.getAllRequests();
      
      if (response.success) {
        const sorted = (response.data || []).sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setRequests(sorted);
        setFilteredRequests(sorted);
      } else {
        if (response.statusCode === 401 || response.statusCode === 403) {
          message.warning('You do not have permission to view requests.');
        } else {
          message.error(response.message || 'Failed to load requests');
        }
      }
    } catch (error) {
      console.error('Error:', error);
      message.error('Failed to fetch requests');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (requestId) => {
    Modal.confirm({
      title: 'Approve Request',
      content: 'Are you sure you want to approve this request?',
      okText: 'Yes, Approve',
      okType: 'primary',
      cancelText: 'Cancel',
      onOk: async () => {
        const response = await requestService.approveRequest(requestId);
        if (response.success) {
          message.success('Request approved successfully!');
          fetchAllRequests();
        } else {
          message.error(response.message || 'Failed to approve request');
        }
      },
    });
  };

  const handleReject = async (requestId) => {
    Modal.confirm({
      title: 'Reject Request',
      content: 'Are you sure you want to reject this request?',
      okText: 'Yes, Reject',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        const response = await requestService.rejectRequest(requestId);
        if (response.success) {
          message.success('Request rejected successfully!');
          fetchAllRequests();
        } else {
          message.error(response.message || 'Failed to reject request');
        }
      },
    });
  };

  const handleViewRequest = (record) => {
    setSelectedRequest(record);
    setIsViewModalVisible(true);
  };

  const getStatusColor = (status) => {
    const colors = {
      Pending: 'gold',
      Approved: 'green',
      Rejected: 'red',
    };
    return colors[status] || 'default';
  };

  const getStatusIcon = (status) => {
    const icons = {
      Pending: <ClockCircleOutlined />,
      Approved: <CheckCircleOutlined />,
      Rejected: <CloseCircleOutlined />,
    };
    return icons[status] || <FileTextOutlined />;
  };

  const getStatistics = () => {
    const pending = requests.filter((r) => r.status === 'Pending').length;
    const approved = requests.filter((r) => r.status === 'Approved').length;
    const rejected = requests.filter((r) => r.status === 'Rejected').length;
    return { pending, approved, rejected, total: requests.length };
  };

  const stats = getStatistics();

  const columns = [
    {
      title: 'Request ID',
      dataIndex: 'requestId',
      key: 'requestId',
      width: 130,
      render: (text) => <Tag color="blue">REQ{text}</Tag>,
    },
    {
      title: 'Entity ID',
      dataIndex: 'entityId',
      key: 'entityId',
      width: 150,
      render: (text) => <span style={{ fontWeight: 500 }}>{text}</span>,
    },
    {
      title: 'Request Type',
      dataIndex: 'requestType',
      key: 'requestType',
      width: 130,
      render: (text) => <Tag color="purple">{text}</Tag>,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 130,
      render: (status) => (
        <Tag icon={getStatusIcon(status)} color={getStatusColor(status)}>
          {status}
        </Tag>
      ),
      filters: [
        { text: 'Pending', value: 'Pending' },
        { text: 'Approved', value: 'Approved' },
        { text: 'Rejected', value: 'Rejected' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 180,
      render: (date) => (
        <Tooltip title={dayjs(date).format('DD/MM/YYYY HH:mm:ss')}>
          <span>{dayjs(date).fromNow()}</span>
        </Tooltip>
      ),
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 220,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => handleViewRequest(record)}
            style={{ padding: 0 }}
          >
            View
          </Button>
          {record.status === 'Pending' && canManage && (
            <>
              <Button
                type="link"
                icon={<CheckOutlined />}
                onClick={() => handleApprove(record.requestId)}
                style={{ padding: 0, color: '#52c41a' }}
              >
                Approve
              </Button>
              <Button
                type="link"
                danger
                icon={<CloseOutlined />}
                onClick={() => handleReject(record.requestId)}
                style={{ padding: 0 }}
              >
                Reject
              </Button>
            </>
          )}
        </Space>
      ),
    },
  ];

  if (!canManage) {
    return (
      <div style={{ padding: '24px' }}>
        <Card>
          <Empty
            description={
              <div>
                <p style={{ fontSize: '16px', fontWeight: 500 }}>Access Denied</p>
                <p>Only Administrators and Education Officers can manage requests.</p>
              </div>
            }
          />
        </Card>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px' }}>
      <Card
        title={
          <Space>
            <FileTextOutlined style={{ fontSize: '24px' }} />
            <span style={{ fontSize: '20px', fontWeight: 'bold' }}>Request Management</span>
          </Space>
        }
        extra={
          <Button
            icon={<ReloadOutlined />}
            onClick={fetchAllRequests}
            loading={loading}
          >
            Refresh
          </Button>
        }
      >
        {/* Statistics */}
        <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
          <Card size="small" style={{ flex: 1, minWidth: '200px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#1890ff' }}>
                {stats.total}
              </div>
              <div style={{ color: '#999' }}>Total Requests</div>
            </div>
          </Card>
          <Card size="small" style={{ flex: 1, minWidth: '200px' }}>
            <div style={{ textAlign: 'center' }}>
              <Badge count={stats.pending} style={{ backgroundColor: '#faad14' }} />
              <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#faad14', marginTop: '8px' }}>
                {stats.pending}
              </div>
              <div style={{ color: '#999' }}>Pending</div>
            </div>
          </Card>
          <Card size="small" style={{ flex: 1, minWidth: '200px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#52c41a' }}>
                {stats.approved}
              </div>
              <div style={{ color: '#999' }}>Approved</div>
            </div>
          </Card>
          <Card size="small" style={{ flex: 1, minWidth: '200px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#ff4d4f' }}>
                {stats.rejected}
              </div>
              <div style={{ color: '#999' }}>Rejected</div>
            </div>
          </Card>
        </div>

        {/* Search */}
        <div style={{ marginBottom: '16px' }}>
          <Input
            placeholder="Search by request ID, entity ID, type, or status..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: '100%', maxWidth: 500 }}
            allowClear
          />
        </div>

        {/* Table */}
        <Table
          columns={columns}
          dataSource={filteredRequests}
          rowKey="requestId"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} requests`,
          }}
          scroll={{ x: 1200 }}
        />
      </Card>

      {/* View Details Modal */}
      <Modal
        title={
          <span>
            <EyeOutlined style={{ marginRight: 8 }} />
            Request Details
          </span>
        }
        open={isViewModalVisible}
        onCancel={() => setIsViewModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsViewModalVisible(false)}>
            Close
          </Button>,
        ]}
        width={700}
      >
        {selectedRequest && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <strong>Request ID:</strong>
                <div><Tag color="blue" style={{ marginTop: '4px' }}>REQ{selectedRequest.requestId}</Tag></div>
              </div>
              <div>
                <strong>Status:</strong>
                <div style={{ marginTop: '4px' }}>
                  <Tag icon={getStatusIcon(selectedRequest.status)} color={getStatusColor(selectedRequest.status)}>
                    {selectedRequest.status}
                  </Tag>
                </div>
              </div>
              <div>
                <strong>Entity ID:</strong>
                <div style={{ marginTop: '4px', fontWeight: 500 }}>{selectedRequest.entityId}</div>
              </div>
              <div>
                <strong>Request Type:</strong>
                <div style={{ marginTop: '4px' }}><Tag color="purple">{selectedRequest.requestType}</Tag></div>
              </div>
              <div>
                <strong>Created At:</strong>
                <div style={{ marginTop: '4px' }}>{dayjs(selectedRequest.createdAt).format('DD/MM/YYYY HH:mm:ss')}</div>
              </div>
              <div>
                <strong>Updated At:</strong>
                <div style={{ marginTop: '4px' }}>
                  {selectedRequest.updatedAt ? dayjs(selectedRequest.updatedAt).format('DD/MM/YYYY HH:mm:ss') : 'N/A'}
                </div>
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <strong>Description:</strong>
              <div style={{ marginTop: '8px', padding: '12px', background: '#f5f5f5', borderRadius: '4px', whiteSpace: 'pre-wrap' }}>
                {selectedRequest.description}
              </div>
            </div>

            {selectedRequest.notes && (
              <div>
                <strong>Notes:</strong>
                <div style={{ marginTop: '8px', padding: '12px', background: '#f0f2f5', borderRadius: '4px', whiteSpace: 'pre-wrap' }}>
                  {selectedRequest.notes}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default RequestPage;