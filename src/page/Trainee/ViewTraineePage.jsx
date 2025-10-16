import { useEffect, useState } from "react";
import { Table, Button, Tag, Dropdown, Menu, message, Spin } from "antd";
import { MoreOutlined } from "@ant-design/icons";
import { getAllTrainees } from "../../service/TraineeService";

export default function ViewCandidatePage() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch trainees on mount
  useEffect(() => {
    const fetchTrainees = async () => {
      setLoading(true);
      try {
        const res = await getAllTrainees();
        if (res.success) {
          // Map API response to table structure
          const formatted = res.data.map((item, index) => ({
            key: index,
            id: item.userId,
            fullName: item.fullName,
            gender: item.sex,
            email: item.email,
            address: "-", // API doesn’t include address
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

  // Dropdown Menu
  const menu = (
    <Menu
      items={[
        { key: "1", label: "View Details" },
        { key: "2", label: "Edit Candidate" },
        { key: "3", label: "Remove Candidate" },
      ]}
    />
  );

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
      render: (status) => {
        let color = "";
        switch (status) {
          case "Active":
            color = "green";
            break;
          case "Pending":
            color = "red";
            break;
          case "Deactivated":
          case "Inactivated":
            color = "gray";
            break;
          default:
            color = "#6C63FF";
        }
        return (
          <Tag
            style={{
              borderRadius: "50px",
              padding: "2px 12px",
              fontWeight: "500",
              color: "white",
              backgroundColor:
                status === "Active"
                  ? "#52c41a" // Solid green
                  : status === "Pending"
                  ? "#ff4d4f" // Solid red
                  : "#8c8c8c", // Solid gray
              border: "none",
            }}
          >
            {status}
          </Tag>
        );
      },
    },
    {
      title: "Action",
      key: "action",
      align: "center",
      render: () => (
        <Dropdown overlay={menu} trigger={["click"]} placement="bottomRight">
          <MoreOutlined className="cursor-pointer text-[#6C63FF] text-lg hover:text-[#8C82FF]" />
        </Dropdown>
      ),
    },
  ];

  return (
    <div className="p-8 w-full bg-white min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-[#6C63FF]">
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

      {/* Custom Scrollbar */}
      <style>
        {`
          ::-webkit-scrollbar {
            width: 8px;
            height: 8px;
          }
          ::-webkit-scrollbar-thumb {
            background-color: #6C63FF;
            border-radius: 4px;
          }
          ::-webkit-scrollbar-thumb:hover {
            background-color: #8C82FF;
          }
          ::-webkit-scrollbar-track {
            background-color: #EDEBFF;
          }

          .ant-table-thead > tr > th {
            background-color: #F4F2FF !important;
            color: #3E2F96 !important;
            font-weight: 600;
          }

          .ant-table-cell {
            padding: 12px 16px !important;
          }
        `}
      </style>
    </div>
  );
}
