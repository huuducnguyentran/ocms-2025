// src/page/Course/CourseDetailsPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Card, 
  Descriptions, 
  Button, 
  Space, 
  Tag, 
  Spin, 
  message, 
  Divider,
  Modal,
  Form,
  Input,
  Table,
} from 'antd';
import { 
  ArrowLeftOutlined, 
  EditOutlined, 
  DeleteOutlined,
  CheckOutlined,
  CloseOutlined,
  BookOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import { courseService } from '../../service/courseServices';

const CourseDetailsPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subjectsLoading, setSubjectsLoading] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [form] = Form.useForm();

  const userRole = sessionStorage.getItem('role');
  const canEdit = userRole === 'Education Officer';
  const canApprove = userRole === 'Administrator';

  useEffect(() => {
    fetchCourseDetails();
    fetchCourseSubjects();
  }, [courseId]);

  const fetchCourseDetails = async () => {
    try {
      setLoading(true);
      const response = await courseService.getCourseById(courseId);
      
      if (response.success) {
        setCourse(response.data);
      } else {
        message.error(response.message || 'Failed to load course details');
        navigate('/all-courses');
      }
    } catch (error) {
      console.error('Error fetching course details:', error);
      message.error(
        error.response?.data?.message || 
        'Failed to fetch course details. Please try again.'
      );
      navigate('/all-courses');
    } finally {
      setLoading(false);
    }
  };

  const fetchCourseSubjects = async () => {
    try {
      setSubjectsLoading(true);
      const response = await courseService.getCourseSubjects(courseId);
      
      if (response.success) {
        setSubjects(response.data || []);
      } else {
        console.error('Failed to load course subjects');
      }
    } catch (error) {
      console.error('Error fetching course subjects:', error);
    } finally {
      setSubjectsLoading(false);
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

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleBack = () => {
    navigate('/all-courses');
  };

  const handleEdit = () => {
    if (!canEdit) {
      message.warning('You do not have permission to edit courses');
      return;
    }
    
    // Load current course data into form
    form.setFieldsValue({
      courseName: course.courseName,
      description: course.description,
    });
    
    setIsEditModalVisible(true);
  };

  const handleEditModalOk = async () => {
    try {
      const values = await form.validateFields();
      setEditLoading(true);

      const response = await courseService.updateCourse(courseId, values);
      
      if (response.success) {
        message.success('Course updated successfully');
        setIsEditModalVisible(false);
        form.resetFields();
        fetchCourseDetails();
      } else {
        message.error(response.message || 'Failed to update course');
      }
    } catch (error) {
      if (error.errorFields) {
        message.error('Please fill in all required fields');
      } else {
        console.error('Error updating course:', error);
        message.error(
          error.response?.data?.message || 
          'Failed to update course. Please try again.'
        );
      }
    } finally {
      setEditLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!canEdit) {
      message.warning('You do not have permission to delete courses');
      return;
    }

    Modal.confirm({
      title: 'Delete Course',
      icon: <ExclamationCircleOutlined />,
      content: (
        <div>
          <p>Are you sure you want to delete this course?</p>
          <p style={{ fontWeight: 500, color: '#ff4d4f' }}>
            Course ID: {course.courseId}
          </p>
          <p style={{ fontWeight: 500 }}>
            Course Name: {course.courseName}
          </p>
          <p style={{ marginTop: '12px', color: '#666' }}>
            This action cannot be undone.
          </p>
        </div>
      ),
      okText: 'Yes, Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      width: 500,
      onOk: async () => {
        try {
          const response = await courseService.deleteCourse(courseId);
          
          if (response.success) {
            message.success('Course deleted successfully');
            setTimeout(() => {
              navigate('/all-courses');
            }, 1000);
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

  const handleApprove = async () => {
    if (!canApprove) {
      message.warning('Only Administrators can approve courses');
      return;
    }

    try {
      const response = await courseService.approveCourse(courseId);
      if (response.success) {
        message.success('Course approved successfully');
        fetchCourseDetails();
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

  const handleReject = async () => {
    if (!canApprove) {
      message.warning('Only Administrators can reject courses');
      return;
    }

    Modal.confirm({
      title: 'Reject Course',
      icon: <ExclamationCircleOutlined />,
      content: 'Are you sure you want to reject this course?',
      okText: 'Yes, Reject',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          const response = await courseService.rejectCourse(courseId);
          if (response.success) {
            message.success('Course rejected successfully');
            fetchCourseDetails();
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

  // Columns for subjects table
  const subjectColumns = [
    {
      title: 'Subject ID',
      dataIndex: 'subjectId',
      key: 'subjectId',
      width: 150,
      render: (text) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: 'Subject Name',
      dataIndex: 'subjectName',
      key: 'subjectName',
      render: (text) => <span style={{ fontWeight: 500 }}>{text}</span>,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
  ];

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '400px' 
      }}>
        <Spin size="large" tip="Loading course details..." />
      </div>
    );
  }

  if (!course) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <p>Course not found</p>
        <Button type="primary" onClick={handleBack}>
          Back to Courses
        </Button>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px' }}>
      <Card
        title={
          <Space>
            <BookOutlined style={{ fontSize: '24px', color: '#1890ff' }} />
            <span style={{ fontSize: '20px', fontWeight: 'bold' }}>
              Course Details
            </span>
          </Space>
        }
        extra={
          <Space>
            <Button 
              icon={<ArrowLeftOutlined />} 
              onClick={handleBack}
            >
              Back
            </Button>
            {canEdit && (
              <>
                <Button 
                  type="primary" 
                  icon={<EditOutlined />}
                  onClick={handleEdit}
                >
                  Edit
                </Button>
                <Button 
                  danger 
                  icon={<DeleteOutlined />}
                  onClick={handleDelete}
                >
                  Delete
                </Button>
              </>
            )}
            {canApprove && course.status === 'Pending' && (
              <>
                <Button 
                  type="primary"
                  style={{ background: '#52c41a', borderColor: '#52c41a' }}
                  icon={<CheckOutlined />}
                  onClick={handleApprove}
                >
                  Approve
                </Button>
                <Button 
                  danger
                  icon={<CloseOutlined />}
                  onClick={handleReject}
                >
                  Reject
                </Button>
              </>
            )}
          </Space>
        }
      >
        {/* Basic Information */}
        <Descriptions 
          title="Basic Information" 
          bordered 
          column={2}
          labelStyle={{ fontWeight: 500, width: '200px' }}
        >
          <Descriptions.Item label="Course ID" span={2}>
            <Tag color="blue" icon={<BookOutlined />} style={{ fontSize: '14px' }}>
              {course.courseId}
            </Tag>
          </Descriptions.Item>
          
          <Descriptions.Item label="Course Name" span={2}>
            <span style={{ fontSize: '16px', fontWeight: 500 }}>
              {course.courseName}
            </span>
          </Descriptions.Item>
          
          <Descriptions.Item label="Description" span={2}>
            {course.description || 'N/A'}
          </Descriptions.Item>
          
          <Descriptions.Item label="Status" span={2}>
            {getStatusTag(course.status)}
          </Descriptions.Item>
        </Descriptions>

        <Divider />

        {/* System Information */}
        <Descriptions 
          title="System Information" 
          bordered 
          column={2}
          labelStyle={{ fontWeight: 500, width: '200px' }}
          style={{ marginTop: '24px' }}
        >
          <Descriptions.Item label="Created By">
            {course.createdByUserName || 'N/A'}
          </Descriptions.Item>
          
          <Descriptions.Item label="Created At">
            {formatDate(course.createdAt)}
          </Descriptions.Item>
          
          <Descriptions.Item label="Updated By">
            {course.updatedByUserName || 'N/A'}
          </Descriptions.Item>
          
          <Descriptions.Item label="Updated At">
            {formatDate(course.updatedAt)}
          </Descriptions.Item>
        </Descriptions>

        <Divider />
      </Card>

      {/* Edit Modal */}
      <Modal
        title="Edit Course"
        open={isEditModalVisible}
        onOk={handleEditModalOk}
        onCancel={() => {
          setIsEditModalVisible(false);
          form.resetFields();
        }}
        okText="Update"
        confirmLoading={editLoading}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          name="editCourseForm"
        >
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

export default CourseDetailsPage;

