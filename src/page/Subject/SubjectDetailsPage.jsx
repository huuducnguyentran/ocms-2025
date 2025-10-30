// src/page/Subject/SubjectDetailsPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
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
  Select,
} from "antd";
import {
  ArrowLeftOutlined,
  EditOutlined,
  DeleteOutlined,
  CheckOutlined,
  CloseOutlined,
  BookOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { subjectService } from "../../service/subjectServices";

const SubjectDetailsPage = () => {
  const { subjectId } = useParams();
  const navigate = useNavigate();
  const [subject, setSubject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [form] = Form.useForm();

  const userRole = sessionStorage.getItem("role");
  const canEdit =
    userRole === "Education Officer" || userRole === "Administrator";

  useEffect(() => {
    fetchSubjectDetails();
  }, [subjectId]);

  const fetchSubjectDetails = async () => {
    try {
      setLoading(true);
      const response = await subjectService.getSubjectById(subjectId);

      if (response.success) {
        setSubject(response.data);
      } else {
        message.error(response.message || "Failed to load subject details");
        navigate("/subject");
      }
    } catch (error) {
      console.error("Error fetching subject details:", error);
      message.error(
        error.response?.data?.message ||
          "Failed to fetch subject details. Please try again."
      );
      navigate("/subject");
    } finally {
      setLoading(false);
    }
  };

  const getStatusTag = (status) => {
    const statusConfig = {
      Approved: { color: "green", icon: <CheckOutlined /> },
      Pending: { color: "orange", icon: <CloseOutlined /> },
      Rejected: { color: "red", icon: <CloseOutlined /> },
      Active: { color: "blue", icon: <CheckOutlined /> },
    };

    const config = statusConfig[status] || { color: "default" };
    return (
      <Tag color={config.color} icon={config.icon}>
        {status}
      </Tag>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleBack = () => {
    navigate("/subject");
  };

  const handleEdit = () => {
    if (!canEdit) {
      message.warning("You do not have permission to edit subjects");
      return;
    }

    // Load current subject data into form - KHÔNG load status
    form.setFieldsValue({
      subjectName: subject.subjectName,
      description: subject.description,
      minAttendance: subject.minAttendance,
      minPracticeExamScore: subject.minPracticeExamScore,
      minFinalExamScore: subject.minFinalExamScore,
      minTotalScore: subject.minTotalScore,
      // Bỏ status ra
    });

    setIsEditModalVisible(true);
  };

  const handleEditModalOk = async () => {
    try {
      const values = await form.validateFields();
      setEditLoading(true);

      // Build update data theo đúng Swagger API
      const updateData = {
        subjectName: values.subjectName,
        description: values.description,
      };

      // Add optional numeric fields only if they have values
      if (
        values.minAttendance !== undefined &&
        values.minAttendance !== null &&
        values.minAttendance !== ""
      ) {
        updateData.minAttendance = parseInt(values.minAttendance);
      }

      if (
        values.minPracticeExamScore !== undefined &&
        values.minPracticeExamScore !== null &&
        values.minPracticeExamScore !== ""
      ) {
        updateData.minPracticeExamScore = parseFloat(
          values.minPracticeExamScore
        );
      }

      if (
        values.minFinalExamScore !== undefined &&
        values.minFinalExamScore !== null &&
        values.minFinalExamScore !== ""
      ) {
        updateData.minFinalExamScore = parseFloat(values.minFinalExamScore);
      }

      if (
        values.minTotalScore !== undefined &&
        values.minTotalScore !== null &&
        values.minTotalScore !== ""
      ) {
        updateData.minTotalScore = parseFloat(values.minTotalScore);
      }

      console.log("Updating subject with data:", updateData); // Debug log

      const response = await subjectService.updateSubject(
        subjectId,
        updateData
      );

      if (response.success) {
        message.success("Subject updated successfully");
        setIsEditModalVisible(false);
        form.resetFields();
        fetchSubjectDetails();
      } else {
        message.error(response.message || "Failed to update subject");
      }
    } catch (error) {
      if (error.errorFields) {
        message.error("Please fill in all required fields");
      } else {
        console.error("Error updating subject:", error);
        console.error("Error response:", error.response?.data); // Debug log
        message.error(
          error.response?.data?.message ||
            "Failed to update subject. Please try again."
        );
      }
    } finally {
      setEditLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!canEdit) {
      message.warning("You do not have permission to delete subjects");
      return;
    }

    Modal.confirm({
      title: "Delete Subject",
      icon: <ExclamationCircleOutlined />,
      content: (
        <div>
          <p>Are you sure you want to delete this subject?</p>
          <p style={{ fontWeight: 500, color: "#ff4d4f" }}>
            Subject ID: {subject.subjectId}
          </p>
          <p style={{ fontWeight: 500 }}>Subject Name: {subject.subjectName}</p>
          <p style={{ marginTop: "12px", color: "#666" }}>
            This action cannot be undone.
          </p>
        </div>
      ),
      okText: "Yes, Delete",
      okType: "danger",
      cancelText: "Cancel",
      width: 500,
      onOk: async () => {
        try {
          const response = await subjectService.deleteSubject(subjectId);

          if (response.success) {
            message.success("Subject deleted successfully");
            // Navigate back to subject list after deletion
            setTimeout(() => {
              navigate("/subject");
            }, 1000);
          } else {
            message.error(response.message || "Failed to delete subject");
          }
        } catch (error) {
          console.error("Error deleting subject:", error);
          message.error(
            error.response?.data?.message ||
              "Failed to delete subject. Please try again."
          );
        }
      },
    });
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "400px",
        }}
      >
        <Spin size="large" tip="Loading subject details..." />
      </div>
    );
  }

  if (!subject) {
    return (
      <div style={{ padding: "24px", textAlign: "center" }}>
        <p>Subject not found</p>
        <Button type="primary" onClick={handleBack}>
          Back to Subjects
        </Button>
      </div>
    );
  }

  return (
    <div style={{ padding: "24px" }}>
      <Card
        title={
          <Space>
            <BookOutlined style={{ fontSize: "24px", color: "#1890ff" }} />
            <span style={{ fontSize: "20px", fontWeight: "bold" }}>
              Subject Details
            </span>
          </Space>
        }
        extra={
          <Space>
            <Button icon={<ArrowLeftOutlined />} onClick={handleBack}>
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
                <Button danger icon={<DeleteOutlined />} onClick={handleDelete}>
                  Delete
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
          labelStyle={{ fontWeight: 500, width: "200px" }}
        >
          <Descriptions.Item label="Subject ID" span={2}>
            <Tag
              color="blue"
              icon={<BookOutlined />}
              style={{ fontSize: "14px" }}
            >
              {subject.subjectId}
            </Tag>
          </Descriptions.Item>

          <Descriptions.Item label="Subject Name" span={2}>
            <span style={{ fontSize: "16px", fontWeight: 500 }}>
              {subject.subjectName}
            </span>
          </Descriptions.Item>

          <Descriptions.Item label="Description" span={2}>
            {subject.description || "N/A"}
          </Descriptions.Item>

          <Descriptions.Item label="Status" span={2}>
            {getStatusTag(subject.status)}
          </Descriptions.Item>
        </Descriptions>

        <Divider />

        {/* Score Requirements */}
        <Descriptions
          title="Score Requirements"
          bordered
          column={2}
          labelStyle={{ fontWeight: 500, width: "200px" }}
          style={{ marginTop: "24px" }}
        >
          <Descriptions.Item label="Minimum Attendance">
            {subject.minAttendance !== null &&
            subject.minAttendance !== undefined ? (
              <Tag color="cyan">{subject.minAttendance}%</Tag>
            ) : (
              <span style={{ color: "#999" }}>Not specified</span>
            )}
          </Descriptions.Item>

          <Descriptions.Item label="Min Practice Exam Score">
            {subject.minPracticeExamScore !== null &&
            subject.minPracticeExamScore !== undefined ? (
              <Tag color="orange">{subject.minPracticeExamScore}</Tag>
            ) : (
              <span style={{ color: "#999" }}>Not specified</span>
            )}
          </Descriptions.Item>

          <Descriptions.Item label="Min Final Exam Score">
            {subject.minFinalExamScore !== null &&
            subject.minFinalExamScore !== undefined ? (
              <Tag color="red">{subject.minFinalExamScore}</Tag>
            ) : (
              <span style={{ color: "#999" }}>Not specified</span>
            )}
          </Descriptions.Item>

          <Descriptions.Item label="Min Total Score">
            {subject.minTotalScore !== null &&
            subject.minTotalScore !== undefined ? (
              <Tag color="purple">{subject.minTotalScore}</Tag>
            ) : (
              <span style={{ color: "#999" }}>Not specified</span>
            )}
          </Descriptions.Item>
        </Descriptions>

        <Divider />

        {/* System Information */}
        <Descriptions
          title="System Information"
          bordered
          column={2}
          labelStyle={{ fontWeight: 500, width: "200px" }}
          style={{ marginTop: "24px" }}
        >
          <Descriptions.Item label="Created By">
            {subject.createdByUserName || "N/A"}
          </Descriptions.Item>

          <Descriptions.Item label="Created At">
            {formatDate(subject.createdAt)}
          </Descriptions.Item>

          <Descriptions.Item label="Updated By">
            {subject.updatedByUserName || "N/A"}
          </Descriptions.Item>

          <Descriptions.Item label="Updated At">
            {formatDate(subject.updatedAt)}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {/* Edit Modal */}
      <Modal
        title="Edit Subject"
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
        <Form form={form} layout="vertical" name="editSubjectForm">
          <Form.Item
            name="subjectName"
            label="Subject Name"
            rules={[{ required: true, message: "Please enter subject name" }]}
          >
            <Input placeholder="e.g., Civil Air Law and Regulations" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: "Please enter description" }]}
          >
            <Input.TextArea
              rows={4}
              placeholder="Enter subject description..."
            />
          </Form.Item>

          {/* Optional Score Fields */}
          <div
            style={{
              padding: "16px",
              background: "#f5f5f5",
              borderRadius: "8px",
              marginBottom: "16px",
            }}
          >
            <p style={{ fontWeight: 500, marginBottom: "12px", color: "#666" }}>
              Score Requirements (Optional)
            </p>

            <Form.Item name="minAttendance" label="Minimum Attendance (%)">
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
            >
              <Input
                type="number"
                placeholder="e.g., 5"
                min={0}
                max={10}
                step={0.5}
              />
            </Form.Item>

            <Form.Item name="minTotalScore" label="Minimum Total Score">
              <Input
                type="number"
                placeholder="e.g., 6"
                min={0}
                max={10}
                step={0.5}
              />
            </Form.Item>
          </div>

          {/* BỎ Status field */}
        </Form>
      </Modal>
    </div>
  );
};

export default SubjectDetailsPage;
