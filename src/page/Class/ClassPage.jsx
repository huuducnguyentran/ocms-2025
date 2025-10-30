// src/page/Class/ClassPage.jsx
import React, { useEffect, useState } from 'react';
import { 
  Tabs, 
  Table, 
  Card, 
  message, 
  Button, 
  Space, 
  Input, 
  Modal, 
  Form, 
  Tag,
  DatePicker,
  Select,
  Spin,
  Empty,
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  SearchOutlined,
  ReloadOutlined,
  TeamOutlined,
  BookOutlined,
  EyeOutlined,
  UserAddOutlined,
  UsergroupAddOutlined,
  DownOutlined,
} from '@ant-design/icons';
import { classService, classGroupService, traineeAssignationService } from '../../service/classServices';
import { getAllTrainees } from '../../service/TraineeService';
import dayjs from 'dayjs';

const { TabPane } = Tabs;

const ClassPage = () => {
  // ClassGroup States
  const [classGroups, setClassGroups] = useState([]);
  const [classGroupsLoading, setClassGroupsLoading] = useState(true);
  const [classGroupSearchText, setClassGroupSearchText] = useState('');
  const [filteredClassGroups, setFilteredClassGroups] = useState([]);
  const [isClassGroupModalVisible, setIsClassGroupModalVisible] = useState(false);
  const [editingClassGroup, setEditingClassGroup] = useState(null);
  const [classGroupForm] = Form.useForm();

  // Class States
  const [classes, setClasses] = useState([]);
  const [classesLoading, setClassesLoading] = useState(true);
  const [classSearchText, setClassSearchText] = useState('');
  const [filteredClasses, setFilteredClasses] = useState([]);
  const [isClassModalVisible, setIsClassModalVisible] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [classForm] = Form.useForm();

  // ClassGroup Classes Modal
  const [selectedClassGroup, setSelectedClassGroup] = useState(null);
  const [classGroupClasses, setClassGroupClasses] = useState([]);
  const [isClassesModalVisible, setIsClassesModalVisible] = useState(false);
  const [classesModalLoading, setClassesModalLoading] = useState(false);

  // TraineeAssignation States
  const [selectedClass, setSelectedClass] = useState(null);
  const [traineeAssignations, setTraineeAssignations] = useState([]);
  const [isTraineeModalVisible, setIsTraineeModalVisible] = useState(false);
  const [traineeModalLoading, setTraineeModalLoading] = useState(false);
  const [availableTrainees, setAvailableTrainees] = useState([]);
  const [isAddTraineeModalVisible, setIsAddTraineeModalVisible] = useState(false);
  const [addTraineeForm] = Form.useForm();

  // Thêm state để lưu trainees của từng class khi expand
  const [expandedClassTrainees, setExpandedClassTrainees] = useState({});
  const [loadingTraineesForClass, setLoadingTraineesForClass] = useState({});

  const userRole = sessionStorage.getItem('role');
  const canEdit = userRole === 'Education Officer';

  useEffect(() => {
    fetchAllClassGroups();
    fetchAllClasses();
  }, []);

  // ClassGroup search filter
  useEffect(() => {
    if (classGroupSearchText.trim() === '') {
      setFilteredClassGroups(classGroups);
    } else {
      const filtered = classGroups.filter(group => 
        group.classGroupId?.toLowerCase().includes(classGroupSearchText.toLowerCase()) ||
        group.name?.toLowerCase().includes(classGroupSearchText.toLowerCase())
      );
      setFilteredClassGroups(filtered);
    }
  }, [classGroupSearchText, classGroups]);

  // Class search filter
  useEffect(() => {
    if (classSearchText.trim() === '') {
      setFilteredClasses(classes);
    } else {
      const filtered = classes.filter(cls => 
        cls.classId?.toLowerCase().includes(classSearchText.toLowerCase()) ||
        cls.subjectId?.toLowerCase().includes(classSearchText.toLowerCase()) ||
        cls.instructorName?.toLowerCase().includes(classSearchText.toLowerCase())
      );
      setFilteredClasses(filtered);
    }
  }, [classSearchText, classes]);

  // ============= ClassGroup Functions =============
  const fetchAllClassGroups = async () => {
    try {
      setClassGroupsLoading(true);
      const response = await classGroupService.getAllClassGroups();
      
      if (response.success) {
        setClassGroups(response.data || []);
        setFilteredClassGroups(response.data || []);
        message.success('Class groups loaded successfully');
      } else {
        message.error(response.message || 'Failed to load class groups');
      }
    } catch (error) {
      console.error('Error fetching class groups:', error);
      message.error('Failed to fetch class groups. Please try again.');
    } finally {
      setClassGroupsLoading(false);
    }
  };

  const handleCreateClassGroup = () => {
    if (!canEdit) {
      message.warning('Only Education Officers can create class groups');
      return;
    }
    setEditingClassGroup(null);
    classGroupForm.resetFields();
    setIsClassGroupModalVisible(true);
  };

  const handleEditClassGroup = (record) => {
    if (!canEdit) {
      message.warning('Only Education Officers can edit class groups');
      return;
    }
    setEditingClassGroup(record);
    classGroupForm.setFieldsValue({
      name: record.name,
      start: record.start ? dayjs(record.start) : null,
      end: record.end ? dayjs(record.end) : null,
      description: record.description || '',
    });
    setIsClassGroupModalVisible(true);
  };

  const handleDeleteClassGroup = async (classGroupId) => {
    if (!canEdit) {
      message.warning('Only Education Officers can delete class groups');
      return;
    }

    Modal.confirm({
      title: 'Delete Class Group',
      content: 'Are you sure you want to delete this class group? This action cannot be undone.',
      okText: 'Yes, Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          const response = await classGroupService.deleteClassGroup(classGroupId);
          if (response.success) {
            message.success('Class group deleted successfully');
            fetchAllClassGroups();
          } else {
            message.error(response.message || 'Failed to delete class group');
          }
        } catch (error) {
          console.error('Error deleting class group:', error);
          message.error('Failed to delete class group. Please try again.');
        }
      },
    });
  };

  const handleClassGroupModalOk = async () => {
    try {
      const values = await classGroupForm.validateFields();
      
      const classGroupData = {
        name: values.name,
        start: values.start ? values.start.format('YYYY-MM-DDTHH:mm:ss.SSS[Z]') : null,
        end: values.end ? values.end.format('YYYY-MM-DDTHH:mm:ss.SSS[Z]') : null,
        description: values.description || '',
      };

      if (editingClassGroup) {
        // Update
        const response = await classGroupService.updateClassGroup(
          editingClassGroup.classGroupId,
          classGroupData
        );
        if (response.success) {
          message.success('Class group updated successfully');
          setIsClassGroupModalVisible(false);
          fetchAllClassGroups();
        } else {
          message.error(response.message || 'Failed to update class group');
        }
      } else {
        // Create
        const response = await classGroupService.createClassGroup(classGroupData);
        if (response.success) {
          message.success('Class group created successfully');
          setIsClassGroupModalVisible(false);
          fetchAllClassGroups();
        } else {
          message.error(response.message || 'Failed to create class group');
        }
      }
    } catch (error) {
      if (error.errorFields) {
        message.error('Please fill in all required fields');
      } else {
        console.error('Error saving class group:', error);
        message.error('Failed to save class group. Please try again.');
      }
    }
  };

  const handleViewClassGroupClasses = async (record) => {
    setSelectedClassGroup(record);
    setIsClassesModalVisible(true);
    setClassesModalLoading(true);
    
    try {
      const response = await classGroupService.getClassGroupClasses(record.classGroupId);
      if (response.success) {
        setClassGroupClasses(response.data || []);
      } else {
        message.error('Failed to load classes');
        setClassGroupClasses([]);
      }
    } catch (error) {
      console.error('Error fetching class group classes:', error);
      setClassGroupClasses([]);
    } finally {
      setClassesModalLoading(false);
    }
  };

  // ============= Class Functions =============
  const fetchAllClasses = async () => {
    try {
      setClassesLoading(true);
      const response = await classService.getAllClasses();
      
      if (response.success) {
        setClasses(response.data || []);
        setFilteredClasses(response.data || []);
        message.success('Classes loaded successfully');
      } else {
        message.error(response.message || 'Failed to load classes');
      }
    } catch (error) {
      console.error('Error fetching classes:', error);
      message.error('Failed to fetch classes. Please try again.');
    } finally {
      setClassesLoading(false);
    }
  };

  const handleCreateClass = () => {
    if (!canEdit) {
      message.warning('Only Education Officers can create classes');
      return;
    }
    setEditingClass(null);
    classForm.resetFields();
    setIsClassModalVisible(true);
  };

  const handleEditClass = (record) => {
    if (!canEdit) {
      message.warning('Only Education Officers can edit classes');
      return;
    }
    setEditingClass(record);
    classForm.setFieldsValue({
      subjectId: record.subjectId,
      instructorId: record.instructorId,
      classGroupId: record.classGroupId,
    });
    setIsClassModalVisible(true);
  };

  const handleDeleteClass = async (classId) => {
    if (!canEdit) {
      message.warning('Only Education Officers can delete classes');
      return;
    }

    Modal.confirm({
      title: 'Delete Class',
      content: 'Are you sure you want to delete this class? This action cannot be undone.',
      okText: 'Yes, Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          const response = await classService.deleteClass(classId);
          if (response.success) {
            message.success('Class deleted successfully');
            fetchAllClasses();
          } else {
            message.error(response.message || 'Failed to delete class');
          }
        } catch (error) {
          console.error('Error deleting class:', error);
          message.error('Failed to delete class. Please try again.');
        }
      },
    });
  };

  const handleClassModalOk = async () => {
    try {
      const values = await classForm.validateFields();
      
      const classData = {
        instructorId: values.instructorId,
        classGroupId: values.classGroupId ? parseInt(values.classGroupId) : 0,
        subjectId: values.subjectId,
      };

      if (editingClass) {
        // Update
        const response = await classService.updateClass(editingClass.classId, classData);
        if (response.success) {
          message.success('Class updated successfully');
          setIsClassModalVisible(false);
          fetchAllClasses();
        } else {
          message.error(response.message || 'Failed to update class');
        }
      } else {
        // Create
        const response = await classService.createClass(classData);
        if (response.success) {
          message.success('Class created successfully');
          setIsClassModalVisible(false);
          fetchAllClasses();
        } else {
          message.error(response.message || 'Failed to create class');
        }
      }
    } catch (error) {
      if (error.errorFields) {
        message.error('Please fill in all required fields');
      } else {
        console.error('Error saving class:', error);
        message.error('Failed to save class. Please try again.');
      }
    }
  };

  // ============= TraineeAssignation Functions =============
  
  // View trainees assigned to a class
  const handleViewClassTrainees = async (classRecord) => {
    setSelectedClass(classRecord);
    setIsTraineeModalVisible(true);
    setTraineeModalLoading(true);
    
    try {
      const response = await traineeAssignationService.getByClassId(classRecord.classId);
      if (response.success) {
        setTraineeAssignations(response.data || []);
      } else {
        message.error('Failed to load trainees');
        setTraineeAssignations([]);
      }
    } catch (error) {
      console.error('Error fetching trainee assignations:', error);
      message.error('Failed to fetch trainees');
      setTraineeAssignations([]);
    } finally {
      setTraineeModalLoading(false);
    }
  };

  // Open modal to add trainee to class
  const handleAddTraineeToClass = async (classRecord) => {
    if (!canEdit) {
      message.warning('Only Education Officers can assign trainees');
      return;
    }

    setSelectedClass(classRecord);
    setIsAddTraineeModalVisible(true);
    
    try {
      // Fetch all available trainees
      const response = await getAllTrainees();
      if (response.success) {
        setAvailableTrainees(response.data || []);
      } else {
        message.error('Failed to load trainees');
      }
    } catch (error) {
      console.error('Error fetching trainees:', error);
      message.error('Failed to fetch trainees');
    }
  };

  // Submit new trainee assignation
  const handleAddTraineeModalOk = async () => {
    try {
      const values = await addTraineeForm.validateFields();
      
      const assignationData = {
        traineeId: values.traineeId,
        classId: selectedClass.classId,
      };

      const response = await traineeAssignationService.createAssignation(assignationData);
      if (response.success) {
        message.success('Trainee assigned to class successfully');
        setIsAddTraineeModalVisible(false);
        addTraineeForm.resetFields();
        
        // Refresh trainee list if the trainee modal is open
        if (isTraineeModalVisible) {
          handleViewClassTrainees(selectedClass);
        }
      } else {
        message.error(response.message || 'Failed to assign trainee');
      }
    } catch (error) {
      if (error.errorFields) {
        message.error('Please select a trainee');
      } else {
        console.error('Error assigning trainee:', error);
        message.error('Failed to assign trainee. Please try again.');
      }
    }
  };

  // Delete trainee assignation
  const handleDeleteTraineeAssignation = async (assignationId) => {
    if (!canEdit) {
      message.warning('Only Education Officers can remove trainees');
      return;
    }

    Modal.confirm({
      title: 'Remove Trainee from Class',
      content: 'Are you sure you want to remove this trainee from the class?',
      okText: 'Yes, Remove',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          const response = await traineeAssignationService.deleteAssignation(assignationId);
          if (response.success) {
            message.success('Trainee removed from class successfully');
            // Refresh the trainee list
            handleViewClassTrainees(selectedClass);
          } else {
            message.error(response.message || 'Failed to remove trainee');
          }
        } catch (error) {
          console.error('Error removing trainee:', error);
          message.error('Failed to remove trainee. Please try again.');
        }
      },
    });
  };

  // ============= Function để load trainees khi expand một Class =============
  const handleExpandClass = async (expanded, classRecord) => {
    if (expanded && !expandedClassTrainees[classRecord.classId]) {
      // Set loading state cho class này
      setLoadingTraineesForClass(prev => ({ ...prev, [classRecord.classId]: true }));
      
      try {
        const response = await traineeAssignationService.getByClassId(classRecord.classId);
        if (response.success) {
          setExpandedClassTrainees(prev => ({
            ...prev,
            [classRecord.classId]: response.data || []
          }));
        } else {
          message.error(`Failed to load trainees for class ${classRecord.classId}`);
          setExpandedClassTrainees(prev => ({
            ...prev,
            [classRecord.classId]: []
          }));
        }
      } catch (error) {
        console.error('Error fetching trainees:', error);
        setExpandedClassTrainees(prev => ({
          ...prev,
          [classRecord.classId]: []
        }));
      } finally {
        setLoadingTraineesForClass(prev => ({ ...prev, [classRecord.classId]: false }));
      }
    }
  };

  // Function để xóa trainee từ nested table
  const handleDeleteTraineeFromExpanded = async (assignationId, classId) => {
    if (!canEdit) {
      message.warning('Only Education Officers can remove trainees');
      return;
    }

    Modal.confirm({
      title: 'Remove Trainee from Class',
      content: 'Are you sure you want to remove this trainee from the class?',
      okText: 'Yes, Remove',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          const response = await traineeAssignationService.deleteAssignation(assignationId);
          if (response.success) {
            message.success('Trainee removed successfully');
            // Refresh trainees cho class này
            const refreshResponse = await traineeAssignationService.getByClassId(classId);
            if (refreshResponse.success) {
              setExpandedClassTrainees(prev => ({
                ...prev,
                [classId]: refreshResponse.data || []
              }));
            }
          } else {
            message.error(response.message || 'Failed to remove trainee');
          }
        } catch (error) {
          console.error('Error removing trainee:', error);
          message.error('Failed to remove trainee. Please try again.');
        }
      },
    });
  };

  // ============= Table Columns =============
  const classGroupColumns = [
    {
      title: 'Class Group ID',
      dataIndex: 'classGroupId',
      key: 'classGroupId',
      width: 150,
      render: (text) => <Tag color="purple" icon={<TeamOutlined />}>{text}</Tag>,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width: 250,
      render: (text) => <span style={{ fontWeight: 500 }}>{text}</span>,
    },
    {
      title: 'Start Date',
      dataIndex: 'start',
      key: 'start',
      width: 130,
      render: (date) => date ? new Date(date).toLocaleDateString('en-GB') : 'N/A',
    },
    {
      title: 'End Date',
      dataIndex: 'end',
      key: 'end',
      width: 130,
      render: (date) => date ? new Date(date).toLocaleDateString('en-GB') : 'N/A',
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 150,
      render: (date) => date ? new Date(date).toLocaleDateString('en-GB') : 'N/A',
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 200,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => handleViewClassGroupClasses(record)}
            style={{ padding: 0 }}
          >
            View Classes
          </Button>
          {canEdit && (
            <>
              <Button
                type="link"
                icon={<EditOutlined />}
                onClick={() => handleEditClassGroup(record)}
                style={{ padding: 0 }}
              >
                Edit
              </Button>
              <Button
                type="link"
                danger
                icon={<DeleteOutlined />}
                onClick={() => handleDeleteClassGroup(record.classGroupId)}
                style={{ padding: 0 }}
              >
                Delete
              </Button>
            </>
          )}
        </Space>
      ),
    },
  ];

  const classColumns = [
    {
      title: 'Class ID',
      dataIndex: 'classId',
      key: 'classId',
      width: 120,
      render: (text) => <Tag color="blue" icon={<BookOutlined />}>{text}</Tag>,
    },
    {
      title: 'Subject ID',
      dataIndex: 'subjectId',
      key: 'subjectId',
      width: 130,
    },
    {
      title: 'Instructor ID',
      dataIndex: 'instructorId',
      key: 'instructorId',
      width: 130,
    },
    {
      title: 'Instructor Name',
      dataIndex: 'instructorName',
      key: 'instructorName',
      width: 180,
      render: (text) => <span style={{ fontWeight: 500 }}>{text}</span>,
    },
    {
      title: 'Class Group ID',
      dataIndex: 'classGroupId',
      key: 'classGroupId',
      width: 150,
      render: (text) => text ? <Tag color="purple">{text}</Tag> : '-',
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 150,
      render: (date) => date ? new Date(date).toLocaleDateString('en-GB') : 'N/A',
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 250,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            icon={<UsergroupAddOutlined />}
            onClick={() => handleViewClassTrainees(record)}
            style={{ padding: 0 }}
          >
            View Trainees
          </Button>
          {canEdit && (
            <>
              <Button
                type="link"
                icon={<UserAddOutlined />}
                onClick={() => handleAddTraineeToClass(record)}
                style={{ padding: 0 }}
              >
                Add Trainee
              </Button>
              <Button
                type="link"
                icon={<EditOutlined />}
                onClick={() => handleEditClass(record)}
                style={{ padding: 0 }}
              >
                Edit
              </Button>
              <Button
                type="link"
                danger
                icon={<DeleteOutlined />}
                onClick={() => handleDeleteClass(record.classId)}
                style={{ padding: 0 }}
              >
                Delete
              </Button>
            </>
          )}
        </Space>
      ),
    },
  ];

  // Trainee Assignation Table Columns
  const traineeAssignationColumns = [
    {
      title: 'Assignation ID',
      dataIndex: 'id',
      key: 'id',
      width: 120,
    },
    {
      title: 'Trainee ID',
      dataIndex: 'traineeId',
      key: 'traineeId',
      width: 150,
    },
    {
      title: 'Trainee Name',
      dataIndex: 'traineeName',
      key: 'traineeName',
      width: 200,
      render: (text) => <span style={{ fontWeight: 500 }}>{text || 'N/A'}</span>,
    },
    {
      title: 'Assigned Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 150,
      render: (date) => date ? new Date(date).toLocaleDateString('en-GB') : 'N/A',
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      render: (_, record) => (
        canEdit && (
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteTraineeAssignation(record.id)}
            style={{ padding: 0 }}
          >
            Remove
          </Button>
        )
      ),
    },
  ];

  // Nested Trainee Table Component
  const expandedRowRender = (classRecord) => {
    const trainees = expandedClassTrainees[classRecord.classId] || [];
    const isLoading = loadingTraineesForClass[classRecord.classId];

    const nestedTraineeColumns = [
      {
        title: 'Trainee ID',
        dataIndex: 'traineeId',
        key: 'traineeId',
        width: 150,
      },
      {
        title: 'Trainee Name',
        dataIndex: 'traineeName',
        key: 'traineeName',
        width: 200,
        render: (text) => <span style={{ fontWeight: 500 }}>{text || 'N/A'}</span>,
      },
      {
        title: 'Assigned Date',
        dataIndex: 'createdAt',
        key: 'createdAt',
        width: 150,
        render: (date) => date ? new Date(date).toLocaleDateString('en-GB') : 'N/A',
      },
      {
        title: 'Actions',
        key: 'actions',
        width: 120,
        render: (_, record) => (
          canEdit && (
            <Button
              type="link"
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDeleteTraineeFromExpanded(record.id, classRecord.classId)}
              style={{ padding: 0 }}
              size="small"
            >
              Remove
            </Button>
          )
        ),
      },
    ];

    if (isLoading) {
      return (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <Spin tip="Loading trainees..." />
        </div>
      );
    }

    return (
      <div style={{ padding: '0 24px 16px 48px' }}>
        <div style={{ 
          marginBottom: '12px', 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span style={{ fontWeight: 500, color: '#1890ff' }}>
            📋 Trainees in this class ({trainees.length})
          </span>
          {canEdit && (
            <Button
              type="primary"
              size="small"
              icon={<UserAddOutlined />}
              onClick={() => handleAddTraineeToClass(classRecord)}
            >
              Add Trainee
            </Button>
          )}
        </div>
        <Table
          columns={nestedTraineeColumns}
          dataSource={trainees}
          rowKey="id"
          pagination={false}
          size="small"
          locale={{ emptyText: 'No trainees assigned yet' }}
        />
      </div>
    );
  };

  return (
    <div style={{ padding: '24px' }}>
      <Card
        title={
          <span style={{ fontSize: '20px', fontWeight: 'bold' }}>
            Class & Class Group Management
          </span>
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
              ⚠️ Only Education Officers can manage classes and class groups.
            </span>
          </div>
        )}

        <Tabs defaultActiveKey="classgroups" type="card">
          {/* ClassGroup Tab */}
          <TabPane 
            tab={
              <span>
                <TeamOutlined />
                Class Groups
              </span>
            } 
            key="classgroups"
          >
            <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between' }}>
              <Input
                placeholder="Search by ID or name..."
                prefix={<SearchOutlined />}
                value={classGroupSearchText}
                onChange={(e) => setClassGroupSearchText(e.target.value)}
                style={{ width: 350 }}
                allowClear
              />
              <Space>
                <Button
                  icon={<ReloadOutlined />}
                  onClick={fetchAllClassGroups}
                  loading={classGroupsLoading}
                >
                  Refresh
                </Button>
                {canEdit && (
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={handleCreateClassGroup}
                  >
                    Add Class Group
                  </Button>
                )}
              </Space>
            </div>

            <Table
              columns={classGroupColumns}
              dataSource={filteredClassGroups}
              rowKey="classGroupId"
              loading={classGroupsLoading}
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showTotal: (total) => `Total ${total} class groups`,
              }}
              scroll={{ x: 1200 }}
            />
          </TabPane>

          {/* Class Tab */}
        </Tabs>
      </Card>

      {/* ClassGroup Modal */}
      <Modal
        title={editingClassGroup ? 'Edit Class Group' : 'Create New Class Group'}
        open={isClassGroupModalVisible}
        onOk={handleClassGroupModalOk}
        onCancel={() => {
          setIsClassGroupModalVisible(false);
          classGroupForm.resetFields();
        }}
        okText={editingClassGroup ? 'Update' : 'Create'}
        width={600}
      >
        <Form
          form={classGroupForm}
          layout="vertical"
          name="classGroupForm"
        >
          <Form.Item
            name="name"
            label="Class Group Name"
            rules={[{ required: true, message: 'Please enter class group name' }]}
          >
            <Input placeholder="e.g., SE3729" />
          </Form.Item>

          <Form.Item
            name="start"
            label="Start Date"
            rules={[{ required: true, message: 'Please select start date' }]}
          >
            <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
          </Form.Item>

          <Form.Item
            name="end"
            label="End Date"
            rules={[{ required: true, message: 'Please select end date' }]}
          >
            <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
          >
            <Input.TextArea 
              rows={3} 
              placeholder="Enter class group description (optional)..." 
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* Class Modal */}
      <Modal
        title={editingClass ? 'Edit Class' : 'Create New Class'}
        open={isClassModalVisible}
        onOk={handleClassModalOk}
        onCancel={() => {
          setIsClassModalVisible(false);
          classForm.resetFields();
        }}
        okText={editingClass ? 'Update' : 'Create'}
        width={600}
      >
        <Form
          form={classForm}
          layout="vertical"
          name="classForm"
        >
          <Form.Item
            name="subjectId"
            label="Subject ID"
            rules={[{ required: true, message: 'Please enter subject ID' }]}
          >
            <Input placeholder="e.g., CAT002" />
          </Form.Item>

          <Form.Item
            name="instructorId"
            label="Instructor ID"
            rules={[{ required: true, message: 'Please enter instructor ID' }]}
          >
            <Input placeholder="e.g., USR-INST" />
          </Form.Item>

          <Form.Item
            name="classGroupId"
            label="Class Group"
            rules={[{ required: true, message: 'Please select a class group' }]}
          >
            <Select
              placeholder="Select a class group"
              showSearch
              options={classGroups.map(group => ({
                value: group.classGroupId,
                label: `${group.classGroupId} - ${group.name}`,
              }))}
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* View ClassGroup Classes Modal - WITH EXPANDABLE TRAINEES */}
      <Modal
        title={
          <span>
            <TeamOutlined style={{ marginRight: 8 }} />
            Classes in {selectedClassGroup?.name || 'Class Group'}
          </span>
        }
        open={isClassesModalVisible}
        onCancel={() => {
          setIsClassesModalVisible(false);
          // Clear expanded trainees khi đóng modal
          setExpandedClassTrainees({});
          setLoadingTraineesForClass({});
        }}
        footer={[
          <Button key="close" onClick={() => {
            setIsClassesModalVisible(false);
            setExpandedClassTrainees({});
            setLoadingTraineesForClass({});
          }}>
            Close
          </Button>,
        ]}
        width={1200}
      >
        <Table
          columns={classColumns.filter(col => col.key !== 'actions' && col.key !== 'classGroupId')}
          dataSource={classGroupClasses}
          rowKey="classId"
          loading={classesModalLoading}
          expandable={{
            expandedRowRender,
            onExpand: handleExpandClass,
            expandIcon: ({ expanded, onExpand, record }) => (
              <Button
                type="text"
                size="small"
                icon={<DownOutlined rotate={expanded ? 180 : 0} />}
                onClick={e => onExpand(record, e)}
                style={{ 
                  transition: 'all 0.3s',
                  color: '#1890ff'
                }}
              />
            ),
          }}
          pagination={{
            pageSize: 5,
            showTotal: (total) => `Total ${total} classes`,
          }}
          locale={{ emptyText: 'No classes in this group yet' }}
        />
      </Modal>

      {/* View Trainees Modal */}
      <Modal
        title={
          <span>
            <UsergroupAddOutlined style={{ marginRight: 8 }} />
            Trainees in Class {selectedClass?.classId}
          </span>
        }
        open={isTraineeModalVisible}
        onCancel={() => setIsTraineeModalVisible(false)}
        footer={[
          <Button 
            key="add" 
            type="primary" 
            icon={<UserAddOutlined />}
            onClick={() => {
              setIsTraineeModalVisible(false);
              handleAddTraineeToClass(selectedClass);
            }}
            disabled={!canEdit}
          >
            Add Trainee
          </Button>,
          <Button key="close" onClick={() => setIsTraineeModalVisible(false)}>
            Close
          </Button>,
        ]}
        width={900}
      >
        <Table
          columns={traineeAssignationColumns}
          dataSource={traineeAssignations}
          rowKey="id"
          loading={traineeModalLoading}
          pagination={{
            pageSize: 5,
            showTotal: (total) => `Total ${total} trainees`,
          }}
          locale={{ emptyText: 'No trainees assigned to this class yet' }}
        />
      </Modal>

      {/* Add Trainee to Class Modal */}
      <Modal
        title={
          <span>
            <UserAddOutlined style={{ marginRight: 8 }} />
            Assign Trainee to Class {selectedClass?.classId}
          </span>
        }
        open={isAddTraineeModalVisible}
        onOk={handleAddTraineeModalOk}
        onCancel={() => {
          setIsAddTraineeModalVisible(false);
          addTraineeForm.resetFields();
        }}
        okText="Assign"
        width={600}
      >
        <Form
          form={addTraineeForm}
          layout="vertical"
          name="addTraineeForm"
        >
          <Form.Item
            name="traineeId"
            label="Select Trainee"
            rules={[{ required: true, message: 'Please select a trainee' }]}
          >
            <Select
              placeholder="Select a trainee to assign"
              showSearch
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
              options={availableTrainees.map(trainee => ({
                value: trainee.userId,
                label: `${trainee.userId} - ${trainee.fullName}`,
              }))}
            />
          </Form.Item>
          
          <div style={{ 
            padding: '12px', 
            background: '#f0f2f5', 
            borderRadius: '4px',
            marginTop: '12px'
          }}>
            <p style={{ margin: 0, fontSize: '13px' }}>
              <strong>Class:</strong> {selectedClass?.classId}<br />
              <strong>Subject:</strong> {selectedClass?.subjectId}<br />
              <strong>Instructor:</strong> {selectedClass?.instructorName}
            </p>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default ClassPage;

