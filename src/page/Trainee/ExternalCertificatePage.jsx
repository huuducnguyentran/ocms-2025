import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import {
  Card,
  Descriptions,
  Spin,
  Button,
  message,
  Image,
  Upload,
  Modal,
  Form,
  Input,
  DatePicker,
} from "antd";
import {
  ArrowLeftOutlined,
  UploadOutlined,
  EditOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import {
  getExternalCertificateDetailById,
  uploadExternalCertificateFile,
  updateExternalCertificate,
} from "../../service/TraineeService";

export default function ExternalCertificateDetailPage() {
  const { id } = useParams(); // externalCertificateId
  const navigate = useNavigate();
  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [form] = Form.useForm();

  // Fetch certificate details
  const fetchCertificate = async () => {
    setLoading(true);
    try {
      const res = await getExternalCertificateDetailById(id);
      if (res.success && res.data) {
        setCertificate(res.data);
      } else {
        message.warning(res.message || "Certificate not found.");
      }
    } catch (err) {
      console.error(err);
      message.error("Error fetching certificate details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCertificate();
  }, [id]);

  // Handle file upload
  const handleUpload = async (file) => {
    setUploading(true);
    try {
      const res = await uploadExternalCertificateFile(id, file);
      if (res.success) {
        message.success("Certificate file updated successfully!");
        await fetchCertificate(); // 🔄 Refresh data after upload
      } else {
        message.error(res.message || "Failed to upload certificate file.");
      }
    } catch (err) {
      console.error(err);
      message.error("Error uploading file.");
    } finally {
      setUploading(false);
    }
    return false; // Prevent AntD auto upload
  };

  // Handle update info
  const handleUpdate = async () => {
    try {
      const values = await form.validateFields();
      const payload = {
        certificateCode: values.certificateCode,
        certificateName: values.certificateName,
        issuingOrganization: values.issuingOrganization,
        issueDate: values.issueDate.toISOString(),
        exp_date: values.exp_date?.toISOString() || null,
      };

      const res = await updateExternalCertificate(id, payload);
      if (res.success) {
        message.success("Certificate info updated successfully!");
        setEditing(false);
        await fetchCertificate();
      } else {
        message.error(res.message || "Failed to update certificate info.");
      }
    } catch (err) {
      console.error(err);
      message.error("Error updating certificate info.");
    }
  };

  return (
    <div className="p-8 bg-white min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate(-1)}
          style={{
            backgroundColor: "#6C63FF",
            color: "white",
            borderRadius: "8px",
            border: "none",
          }}
        >
          Back
        </Button>
        <h2 className="text-2xl font-semibold text-[#6C63FF]">
          External Certificate Details
        </h2>
        <Button
          icon={<EditOutlined />}
          onClick={() => {
            form.setFieldsValue({
              certificateCode: certificate.certificateCode,
              certificateName: certificate.certificateName,
              issuingOrganization: certificate.issuingOrganization,
              issueDate: dayjs(certificate.issueDate),
              exp_date: certificate.exp_date
                ? dayjs(certificate.exp_date)
                : null,
            });
            setEditing(true);
          }}
          style={{
            backgroundColor: "#6C63FF",
            color: "white",
            borderRadius: "8px",
            border: "none",
          }}
        >
          Edit Info
        </Button>
      </div>

      {/* Certificate Info */}
      <Spin spinning={loading}>
        {certificate ? (
          <Card className="shadow-md rounded-md p-6">
            <Descriptions
              title={certificate.certificateName}
              bordered
              column={1}
              labelStyle={{ fontWeight: 600, width: 200 }}
            >
              <Descriptions.Item label="Certificate ID">
                {certificate.externalCertificateId}
              </Descriptions.Item>
              <Descriptions.Item label="Certificate Code">
                {certificate.certificateCode}
              </Descriptions.Item>
              <Descriptions.Item label="Certificate Name">
                {certificate.certificateName}
              </Descriptions.Item>
              <Descriptions.Item label="Issuing Organization">
                {certificate.issuingOrganization}
              </Descriptions.Item>
              <Descriptions.Item label="User ID">
                {certificate.userId}
              </Descriptions.Item>
              <Descriptions.Item label="User Name">
                {certificate.userFullName}
              </Descriptions.Item>
              <Descriptions.Item label="Issue Date">
                {new Date(certificate.issueDate).toLocaleDateString()}
              </Descriptions.Item>
              <Descriptions.Item label="Expiry Date">
                {certificate.exp_date
                  ? new Date(certificate.exp_date).toLocaleDateString()
                  : "-"}
              </Descriptions.Item>
              <Descriptions.Item label="Created At">
                {new Date(certificate.createdAt).toLocaleString()}
              </Descriptions.Item>
            </Descriptions>

            {/* Certificate Image + Upload */}
            {certificate.certificateFileUrl && (
              <div className="mt-8 text-center flex flex-col items-center">
                <h4 className="text-lg font-semibold mb-3 text-[#6C63FF]">
                  Certificate File
                </h4>
                <Image
                  src={certificate.certificateFileUrl}
                  alt="Certificate"
                  style={{
                    maxHeight: "400px",
                    borderRadius: "10px",
                    objectFit: "contain",
                    marginBottom: "20px",
                  }}
                />
                <Upload showUploadList={false} beforeUpload={handleUpload}>
                  <Button
                    icon={<UploadOutlined />}
                    loading={uploading}
                    style={{
                      backgroundColor: "#6C63FF",
                      color: "white",
                      borderRadius: "8px",
                      padding: "0 20px",
                      height: "40px",
                      fontWeight: 500,
                      boxShadow: "0 2px 6px rgba(108, 99, 255, 0.3)",
                    }}
                  >
                    {uploading ? "Uploading..." : "Upload New Certificate File"}
                  </Button>
                </Upload>
              </div>
            )}
          </Card>
        ) : (
          !loading && (
            <div className="text-center text-gray-500 text-lg">
              No certificate data found.
            </div>
          )
        )}
      </Spin>

      {/* Edit Modal */}
      <Modal
        title={
          <span className="text-xl font-semibold text-[#6C63FF]">
            Edit Certificate Information
          </span>
        }
        open={editing}
        onCancel={() => setEditing(false)}
        onOk={handleUpdate}
        okText="Save Changes"
        cancelText="Cancel"
        confirmLoading={loading}
        centered
        width={600}
        bodyStyle={{
          padding: "24px 32px",
          backgroundColor: "#fafaff",
          borderRadius: "12px",
        }}
        okButtonProps={{
          style: {
            backgroundColor: "#6C63FF",
            borderColor: "#6C63FF",
            borderRadius: "8px",
            fontWeight: 500,
            padding: "6px 18px",
          },
        }}
        cancelButtonProps={{
          style: {
            borderRadius: "8px",
            fontWeight: 500,
            padding: "6px 18px",
          },
        }}
      >
        <Form
          form={form}
          layout="vertical"
          size="middle"
          className="space-y-3"
          initialValues={certificate}
        >
          <Form.Item
            label={
              <span className="font-medium text-gray-700">
                Certificate Code
              </span>
            }
            name="certificateCode"
            rules={[
              { required: true, message: "Please enter certificate code" },
            ]}
          >
            <Input
              placeholder="Enter certificate code"
              className="rounded-md"
            />
          </Form.Item>

          <Form.Item
            label={
              <span className="font-medium text-gray-700">
                Certificate Name
              </span>
            }
            name="certificateName"
            rules={[
              { required: true, message: "Please enter certificate name" },
            ]}
          >
            <Input
              placeholder="Enter certificate name"
              className="rounded-md"
            />
          </Form.Item>

          <Form.Item
            label={
              <span className="font-medium text-gray-700">
                Issuing Organization
              </span>
            }
            name="issuingOrganization"
            rules={[
              { required: true, message: "Please enter issuing organization" },
            ]}
          >
            <Input
              placeholder="Enter issuing organization"
              className="rounded-md"
            />
          </Form.Item>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              label={
                <span className="font-medium text-gray-700">Issue Date</span>
              }
              name="issueDate"
              rules={[{ required: true, message: "Please select issue date" }]}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item
              label={
                <span className="font-medium text-gray-700">Expiry Date</span>
              }
              name="exp_date"
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </div>
  );
}
