import React from "react";
import { Table, Button, Tag, Dropdown, Menu } from "antd";
import { MoreOutlined } from "@ant-design/icons";

export default function ViewCandidatePage() {
  const candidates = Array(10).fill({
    id: "CND-001",
    fullName: "Nguyen Van A",
    gender: "Male",
    email: "a@example.com",
    address: "Hanoi, Vietnam",
    traineeId: "TRN-001",
    status: "Active",
  });

  // Dropdown Menu options
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
      render: (text) => <span className="text-[#6C63FF] font-medium">{text}</span>,
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
      render: (status) => (
        <Tag
          color="#6C63FF"
          style={{
            borderRadius: "50px",
            padding: "2px 12px",
            color: "white",
            fontWeight: "500",
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
      render: () => (
        <Dropdown overlay={menu} trigger={["click"]} placement="bottomRight">
          <MoreOutlined
            className="cursor-pointer text-[#6C63FF] text-lg hover:text-[#8C82FF]"
          />
        </Dropdown>
      ),
    },
  ];

  return (
    <div className="p-8 bg-white min-h-screen">
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
        style={{
          borderRadius: "10px",
        }}
      >
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
