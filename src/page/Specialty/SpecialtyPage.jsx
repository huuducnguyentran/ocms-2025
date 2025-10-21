// src/page/Specialty/SpecialtyPage.jsx
import React, { useEffect, useState } from 'react';
import { Table, Card, message, Button, Space, Input, Modal, Form, Tag } from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  SearchOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import { specialtyService } from '../../service/specialtyServices';

const SpecialtyPage = () => {
  const [specialties, setSpecialties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [filteredSpecialties, setFilteredSpecialties] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingSpecialty, setEditingSpecialty] = useState(null);
  const [form] = Form.useForm();

  const userRole = sessionStorage.getItem('role');
  const canEdit = userRole === 'Education Officer' || userRole === 'Administrator';

  useEffect(() => {
    fetchAllSpecialties();
  }, []);

  useEffect(() => {
    // Filter specialties based on search text
    if (searchText.trim() === '') {
      setFilteredSpecialties(specialties);
    } else {
      const filtered = specialties.filter(specialty => 
        specialty.specialtyId?.toLowerCase().includes(searchText.toLowerCase()) ||
        specialty.specialtyName?.toLowerCase().includes(searchText.toLowerCase()) ||
        specialty.description?.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredSpecialties(filtered);
    }
  }, [searchText, specialties]);

  const fetchAllSpecialties = async () => {
    try {
      setLoading(true);
      const response = await specialtyService.getAllSpecialties();
      
      if (response.success) {
        setSpecialties(response.data || []);
        setFilteredSpecialties(response.data || []);
        message.success('Specialties loaded successfully');
      } else {
        message.error(response.message || 'Failed to load specialties');
      }
    } catch (error) {
      console.error('Error fetching specialties:', error);
      message.error(
        error.response?.data?.message || 
        'Failed to fetch specialties. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    if (!canEdit) {
      message.warning('You do not have permission to create specialties');
      return;
    }
    setEditingSpecialty(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (record) => {
    if (!canEdit) {
      message.warning('You do not have permission to edit specialties');
      return;
    }
    setEditingSpecialty(record);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleDelete = async (specialtyId) => {
    if (!canEdit) {
      message.warning('You do not have permission to delete specialties');
      return;
    }

    Modal.confirm({
      title: 'Are you sure you want to delete this specialty?',
      content: 'This action cannot be undone.',
      okText: 'Yes, Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          const response = await specialtyService.deleteSpecialty(specialtyId);
          if (response.success) {
            message.success('Specialty deleted successfully');
            fetchAllSpecialties();
          } else {
            message.error(response.message || 'Failed to delete specialty');
          }
        } catch (error) {
          console.error('Error deleting specialty:', error);
          message.error(
            error.response?.data?.message || 
            'Failed to delete specialty. Please try again.'
          );
        }
      },
    });
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      
      if (editingSpecialty) {
        // Update existing specialty
        const response = await specialtyService.updateSpecialty(
          editingSpecialty.specialtyId,
          values
        );
        if (response.success) {
          message.success('Specialty updated successfully');
          setIsModalVisible(false);
          fetchAllSpecialties();
        } else {
          message.error(response.message || 'Failed to update specialty');
        }
      } else {
        // Create new specialty
        const response = await specialtyService.createSpecialty(values);
        if (response.success) {
          message.success('Specialty created successfully');
          setIsModalVisible(false);
          fetchAllSpecialties();
        } else {
          message.error(response.message || 'Failed to create specialty');
        }
      }
    } catch (error) {
      if (error.errorFields) {
        message.error('Please fill in all required fields');
      } else {
        console.error('Error saving specialty:', error);
        message.error(
          error.response?.data?.message || 
          'Failed to save specialty. Please try again.'
        );
      }
    }
  };

  const columns = [
    {
      title: 'Specialty ID',
      dataIndex: 'specialtyId',
      key: 'specialtyId',
      width: 150,
      render: (text) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: 'Specialty Name',
      dataIndex: 'specialtyName',
      key: 'specialtyName',
      width: 200,
      render: (text) => <span style={{ fontWeight: 500 }}>{text}</span>,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
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
      width: 120,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          {canEdit && (
            <>
              <Button
                type="link"
                icon={<EditOutlined />}
                onClick={() => handleEdit(record)}
                style={{ padding: 0 }}
              >
                Edit
              </Button>
              <Button
                type="link"
                danger
                icon={<DeleteOutlined />}
                onClick={() => handleDelete(record.specialtyId)}
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

  return (
    <div style={{ padding: '24px' }}>
      <Card
        title={
          <span style={{ fontSize: '20px', fontWeight: 'bold' }}>
            Specialty Management
          </span>
        }
        extra={
          <Space>
            <Tag color="blue">Total: {filteredSpecialties.length}</Tag>
          </Space>
        }
      >
        {/* Search and Actions Bar */}
        <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between' }}>
          <Input
            placeholder="Search by ID, name or description..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 300 }}
            allowClear
          />
          <Space>
            <Button
              icon={<ReloadOutlined />}
              onClick={fetchAllSpecialties}
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
                Add Specialty
              </Button>
            )}
          </Space>
        </div>

        {/* Table */}
        <Table
          columns={columns}
          dataSource={filteredSpecialties}
          rowKey="specialtyId"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} specialties`,
          }}
          scroll={{ x: 800 }}
        />
      </Card>

      {/* Create/Edit Modal */}
      <Modal
        title={editingSpecialty ? 'Edit Specialty' : 'Create New Specialty'}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
        okText={editingSpecialty ? 'Update' : 'Create'}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          name="specialtyForm"
        >
          <Form.Item
            name="specialtyId"
            label="Specialty ID"
            rules={[{ required: true, message: 'Please enter specialty ID' }]}
          >
            <Input 
              placeholder="e.g., SPL-CC" 
              disabled={!!editingSpecialty}
            />
          </Form.Item>

          <Form.Item
            name="specialtyName"
            label="Specialty Name"
            rules={[{ required: true, message: 'Please enter specialty name' }]}
          >
            <Input placeholder="e.g., Cabin Crew" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: 'Please enter description' }]}
          >
            <Input.TextArea 
              rows={4} 
              placeholder="Enter specialty description..." 
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default SpecialtyPage;