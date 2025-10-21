// src/page/CourseSubjectSpecialty/CourseSubjectSpecialtyPage.jsx
import React, { useEffect, useState } from 'react';
import { 
  Table, 
  Card, 
  message, 
  Button, 
  Space, 
  Input, 
  Modal, 
  Form, 
  Tag,
  Select,
  Row,
  Col,
} from 'antd';
import { 
  PlusOutlined, 
  DeleteOutlined, 
  SearchOutlined,
  ReloadOutlined,
  BookOutlined,
  FilterOutlined,
  TeamOutlined,
  FileTextOutlined,
} from '@ant-design/icons';
import { courseSubjectSpecialtyService } from '../../service/coursesubjectspecialtyServices';
import { courseService } from '../../service/courseServices';
import { subjectService } from '../../service/subjectServices';
import { specialtyService } from '../../service/specialtyServices';

const CourseSubjectSpecialtyPage = () => {
  const [relationships, setRelationships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [filteredRelationships, setFilteredRelationships] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  // Filter states
  const [filterType, setFilterType] = useState('all'); // all, course, specialty, subject
  const [filterValue, setFilterValue] = useState(null);

  // Data for dropdowns
  const [courses, setCourses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [specialties, setSpecialties] = useState([]);

  const userRole = sessionStorage.getItem('role');
  const canEdit = userRole === 'Education Officer';

  useEffect(() => {
    fetchAllData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchText, relationships, filterType, filterValue]);

  const fetchAllData = async () => {
    await Promise.all([
      fetchAllRelationships(),
      fetchCourses(),
      fetchSubjects(),
      fetchSpecialties(),
    ]);
  };

  const fetchAllRelationships = async () => {
    try {
      setLoading(true);
      const response = await courseSubjectSpecialtyService.getAllRelationships();
      
      if (response.success) {
        setRelationships(response.data || []);
        message.success('Relationships loaded successfully');
      } else {
        message.error(response.message || 'Failed to load relationships');
      }
    } catch (error) {
      console.error('Error fetching relationships:', error);
      message.error('Failed to fetch relationships. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await courseService.getAllCourses();
      if (response.success) {
        setCourses(response.data || []);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const fetchSubjects = async () => {
    try {
      const response = await subjectService.getAllSubjects();
      if (response.success) {
        setSubjects(response.data || []);
      }
    } catch (error) {
      console.error('Error fetching subjects:', error);
    }
  };

  const fetchSpecialties = async () => {
    try {
      const response = await specialtyService.getAllSpecialties();
      if (response.success) {
        setSpecialties(response.data || []);
      }
    } catch (error) {
      console.error('Error fetching specialties:', error);
    }
  };

  const applyFilters = () => {
    let filtered = relationships;

    // Apply filter by type
    if (filterType !== 'all' && filterValue) {
      switch (filterType) {
        case 'course':
          filtered = filtered.filter(r => r.courseId === filterValue);
          break;
        case 'specialty':
          filtered = filtered.filter(r => r.specialtyId === filterValue);
          break;
        case 'subject':
          filtered = filtered.filter(r => r.subjectId === filterValue);
          break;
        default:
          break;
      }
    }

    // Apply search text
    if (searchText.trim() !== '') {
      filtered = filtered.filter(r => 
        r.courseId?.toLowerCase().includes(searchText.toLowerCase()) ||
        r.courseName?.toLowerCase().includes(searchText.toLowerCase()) ||
        r.subjectId?.toLowerCase().includes(searchText.toLowerCase()) ||
        r.subjectName?.toLowerCase().includes(searchText.toLowerCase()) ||
        r.specialtyId?.toLowerCase().includes(searchText.toLowerCase()) ||
        r.specialtyName?.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    setFilteredRelationships(filtered);
  };

  const handleFilterTypeChange = (value) => {
    setFilterType(value);
    setFilterValue(null);
  };

  const handleCreate = () => {
    if (!canEdit) {
      message.warning('Only Education Officers can create relationships');
      return;
    }
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      
      const relationshipData = {
        specialtyId: values.specialtyId,
        subjectId: values.subjectId,
        courseId: values.courseId,
      };

      const response = await courseSubjectSpecialtyService.createRelationship(relationshipData);
      if (response.success) {
        message.success('Relationship created successfully');
        setIsModalVisible(false);
        form.resetFields();
        fetchAllRelationships();
      } else {
        message.error(response.message || 'Failed to create relationship');
      }
    } catch (error) {
      if (error.errorFields) {
        message.error('Please fill in all required fields');
      } else {
        console.error('Error saving relationship:', error);
        message.error('Failed to save relationship. Please try again.');
      }
    }
  };

  const handleDeleteByCourse = async (courseId) => {
    if (!canEdit) {
      message.warning('Only Education Officers can delete relationships');
      return;
    }

    Modal.confirm({
      title: 'Delete All Relationships for Course',
      content: `Are you sure you want to delete ALL relationships for course "${courseId}"? This action cannot be undone.`,
      okText: 'Yes, Delete All',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          const response = await courseSubjectSpecialtyService.deleteRelationshipsByCourse(courseId);
          if (response.success) {
            message.success('All relationships for this course deleted successfully');
            fetchAllRelationships();
          } else {
            message.error(response.message || 'Failed to delete relationships');
          }
        } catch (error) {
          console.error('Error deleting relationships:', error);
          message.error('Failed to delete relationships. Please try again.');
        }
      },
    });
  };

  const handleDeleteBySpecialty = async (specialtyId) => {
    if (!canEdit) {
      message.warning('Only Education Officers can delete relationships');
      return;
    }

    Modal.confirm({
      title: 'Delete All Relationships for Specialty',
      content: `Are you sure you want to delete ALL relationships for specialty "${specialtyId}"? This action cannot be undone.`,
      okText: 'Yes, Delete All',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          const response = await courseSubjectSpecialtyService.deleteRelationshipsBySpecialty(specialtyId);
          if (response.success) {
            message.success('All relationships for this specialty deleted successfully');
            fetchAllRelationships();
          } else {
            message.error(response.message || 'Failed to delete relationships');
          }
        } catch (error) {
          console.error('Error deleting relationships:', error);
          message.error('Failed to delete relationships. Please try again.');
        }
      },
    });
  };

  const columns = [
    {
      title: 'Specialty',
      dataIndex: 'specialtyId',
      key: 'specialty',
      width: 200,
      render: (text, record) => (
        <div>
          <Tag color="purple" icon={<TeamOutlined />}>{text}</Tag>
          <div style={{ marginTop: '4px', fontSize: '12px', color: '#666' }}>
            {record.specialtyName}
          </div>
        </div>
      ),
    },
    {
      title: 'Subject',
      dataIndex: 'subjectId',
      key: 'subject',
      width: 220,
      render: (text, record) => (
        <div>
          <Tag color="green" icon={<FileTextOutlined />}>{text}</Tag>
          <div style={{ marginTop: '4px', fontSize: '12px', color: '#666' }}>
            {record.subjectName}
          </div>
        </div>
      ),
    },
    {
      title: 'Course',
      dataIndex: 'courseId',
      key: 'course',
      width: 220,
      render: (text, record) => (
        <div>
          <Tag color="blue" icon={<BookOutlined />}>{text}</Tag>
          <div style={{ marginTop: '4px', fontSize: '12px', color: '#666' }}>
            {record.courseName}
          </div>
        </div>
      ),
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 180,
      render: (date) => date ? new Date(date).toLocaleString('en-GB') : 'N/A',
    },
  ];

  // Group data by filter type for bulk actions
  const getUniqueValues = () => {
    const uniqueCourses = [...new Set(filteredRelationships.map(r => r.courseId))];
    const uniqueSpecialties = [...new Set(filteredRelationships.map(r => r.specialtyId))];
    
    return { uniqueCourses, uniqueSpecialties };
  };

  const { uniqueCourses, uniqueSpecialties } = getUniqueValues();

  return (
    <div style={{ padding: '24px' }}>
      <Card
        title={
          <span style={{ fontSize: '20px', fontWeight: 'bold' }}>
            Course-Subject-Specialty Relationships
          </span>
        }
        extra={
          <Space>
            <Tag color="blue">Total: {filteredRelationships.length}</Tag>
            {!canEdit && <Tag color="orange">View Only Mode</Tag>}
          </Space>
        }
      >
        {!canEdit && (
          <div style={{ 
            marginBottom: '16px', 
            padding: '12px', 
            background: '#fff7e6', 
            border: '1px solid #ffd591',
            borderRadius: '4px'
          }}>
            <span style={{ color: '#fa8c16' }}>
              ⚠️ Only Education Officers can manage course-subject-specialty relationships.
            </span>
          </div>
        )}

        {/* Filters and Search */}
        <Row gutter={[16, 16]} style={{ marginBottom: '16px' }}>
          <Col xs={24} sm={12} md={8}>
            <Input
              placeholder="Search by ID or Name..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Select
              style={{ width: '100%' }}
              placeholder="Filter Type"
              value={filterType}
              onChange={handleFilterTypeChange}
              suffixIcon={<FilterOutlined />}
            >
              <Select.Option value="all">All Relationships</Select.Option>
              <Select.Option value="course">By Course</Select.Option>
              <Select.Option value="specialty">By Specialty</Select.Option>
              <Select.Option value="subject">By Subject</Select.Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} md={6}>
            {filterType === 'course' && (
              <Select
                style={{ width: '100%' }}
                placeholder="Select Course"
                value={filterValue}
                onChange={setFilterValue}
                allowClear
                showSearch
                optionFilterProp="label"
                options={courses.map(c => ({
                  value: c.courseId,
                  label: `${c.courseId} - ${c.courseName}`,
                }))}
              />
            )}
            {filterType === 'specialty' && (
              <Select
                style={{ width: '100%' }}
                placeholder="Select Specialty"
                value={filterValue}
                onChange={setFilterValue}
                allowClear
                showSearch
                optionFilterProp="label"
                options={specialties.map(s => ({
                  value: s.specialtyId,
                  label: `${s.specialtyId} - ${s.specialtyName}`,
                }))}
              />
            )}
            {filterType === 'subject' && (
              <Select
                style={{ width: '100%' }}
                placeholder="Select Subject"
                value={filterValue}
                onChange={setFilterValue}
                allowClear
                showSearch
                optionFilterProp="label"
                options={subjects.map(s => ({
                  value: s.subjectId,
                  label: `${s.subjectId} - ${s.subjectName}`,
                }))}
              />
            )}
          </Col>
          <Col xs={24} sm={12} md={4}>
            <Space>
              <Button
                icon={<ReloadOutlined />}
                onClick={fetchAllRelationships}
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
                  Add
                </Button>
              )}
            </Space>
          </Col>
        </Row>

        {/* Bulk Actions */}
        {canEdit && filteredRelationships.length > 0 && (
          <div style={{ 
            marginBottom: '16px', 
            padding: '12px', 
            background: '#f0f2f5',
            borderRadius: '4px'
          }}>
            <Space wrap>
              <span style={{ fontWeight: 500 }}>Bulk Delete Actions:</span>
              {uniqueCourses.length > 0 && (
                <Select
                  style={{ width: 250 }}
                  placeholder="Delete all for Course..."
                  onChange={(value) => handleDeleteByCourse(value)}
                  value={null}
                  allowClear
                >
                  {uniqueCourses.map(courseId => (
                    <Select.Option key={courseId} value={courseId}>
                      Delete all for Course: {courseId}
                    </Select.Option>
                  ))}
                </Select>
              )}
              {uniqueSpecialties.length > 0 && (
                <Select
                  style={{ width: 250 }}
                  placeholder="Delete all for Specialty..."
                  onChange={(value) => handleDeleteBySpecialty(value)}
                  value={null}
                  allowClear
                >
                  {uniqueSpecialties.map(specialtyId => (
                    <Select.Option key={specialtyId} value={specialtyId}>
                      Delete all for Specialty: {specialtyId}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </Space>
          </div>
        )}

        {/* Table */}
        <Table
          columns={columns}
          dataSource={filteredRelationships}
          rowKey={(record) => `${record.specialtyId}-${record.subjectId}-${record.courseId}`}
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} relationships`,
          }}
          scroll={{ x: 1000 }}
        />
      </Card>

      {/* Create Modal */}
      <Modal
        title="Create New Relationship"
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
        }}
        okText="Create"
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          name="relationshipForm"
        >
          <Form.Item
            name="courseId"
            label="Course"
            rules={[{ required: true, message: 'Please select a course' }]}
          >
            <Select
              placeholder="Select a course"
              showSearch
              optionFilterProp="label"
              options={courses.map(c => ({
                value: c.courseId,
                label: `${c.courseId} - ${c.courseName}`,
              }))}
            />
          </Form.Item>

          <Form.Item
            name="subjectId"
            label="Subject"
            rules={[{ required: true, message: 'Please select a subject' }]}
          >
            <Select
              placeholder="Select a subject"
              showSearch
              optionFilterProp="label"
              options={subjects.map(s => ({
                value: s.subjectId,
                label: `${s.subjectId} - ${s.subjectName}`,
              }))}
            />
          </Form.Item>

          <Form.Item
            name="specialtyId"
            label="Specialty"
            rules={[{ required: true, message: 'Please select a specialty' }]}
          >
            <Select
              placeholder="Select a specialty"
              showSearch
              optionFilterProp="label"
              options={specialties.map(s => ({
                value: s.specialtyId,
                label: `${s.specialtyId} - ${s.specialtyName}`,
              }))}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CourseSubjectSpecialtyPage;

