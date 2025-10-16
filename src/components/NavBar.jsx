import { Layout, Menu, Avatar, Dropdown } from "antd";
import { Link, useLocation } from "react-router";
import {
  HomeOutlined,
  BookOutlined,
  ScheduleOutlined,
  BellOutlined,
  LineChartOutlined,
  QuestionCircleOutlined,
  ImportOutlined,
  UserOutlined,
  AccountBookOutlined,
  FileExcelOutlined,
  SelectOutlined,
  FileAddOutlined,
  TeamOutlined,
  SolutionOutlined,
  FileDoneOutlined,
  IdcardOutlined,
  DeploymentUnitOutlined,
  ReadOutlined,
  FileProtectOutlined,
  MoreOutlined,
} from "@ant-design/icons";
import navItems from "../data/NavItems";

const { Sider } = Layout;

const iconMap = {
  HomeOutlined: <HomeOutlined />,
  BookOutlined: <BookOutlined />,
  ScheduleOutlined: <ScheduleOutlined />,
  BellOutlined: <BellOutlined />,
  LineChartOutlined: <LineChartOutlined />,
  QuestionCircleOutlined: <QuestionCircleOutlined />,
  ImportOutlined: <ImportOutlined />,
  UserOutlined: <UserOutlined />,
  AccountBookOutlined: <AccountBookOutlined />,
  FileExcelOutlined: <FileExcelOutlined />,
  SelectOutlined: <SelectOutlined />,
  FileAddOutlined: <FileAddOutlined />,
  TeamOutlined: <TeamOutlined />,
  SolutionOutlined: <SolutionOutlined />,
  FileDoneOutlined: <FileDoneOutlined />,
  IdcardOutlined: <IdcardOutlined />,
  DeploymentUnitOutlined: <DeploymentUnitOutlined />,
  ReadOutlined: <ReadOutlined />,
  FileProtectOutlined: <FileProtectOutlined />,
};

export default function Navbar() {
  const location = useLocation();
  const userId = sessionStorage.getItem("userId");
  const role = sessionStorage.getItem("role");

  const filteredNavItems = navItems
    .filter((item) => !item.roles || item.roles.includes(role))
    .map((item) => {
      if (item.children) {
        return {
          ...item,
          icon: iconMap[item.icon],
          children: item.children
            .filter((child) => !child.roles || child.roles.includes(role))
            .map((child) => ({
              key: child.key,
              label: <Link to={child.path}>{child.label}</Link>,
            })),
        };
      }
      return {
        ...item,
        icon: iconMap[item.icon],
        label: <Link to={item.path}>{item.label}</Link>,
      };
    });

  return (
    <Sider
      width={220}
      style={{
        backgroundColor: "#6C63FF",
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        position: "relative",
      }}
    >
      {/* Header */}
      <div
        style={{
          background: "#4B3FC2",
          color: "white",
          fontWeight: "bold",
          fontSize: "18px",
          textAlign: "center",
          padding: "16px 0",
          borderBottom: "1px solid rgba(255,255,255,0.2)",
        }}
      >
        VJ Academy
      </div>

      {/* User Info (Fixed) */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          padding: "16px",
          backgroundColor: "#5A51D3",
          borderBottom: "1px solid rgba(255,255,255,0.15)",
          flexShrink: 0,
        }}
      >
        <Avatar
          src="https://i.pravatar.cc/40?img=3"
          size={40}
          alt="User"
          style={{ border: "2px solid #fff" }}
        />
        <div style={{ flex: 1 }}>
          <div
            style={{
              color: "white",
              fontWeight: 600,
              fontSize: "14px",
              lineHeight: "16px",
            }}
          >
            {userId || "User"} {/* ✅ Show UserID from sessionStorage */}
          </div>
          <div
            style={{
              color: "#FFD700",
              fontSize: "12px",
              lineHeight: "14px",
            }}
          >
            {role || "Role not set"} {/* ✅ Show Role dynamically */}
          </div>
        </div>

        <Dropdown
          menu={{
            items: [
              { key: "1", label: "Profile" },
              {
                key: "2",
                label: "Logout",
                onClick: () => {
                  sessionStorage.clear();
                  window.location.href = "/login";
                },
              },
            ],
          }}
          placement="bottomRight"
          trigger={["click"]}
        >
          <MoreOutlined style={{ color: "white", cursor: "pointer" }} />
        </Dropdown>
      </div>

      {/* Scrollable Menu Section */}
      <div
        style={{
          height: "calc(100vh - 210px)", // 100vh minus header + user info + footer
          overflowY: "auto",
          backgroundColor: "#6C63FF",
          scrollbarWidth: "thin",
        }}
        className="no-scrollbar"
      >
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          defaultOpenKeys={filteredNavItems
            .filter((item) =>
              item.children?.some((child) =>
                location.pathname.startsWith(child.label.props.to)
              )
            )
            .map((item) => item.key)}
          style={{
            background: "transparent",
            color: "white",
            borderRight: "none",
            fontWeight: 500,
            paddingBottom: "16px",
          }}
          items={filteredNavItems}
        />
      </div>

      {/* Footer (Fixed) */}
      <div
        style={{
          textAlign: "center",
          color: "white",
          fontSize: "12px",
          padding: "12px 8px",
          backgroundColor: "#4B3FC2",
          borderTop: "1px solid rgba(255,255,255,0.2)",
          flexShrink: 0,
        }}
      >
        Powered by <b>VJ Academy</b> © 2025
      </div>

      {/* Scrollbar Styling */}
      <style>
        {`
          ::-webkit-scrollbar {
            width: 8px;
          }
          ::-webkit-scrollbar-thumb {
            background-color: #B3A8FF;
            border-radius: 4px;
          }
          ::-webkit-scrollbar-track {
            background-color: #6C63FF;
          }

          .ant-menu-item:hover {
            background-color: rgba(255, 255, 255, 0.15) !important;
            border-radius: 8px;
          }

          .ant-menu-item-selected {
            background-color: rgba(255, 255, 255, 0.25) !important;
            border-radius: 8px;
            color: white !important;
          }
            .ant-menu {
      background: transparent !important;
      color: white !important;
    }

    .ant-menu-item,
    .ant-menu-submenu-title {
      color: white !important;
    }

    .ant-menu-item a {
      color: white !important;
      text-decoration: none;
    }

    .ant-menu-item a:hover {
      color: #FFD700 !important; /* optional: golden hover */
    }

    .ant-menu-item-selected {
      background-color: rgba(255,255,255,0.25) !important;
      color: white !important;
      border-radius: 8px;
    }

    .ant-menu-submenu-title:hover {
      color: #FFD700 !important;
    }
        `}
      </style>
    </Sider>
  );
}
