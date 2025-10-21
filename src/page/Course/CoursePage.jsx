// src/page/Course/CoursePage.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Card, message, Button, Space, Input, Modal, Form, Tag, Select } from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  SearchOutlined,
  ReloadOutlined,
  CheckOutlined,
  CloseOutlined,
  BookOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import { courseService } from '../../service/courseServices';

const CoursePage = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [form] = Form.useForm();

  const userRole = sessionStorage.getItem('role');
  const canEdit = userRole === 'Education Officer';
  const canApprove = userRole === 'Administrator';

  useEffect(() => {
    fetchAllCourses();
  }, []);

  useEffect(() => {
    // Filter courses based on search text and status
    let filtered = courses;

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(course => course.status === statusFilter);
    }

    // Filter by search text
    if (searchText.trim() !== '') {
      filtered = filtered.filter(course => 
        course.courseId?.toLowerCase().includes(searchText.toLowerCase()) ||
        course.courseName?.toLowerCase().includes(searchText.toLowerCase()) ||
        course.description?.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    setFilteredCourses(filtered);
  }, [searchText, courses, statusFilter]);

  const fetchAllCourses = async () => {
    try {
      setLoading(true);
      const response = await courseService.getAllCourses();
      
      if (response.success) {
        setCourses(response.data || []);
        setFilteredCourses(response.data || []);
        message.success('Courses loaded successfully');
      } else {
        message.error(response.message || 'Failed to load courses');
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
      message.error(
        error.response?.data?.message || 
        'Failed to fetch courses. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    if (!canEdit) {
      message.warning('Only Education Officers can create courses');
      return;
    }
    setEditingCourse(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = async (record) => {
    if (!canEdit) {
      message.warning('Only Education Officers can edit courses');
      return;
    }

    try {
      setLoading(true);
      const response = await courseService.getCourseById(record.courseId);
      
      if (response.success) {
        const fullDetails = response.data;
        setEditingCourse(fullDetails);
        form.setFieldsValue(fullDetails);
        setIsModalVisible(true);
      } else {
        message.error(response.message || 'Failed to load course details');
      }
    } catch (error) {
      console.error('Error loading course details:', error);
      message.error(
        error.response?.data?.message || 
        'Failed to load course details. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (courseId) => {
    if (!canEdit) {
      message.warning('Only Education Officers can delete courses');
      return;
    }

    Modal.confirm({
      title: 'Are you sure you want to delete this course?',
      content: 'This action cannot be undone.',
      okText: 'Yes, Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          const response = await courseService.deleteCourse(courseId);
          if (response.success) {
            message.success('Course deleted successfully');
            fetchAllCourses();
          } else {
            message.error(response.message || 'Failed to delete course');
          }
        } catch (error) {
          console.error('Error deleting course:', error);
          message.error(
            error.response?.data?.message || 
            'Failed to delete course. Please try again.'
          );
        }
      },
    });
  };

  const handleApprove = async (courseId) => {
    if (!canApprove) {
      message.warning('Only Administrators can approve courses');
      return;
    }

    try {
      const response = await courseService.approveCourse(courseId);
      if (response.success) {
        message.success('Course approved successfully');
        fetchAllCourses();
      } else {
        message.error(response.message || 'Failed to approve course');
      }
    } catch (error) {
      console.error('Error approving course:', error);
      message.error(
        error.response?.data?.message || 
        'Failed to approve course. Please try again.'
      );
    }
  };

  const handleReject = async (courseId) => {
    if (!canApprove) {
      message.warning('Only Administrators can reject courses');
      return;
    }

    Modal.confirm({
      title: 'Are you sure you want to reject this course?',
      content: 'This action will mark the course as rejected.',
      okText: 'Yes, Reject',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          const response = await courseService.rejectCourse(courseId);
          if (response.success) {
            message.success('Course rejected successfully');
            fetchAllCourses();
          } else {
            message.error(response.message || 'Failed to reject course');
          }
        } catch (error) {
          console.error('Error rejecting course:', error);
          message.error(
            error.response?.data?.message || 
            'Failed to reject course. Please try again.'
          );
        }
      },
    });
  };

  const handleViewDetails = (courseId) => {
    navigate(`/course/${courseId}`);
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      
      if (editingCourse) {
        // Update existing course
        const response = await courseService.updateCourse(
          editingCourse.courseId,
          values
        );
        if (response.success) {
          message.success('Course updated successfully');
          setIsModalVisible(false);
          fetchAllCourses();
        } else {
          message.error(response.message || 'Failed to update course');
        }
      } else {
        // Create new course
        const response = await courseService.createCourse(values);
        if (response.success) {
          message.success('Course created successfully');
          setIsModalVisible(false);
          fetchAllCourses();
        } else {
          message.error(response.message || 'Failed to create course');
        }
      }
    } catch (error) {
      if (error.errorFields) {
        message.error('Please fill in all required fields');
      } else {
        console.error('Error saving course:', error);
        message.error(
          error.response?.data?.message || 
          'Failed to save course. Please try again.'
        );
      }
    }
  };

  const getStatusTag = (status) => {
    const statusConfig = {
      'Approved': { color: 'green', icon: <CheckOutlined /> },
      'Pending': { color: 'orange', icon: <CloseOutlined /> },
      'Rejected': { color: 'red', icon: <CloseOutlined /> },
    };
    
    const config = statusConfig[status] || { color: 'default' };
    return <Tag color={config.color} icon={config.icon}>{status}</Tag>;
  };

  const columns = [
    {
      title: 'Course ID',
      dataIndex: 'courseId',
      key: 'courseId',
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
      title: 'Course Name',
      dataIndex: 'courseName',
      key: 'courseName',
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
            Course Management
          </span>
        }
        extra={
          <Space>
            <Tag color="blue">Total: {filteredCourses.length}</Tag>
            {!canEdit && !canApprove && <Tag color="orange">View Only Mode</Tag>}
          </Space>
        }
      >
        {/* Permission Warning */}
        {!canEdit && !canApprove && (
          <div style={{ 
            marginBottom: '16px', 
            padding: '12px', 
            background: '#fff7e6', 
            border: '1px solid #ffd591',
            borderRadius: '4px'
          }}>
            <span style={{ color: '#fa8c16' }}>
              ⚠️ Only Education Officers can manage courses. Only Administrators can approve/reject.
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
            </Select>
          </Space>
          <Space>
            <Button
              icon={<ReloadOutlined />}
              onClick={fetchAllCourses}
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
                Add Course
              </Button>
            )}
          </Space>
        </div>

        {/* Table */}
        <Table
          columns={columns}
          dataSource={filteredCourses}
          rowKey="courseId"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} courses`,
          }}
          scroll={{ x: 1200 }}
        />
      </Card>

      {/* Create/Edit Modal */}
      <Modal
        title={editingCourse ? 'Edit Course' : 'Create New Course'}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
        }}
        okText={editingCourse ? 'Update' : 'Create'}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          name="courseForm"
        >
          <Form.Item
            name="courseId"
            label="Course ID"
            rules={[{ required: true, message: 'Please enter course ID' }]}
          >
            <Input 
              placeholder="e.g., COURSE001" 
              disabled={!!editingCourse}
            />
          </Form.Item>

          <Form.Item
            name="courseName"
            label="Course Name"
            rules={[{ required: true, message: 'Please enter course name' }]}
          >
            <Input placeholder="e.g., Aviation Safety Course" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: 'Please enter description' }]}
          >
            <Input.TextArea 
              rows={4} 
              placeholder="Enter course description..." 
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CoursePage;