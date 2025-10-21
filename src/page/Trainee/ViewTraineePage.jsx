import { useEffect, useState } from "react";
import { Table, Button, Tag, Dropdown, Menu, message, Spin } from "antd";
import { MoreOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router";
import { getAllTrainees } from "../../service/TraineeService";

export default function ViewCandidatePage() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTrainees = async () => {
      setLoading(true);
      try {
        const res = await getAllTrainees();
        if (res.success) {
          const formatted = res.data.map((item, index) => ({
            key: index,
            id: item.userId,
            fullName: item.fullName,
            gender: item.sex,
            email: item.email,
            address: "-",
            traineeId: item.userId,
            status: item.status,
          }));
          setCandidates(formatted);
        } else {
          message.error(res.message || "Failed to load trainees.");
        }
      } catch (err) {
        console.error(err);
        message.error("Error fetching trainees.");
      } finally {
        setLoading(false);
      }
    };
    fetchTrainees();
  }, []);

  const handleViewDetail = (id) => {
    navigate(`/trainee/${id}`);
  };

  // Table Columns
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      render: (text) => (
        <span className="text-[#6C63FF] font-medium">{text}</span>
      ),
    },
    {
      title: "Full Name",
      dataIndex: "fullName",
      key: "fullName",
      render: (text, record) => (
        <span
          onClick={() => handleViewDetail(record.id)}
          className="text-[#6C63FF] cursor-pointer hover:underline"
        >
          {text}
        </span>
      ),
    },
    {
      title: "Gender",
      dataIndex: "gender",
      key: "gender",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Trainee ID",
      dataIndex: "traineeId",
      key: "traineeId",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag
          style={{
            borderRadius: "50px",
            padding: "2px 12px",
            fontWeight: "500",
            color: "white",
            backgroundColor:
              status === "Active"
                ? "#52c41a"
                : status === "Pending"
                ? "#ff4d4f"
                : "#8c8c8c",
            border: "none",
          }}
        >
          {status}
        </Tag>
      ),
    },
    {
      title: "Action",
      key: "action",
      align: "center",
      render: (record) => {
        const menu = (
          <Menu
            items={[
              {
                key: "1",
                label: (
                  <span onClick={() => handleViewDetail(record.id)}>
                    View Details
                  </span>
                ),
              },
              { key: "2", label: "Edit Candidate" },
              { key: "3", label: "Remove Candidate" },
            ]}
          />
        );
        return (
          <Dropdown overlay={menu} trigger={["click"]} placement="bottomRight">
            <MoreOutlined className="cursor-pointer text-[#6C63FF] text-lg hover:text-[#8C82FF]" />
          </Dropdown>
        );
      },
    },
  ];

  return (
    <div className="p-8 w-full bg-white min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-[#6C63FF]">
          Import Candidate
        </h2>
        <Button
          type="primary"
          style={{
            backgroundColor: "#6C63FF",
            borderColor: "#6C63FF",
            borderRadius: "8px",
            padding: "0 24px",
            fontWeight: "500",
          }}
          onClick={() => navigate("/import-trainee")}
        >
          Import
        </Button>
      </div>

      {/* Table */}
      <div
        className="bg-[#FDFDFF] shadow-md rounded-md p-4"
        style={{ borderRadius: "10px" }}
      >
        <Spin spinning={loading}>
          <Table
            columns={columns}
            dataSource={candidates}
            pagination={false}
            bordered={false}
            rowClassName={(_, index) =>
              index % 2 === 0 ? "bg-[#F4F2FF]" : "bg-white"
            }
            scroll={{ y: 400 }}
          />
        </Spin>
      </div>
    </div>
  );
}
