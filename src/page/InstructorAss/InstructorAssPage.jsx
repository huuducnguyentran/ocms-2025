// src/page/InstructorAss/InstructorAssPage.jsx
import React, { useEffect, useState } from 'react';
import { Table, Card, message, Button, Space, Input, Modal, Form, Select, Tag, Badge } from 'antd';
import { 
  PlusOutlined, 
  DeleteOutlined, 
  SearchOutlined,
  ReloadOutlined,
  UserOutlined,
  BookOutlined,
  DownOutlined,
} from '@ant-design/icons';
import { instructorAssignationService } from '../../service/instructorServices';
import { getAllInstructors } from '../../service/accountServices';
import { subjectService } from '../../service/subjectServices';

const InstructorAssPage = () => {
  const [assignations, setAssignations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [filteredGroupedData, setFilteredGroupedData] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [instructors, setInstructors] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [form] = Form.useForm();

  const userRole = sessionStorage.getItem('role');
  const canEdit = userRole === 'Education Officer';

  useEffect(() => {
    fetchAllAssignations();
    fetchInstructors();
    fetchSubjects();
  }, []);

  useEffect(() => {
    // Group assignations by instructor and apply search filter
    const grouped = groupAssignationsByInstructor(assignations);
    
    if (searchText.trim() === '') {
      setFilteredGroupedData(grouped);
    } else {
      const filtered = grouped.filter(instructor => 
        instructor.instructorName?.toLowerCase().includes(searchText.toLowerCase()) ||
        instructor.instructorId?.toLowerCase().includes(searchText.toLowerCase()) ||
        instructor.subjects.some(subject =>
          subject.subjectId?.toLowerCase().includes(searchText.toLowerCase()) ||
          subject.subjectName?.toLowerCase().includes(searchText.toLowerCase())
        )
      );
      setFilteredGroupedData(filtered);
    }
  }, [searchText, assignations]);

  const groupAssignationsByInstructor = (data) => {
    const grouped = {};
    
    data.forEach(assignation => {
      const instructorId = assignation.instructorId;
      
      if (!grouped[instructorId]) {
        grouped[instructorId] = {
          key: instructorId,
          instructorId: assignation.instructorId,
          instructorName: assignation.instructorName,
          subjects: []
        };
      }
      
      grouped[instructorId].subjects.push({
        subjectId: assignation.subjectId,
        subjectName: assignation.subjectName,
        assignedByUserName: assignation.assignedByUserName,
        assignDate: assignation.assignDate,
        notes: assignation.notes,
      });
    });
    
    return Object.values(grouped).sort((a, b) => 
      (a.instructorName || '').localeCompare(b.instructorName || '')
    );
  };

  const fetchAllAssignations = async () => {
    try {
      setLoading(true);
      const response = await instructorAssignationService.getAllAssignations();
      
      if (response.success) {
        setAssignations(response.data || []);
        message.success('Instructor assignations loaded successfully');
      } else {
        message.error(response.message || 'Failed to load instructor assignations');
      }
    } catch (error) {
      console.error('Error fetching instructor assignations:', error);
      message.error(
        error.response?.data?.message || 
        'Failed to fetch instructor assignations. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchInstructors = async () => {
    try {
      const response = await getAllInstructors();
      if (response.success) {
        const sortedInstructors = (response.data || []).sort((a, b) => {
          const nameA = a.fullName?.toLowerCase() || '';
          const nameB = b.fullName?.toLowerCase() || '';
          return nameA.localeCompare(nameB);
        });
        setInstructors(sortedInstructors);
      }
    } catch (error) {
      console.error('Error fetching instructors:', error);
      message.error('Failed to fetch instructors');
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

  const handleCreate = () => {
    if (!canEdit) {
      message.warning('Only Education Officers can create instructor assignations');
      return;
    }
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleDelete = async (subjectId, instructorId) => {
    if (!canEdit) {
      message.warning('Only Education Officers can delete instructor assignations');
      return;
    }

    Modal.confirm({
      title: 'Are you sure you want to delete this assignation?',
      content: 'This action cannot be undone.',
      okText: 'Yes, Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          const response = await instructorAssignationService.deleteAssignation(subjectId, instructorId);
          if (response.success) {
            message.success('Instructor assignation deleted successfully');
            fetchAllAssignations();
          } else {
            message.error(response.message || 'Failed to delete instructor assignation');
          }
        } catch (error) {
          console.error('Error deleting instructor assignation:', error);
          message.error(
            error.response?.data?.message || 
            'Failed to delete instructor assignation. Please try again.'
          );
        }
      },
    });
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      
      const assignationData = {
        subjectId: values.subjectId,
        instructorId: values.instructorId,
      };
      
      if (values.notes && values.notes.trim() !== '') {
        assignationData.notes = values.notes.trim();
      }

      const response = await instructorAssignationService.createAssignation(assignationData);
      if (response.success) {
        message.success('Instructor assignation created successfully');
        setIsModalVisible(false);
        form.resetFields();
        fetchAllAssignations();
      } else {
        message.error(response.message || 'Failed to create instructor assignation');
      }
    } catch (error) {
      if (error.errorFields) {
        message.error('Please fill in all required fields');
      } else {
        console.error('Error saving instructor assignation:', error);
        message.error(
          error.response?.data?.message || 
          'Failed to save instructor assignation. Please try again.'
        );
      }
    }
  };

  // Columns for main table (Instructors)
  const instructorColumns = [
    {
      title: 'Instructor ID',
      dataIndex: 'instructorId',
      key: 'instructorId',
      width: 150,
      render: (text) => <Tag color="green" icon={<UserOutlined />}>{text}</Tag>,
    },
    {
      title: 'Instructor Name',
      dataIndex: 'instructorName',
      key: 'instructorName',
      width: 250,
      render: (text) => <span style={{ fontWeight: 600, fontSize: '15px' }}>{text}</span>,
    },
    {
      title: 'Number of Subjects',
      dataIndex: 'subjects',
      key: 'subjectCount',
      width: 150,
      render: (subjects) => (
        <Badge 
          count={subjects.length} 
          showZero 
          style={{ backgroundColor: '#1890ff' }}
        />
      ),
    },
  ];

  // Columns for expanded table (Subjects taught by instructor)
  const subjectColumns = [
    {
      title: 'Subject ID',
      dataIndex: 'subjectId',
      key: 'subjectId',
      width: 150,
      render: (text) => <Tag color="blue" icon={<BookOutlined />}>{text}</Tag>,
    },
    {
      title: 'Subject Name',
      dataIndex: 'subjectName',
      key: 'subjectName',
      width: 250,
      render: (text) => <span style={{ fontWeight: 500 }}>{text}</span>,
    },
    {
      title: 'Assigned By',
      dataIndex: 'assignedByUserName',
      key: 'assignedByUserName',
      width: 150,
    },
    {
      title: 'Assigned Date',
      dataIndex: 'assignDate',
      key: 'assignDate',
      width: 130,
      render: (date) => date ? new Date(date).toLocaleDateString('en-GB') : 'N/A',
    },
    {
      title: 'Notes',
      dataIndex: 'notes',
      key: 'notes',
      width: 200,
      ellipsis: true,
      render: (text) => text || '-',
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 100,
      fixed: 'right',
      render: (_, record, index, { instructorId }) => (
        <Space size="small">
          {canEdit && (
            <Button
              type="link"
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record.subjectId, instructorId)}
              style={{ padding: 0 }}
            >
              Delete
            </Button>
          )}
        </Space>
      ),
    },
  ];

  // Expandable row render
  const expandedRowRender = (record) => {
    return (
      <Table
        columns={subjectColumns.map(col => ({
          ...col,
          render: (text, subRecord) => {
            if (col.key === 'actions') {
              return col.render(text, subRecord, null, { instructorId: record.instructorId });
            }
            return col.render ? col.render(text, subRecord) : text;
          }
        }))}
        dataSource={record.subjects}
        pagination={false}
        rowKey="subjectId"
        size="small"
        style={{ margin: '0 48px' }}
      />
    );
  };

  return (
    <div style={{ padding: '24px' }}>
      <Card
        title={
          <span style={{ fontSize: '20px', fontWeight: 'bold' }}>
            Instructor Assignation Management
          </span>
        }
        extra={
          <Space>
            <Tag color="blue">Total Instructors: {filteredGroupedData.length}</Tag>
            <Tag color="cyan">Total Assignations: {assignations.length}</Tag>
            {!canEdit && <Tag color="orange">View Only Mode</Tag>}
          </Space>
        }
      >
        {/* Permission Warning for Non-Education Officers */}
        {!canEdit && (
          <div style={{ 
            marginBottom: '16px', 
            padding: '12px', 
            background: '#fff7e6', 
            border: '1px solid #ffd591',
            borderRadius: '4px'
          }}>
            <span style={{ color: '#fa8c16' }}>
              ⚠️ Only Education Officers can create or delete instructor assignations.
            </span>
          </div>
        )}

        {/* Search and Actions Bar */}
        <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between' }}>
          <Input
            placeholder="Search by instructor name, ID, or subject..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 400 }}
            allowClear
          />
          <Space>
            <Button
              icon={<ReloadOutlined />}
              onClick={fetchAllAssignations}
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
                Assign Instructor
              </Button>
            )}
          </Space>
        </div>

        {/* Grouped Table by Instructor */}
        <Table
          columns={instructorColumns}
          dataSource={filteredGroupedData}
          rowKey="instructorId"
          loading={loading}
          expandable={{
            expandedRowRender,
            expandIcon: ({ expanded, onExpand, record }) =>
              expanded ? (
                <DownOutlined 
                  onClick={e => onExpand(record, e)} 
                  style={{ color: '#1890ff', cursor: 'pointer' }}
                />
              ) : (
                <DownOutlined 
                  onClick={e => onExpand(record, e)} 
                  style={{ transform: 'rotate(-90deg)', cursor: 'pointer' }}
                />
              ),
            defaultExpandAllRows: false,
          }}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} instructors`,
          }}
        />
      </Card>

      {/* Create Modal */}
      <Modal
        title="Create New Instructor Assignation"
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
          name="assignationForm"
        >
          <Form.Item
            name="instructorId"
            label="Instructor"
            rules={[{ required: true, message: 'Please select an instructor' }]}
          >
            <Select
              placeholder="Select an instructor"
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
              options={instructors.map(instructor => ({
                value: instructor.userId,
                label: `${instructor.userId} - ${instructor.fullName}`,
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
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
              options={subjects.map(subject => ({
                value: subject.subjectId,
                label: `${subject.subjectId} - ${subject.subjectName}`,
              }))}
            />
          </Form.Item>

          <Form.Item
            name="notes"
            label="Notes"
          >
            <Input.TextArea 
              rows={4} 
              placeholder="Enter notes (optional)..." 
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default InstructorAssPage;