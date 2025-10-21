// src/page/Subject/SubjectPage.jsx
import React, { useEffect, useState } from 'react';
import { Table, Card, message, Button, Space, Input, Modal, Form, Tag, Select } from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  SearchOutlined,
  ReloadOutlined,
  CheckOutlined,
  CloseOutlined,
  FileAddOutlined,
  BookOutlined,
} from '@ant-design/icons';
import { subjectService } from '../../service/subjectServices';
import { useNavigate } from 'react-router-dom';

const SubjectPage = () => {
  const [subjects, setSubjects] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [filteredSubjects, setFilteredSubjects] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [form] = Form.useForm();
  const [assignations, setAssignations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalLoading, setModalLoading] = useState(false); // Thêm state này

  const userRole = sessionStorage.getItem('role');
  const canEdit = userRole === 'Education Officer' || userRole === 'Administrator';
  const navigate = useNavigate();

  useEffect(() => {
    fetchAllSubjects();
  }, []);

  useEffect(() => {
    // Filter subjects based on search text and status
    let filtered = subjects;

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(subject => subject.status === statusFilter);
    }

    // Filter by search text
    if (searchText.trim() !== '') {
      filtered = filtered.filter(subject => 
        subject.subjectId?.toLowerCase().includes(searchText.toLowerCase()) ||
        subject.subjectName?.toLowerCase().includes(searchText.toLowerCase()) ||
        subject.description?.toLowerCase().includes(searchText.toLowerCase()) ||
        subject.minTotalScore?.toString().includes(searchText.toLowerCase())
      );
    }

    setFilteredSubjects(filtered);
  }, [searchText, subjects, statusFilter]);

  const fetchAllSubjects = async () => {
    try {
      setLoading(true);
      const response = await subjectService.getAllSubjects();
      
      if (response.success) {
        setSubjects(response.data || []);
        setFilteredSubjects(response.data || []);
        message.success('Subjects loaded successfully');
      } else {
        message.error(response.message || 'Failed to load subjects');
      }
    } catch (error) {
      console.error('Error fetching subjects:', error);
      message.error(
        error.response?.data?.message || 
        'Failed to fetch subjects. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    if (!canEdit) {
      message.warning('You do not have permission to create subjects');
      return;
    }
    setEditingSubject(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = async (record) => {
    if (!canEdit) {
      message.warning('You do not have permission to edit subjects');
      return;
    }
    
    try {
      setModalLoading(true);
      // Gọi API getSubjectById để lấy full details
      const response = await subjectService.getSubjectById(record.subjectId);
      
      if (response.success) {
        const fullDetails = response.data;
        setEditingSubject(fullDetails);
        form.setFieldsValue(fullDetails);
        setIsModalVisible(true);
      } else {
        message.error(response.message || 'Failed to load subject details');
      }
    } catch (error) {
      console.error('Error loading subject details:', error);
      message.error(
        error.response?.data?.message || 
        'Failed to load subject details. Please try again.'
      );
    } finally {
      setModalLoading(false);
    }
  };

  const handleDelete = async (subjectId) => {
    if (!canEdit) {
      message.warning('You do not have permission to delete subjects');
      return;
    }

    Modal.confirm({
      title: 'Are you sure you want to delete this subject?',
      content: 'This action cannot be undone.',
      okText: 'Yes, Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          const response = await subjectService.deleteSubject(subjectId);
          if (response.success) {
            message.success('Subject deleted successfully');
            fetchAllSubjects();
          } else {
            message.error(response.message || 'Failed to delete subject');
          }
        } catch (error) {
          console.error('Error deleting subject:', error);
          message.error(
            error.response?.data?.message || 
            'Failed to delete subject. Please try again.'
          );
        }
      },
    });
  };

  const handleApprove = async (subjectId) => {
    if (!canEdit) {
      message.warning('You do not have permission to approve subjects');
      return;
    }

    try {
      const response = await subjectService.approveSubject(subjectId);
      if (response.success) {
        message.success('Subject approved successfully');
        fetchAllSubjects();
      } else {
        message.error(response.message || 'Failed to approve subject');
      }
    } catch (error) {
      console.error('Error approving subject:', error);
      message.error(
        error.response?.data?.message || 
        'Failed to approve subject. Please try again.'
      );
    }
  };

  const handleReject = async (subjectId) => {
    if (!canEdit) {
      message.warning('You do not have permission to reject subjects');
      return;
    }

    Modal.confirm({
      title: 'Are you sure you want to reject this subject?',
      content: 'This action will mark the subject as rejected.',
      okText: 'Yes, Reject',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          const response = await subjectService.rejectSubject(subjectId);
          if (response.success) {
            message.success('Subject rejected successfully');
            fetchAllSubjects();
          } else {
            message.error(response.message || 'Failed to reject subject');
          }
        } catch (error) {
          console.error('Error rejecting subject:', error);
          message.error(
            error.response?.data?.message || 
            'Failed to reject subject. Please try again.'
          );
        }
      },
    });
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      
      // Build subject data - chỉ gửi fields có giá trị
      const subjectData = {
        subjectId: values.subjectId,
        subjectName: values.subjectName,
        description: values.description,
      };

      // Add optional numeric fields only if they have values
      if (values.minAttendance !== undefined && values.minAttendance !== null && values.minAttendance !== '') {
        subjectData.minAttendance = parseFloat(values.minAttendance);
      }
      
      if (values.minPracticeExamScore !== undefined && values.minPracticeExamScore !== null && values.minPracticeExamScore !== '') {
        subjectData.minPracticeExamScore = parseFloat(values.minPracticeExamScore);
      }
      
      if (values.minFinalExamScore !== undefined && values.minFinalExamScore !== null && values.minFinalExamScore !== '') {
        subjectData.minFinalExamScore = parseFloat(values.minFinalExamScore);
      }
      
      if (values.minTotalScore !== undefined && values.minTotalScore !== null && values.minTotalScore !== '') {
        subjectData.minTotalScore = parseFloat(values.minTotalScore);
      }

      // Add status for editing
      if (editingSubject && values.status) {
        subjectData.status = values.status;
      }
      
      if (editingSubject) {
        // Update existing subject
        const response = await subjectService.updateSubject(
          editingSubject.subjectId,
          subjectData
        );
        if (response.success) {
          message.success('Subject updated successfully');
          setIsModalVisible(false);
          fetchAllSubjects();
        } else {
          message.error(response.message || 'Failed to update subject');
        }
      } else {
        // Create new subject
        const response = await subjectService.createSubject(subjectData);
        if (response.success) {
          message.success('Subject created successfully');
          setIsModalVisible(false);
          fetchAllSubjects();
        } else {
          message.error(response.message || 'Failed to create subject');
        }
      }
    } catch (error) {
      if (error.errorFields) {
        message.error('Please fill in all required fields');
      } else {
        console.error('Error saving subject:', error);
        message.error(
          error.response?.data?.message || 
          'Failed to save subject. Please try again.'
        );
      }
    }
  };

  const getStatusTag = (status) => {
    const statusConfig = {
      'Approved': { color: 'green', icon: <CheckOutlined /> },
      'Pending': { color: 'orange', icon: <CloseOutlined /> },
      'Rejected': { color: 'red', icon: <CloseOutlined /> },
      'Active': { color: 'blue', icon: <CheckOutlined /> },
    };
    
    const config = statusConfig[status] || { color: 'default' };
    return <Tag color={config.color} icon={config.icon}>{status}</Tag>;
  };

  const handleViewDetails = (subjectId) => {
    navigate(`/subject/${subjectId}`);
  };

  const columns = [
    {
      title: 'Subject ID',
      dataIndex: 'subjectId',
      key: 'subjectId',
      width: 150,
      render: (text) => (
        <Tag 
          color="blue" 
          icon={<BookOutlined />}
          style={{ cursor: 'pointer' }}
          onClick={() => handleViewDetails(text)}
        >
          {text}
        </Tag>
      ),
    },
    {
      title: 'Subject Name',
      dataIndex: 'subjectName',
      key: 'subjectName',
      width: 250,
      render: (text) => <span style={{ fontWeight: 500 }}>{text}</span>,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: 'Min Total Score',
      dataIndex: 'minTotalScore',
      key: 'minTotalScore',
      width: 130,
      align: 'center',
      render: (value) => value !== null && value !== undefined ? (
        <Tag color="purple">{value}</Tag>
      ) : (
        <span style={{ color: '#999' }}>-</span>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status) => getStatusTag(status),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Card
        title={
          <span style={{ fontSize: '20px', fontWeight: 'bold' }}>
            Subject Management
          </span>
        }
        extra={
          <Space>
            <Tag color="blue">Total: {filteredSubjects.length}</Tag>
            {!canEdit && <Tag color="orange">View Only Mode</Tag>}
          </Space>
        }
      >
        {/* Permission Warning */}
        {!canEdit && (
          <div style={{ 
            marginBottom: '16px', 
            padding: '12px', 
            background: '#fff7e6', 
            border: '1px solid #ffd591',
            borderRadius: '4px'
          }}>
            <span style={{ color: '#fa8c16' }}>
              ⚠️ Only Education Officers and Administrators can manage subjects.
            </span>
          </div>
        )}

        {/* Search and Actions Bar */}
        <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', gap: '16px' }}>
          <Space style={{ flex: 1 }}>
            <Input
              placeholder="Search by ID, name or description..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 350 }}
              allowClear
            />
            <Select
              value={statusFilter}
              onChange={setStatusFilter}
              style={{ width: 150 }}
            >
              <Select.Option value="all">All Status</Select.Option>
              <Select.Option value="Approved">Approved</Select.Option>
              <Select.Option value="Pending">Pending</Select.Option>
              <Select.Option value="Rejected">Rejected</Select.Option>
              <Select.Option value="Active">Active</Select.Option>
            </Select>
          </Space>
          <Space>
            <Button
              icon={<ReloadOutlined />}
              onClick={fetchAllSubjects}
              loading={loading}
            >
              Refresh
            </Button>
            {canEdit && (
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleCreate}
              >
                Add Subject
              </Button>
            )}
          </Space>
        </div>

        {/* Table */}
        <Table
          columns={columns}
          dataSource={filteredSubjects}
          rowKey="subjectId"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} subjects`,
          }}
        />
      </Card>

      {/* Create/Edit Modal */}
      <Modal
        title={editingSubject ? 'Edit Subject' : 'Create New Subject'}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
        }}
        okText={editingSubject ? 'Update' : 'Create'}
        width={600}
        confirmLoading={modalLoading}
      >
        <Form
          form={form}
          layout="vertical"
          name="subjectForm"
        >
          <Form.Item
            name="subjectId"
            label="Subject ID"
            rules={[{ required: true, message: 'Please enter subject ID' }]}
          >
            <Input 
              placeholder="e.g., CALAR001" 
              disabled={!!editingSubject}
            />
          </Form.Item>

          <Form.Item
            name="subjectName"
            label="Subject Name"
            rules={[{ required: true, message: 'Please enter subject name' }]}
          >
            <Input placeholder="e.g., Civil Air Law and Regulations" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: 'Please enter description' }]}
          >
            <Input.TextArea 
              rows={4} 
              placeholder="Enter subject description..." 
            />
          </Form.Item>

          {/* Optional Score Fields */}
          <div style={{ 
            padding: '16px', 
            background: '#f5f5f5', 
            borderRadius: '8px',
            marginBottom: '16px' 
          }}>
            <p style={{ fontWeight: 500, marginBottom: '12px', color: '#666' }}>
              Score Requirements (Optional)
            </p>
            
            <Form.Item
              name="minAttendance"
              label="Minimum Attendance (%)"
              tooltip="Optional: Minimum attendance percentage required (0-100)"
            >
              <Input 
                type="number" 
                placeholder="e.g., 80" 
                min={0}
                max={100}
                step={1}
              />
            </Form.Item>

            <Form.Item
              name="minPracticeExamScore"
              label="Minimum Practice Exam Score"
              tooltip="Optional: Minimum score for practice exam (0-10)"
            >
              <Input 
                type="number" 
                placeholder="e.g., 6" 
                min={0}
                max={10}
                step={0.5}
              />
            </Form.Item>

            <Form.Item
              name="minFinalExamScore"
              label="Minimum Final Exam Score"
              tooltip="Optional: Minimum score for final exam (0-10)"
            >
              <Input 
                type="number" 
                placeholder="e.g., 5" 
                min={0}
                max={10}
                step={0.5}
              />
            </Form.Item>

            <Form.Item
              name="minTotalScore"
              label="Minimum Total Score"
              tooltip="Optional: Minimum total score required (0-10)"
            >
              <Input 
                type="number" 
                placeholder="e.g., 6" 
                min={0}
                max={10}
                step={0.5}
              />
            </Form.Item>
          </div>

          {editingSubject && (
            <Form.Item
              name="status"
              label="Status"
              rules={[{ required: true, message: 'Please select status' }]}
            >
              <Select placeholder="Select status">
                <Select.Option value="Approved">Approved</Select.Option>
                <Select.Option value="Pending">Pending</Select.Option>
                <Select.Option value="Rejected">Rejected</Select.Option>
                <Select.Option value="Active">Active</Select.Option>
              </Select>
            </Form.Item>
          )}
        </Form> 
      </Modal>
    </div>
  );
};

export default SubjectPage;