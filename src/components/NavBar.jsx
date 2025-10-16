import { Layout, Menu, Badge } from "antd";
import { Link } from "react-router";
import navItems from "../data/NavItems";
import { useRef } from "react";

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
} from "@ant-design/icons";

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

const Navbar = () => {
  const scrollRef = useRef(null);

  // No role filtering anymore
  const filteredNavItems = navItems.map((item) => {
    if (item.children) {
      return {
        key: item.key,
        icon: iconMap[item.icon],
        label: item.label,
        children: item.children.map((child) => ({
          key: child.key,
          label: <Link to={child.path}>{child.label}</Link>,
        })),
      };
    }

    return {
      key: item.key,
      icon: iconMap[item.icon],
      label: (
        <Link to={item.path}>
          {item.label}
          {item.key === "2" && <Badge offset={[10, 0]} />}
        </Link>
      ),
    };
  });

  return (
   <Sider
  theme="dark"
  width={240}
  style={{
    overflow: "hidden",
    height: "100vh",
    position: "sticky",
    top: 0,
    left: 0,
    backgroundColor: "#083344",
    userSelect: "none",
  }}
>
      <div className="p-4 text-center border-b border-gray-600">
        <div className="text-2xl font-extrabold text-white tracking-wide">
          <span className="text-red-500">F</span>
          <span className="text-green-500">l</span>
          <span className="text-blue-500">i</span>
          <span className="text-yellow-500">g</span>
          <span className="text-white">ht</span>
          <span className="text-white">Vault</span>
        </div>
      </div>

      <div
        ref={scrollRef}
        style={{
          height: "calc(100vh - 80px)",
          overflowY: "scroll",
          scrollbarWidth: "none",
        }}
        className="no-scrollbar"
      >
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[window.location.pathname]}
          defaultOpenKeys={filteredNavItems
            .filter((item) =>
              item.children?.some((child) =>
                window.location.pathname.startsWith(child.label.props.to)
              )
            )
            .map((item) => item.key)}
          style={{
            borderRight: 0,
            backgroundColor: "#083344",
          }}
          items={filteredNavItems}
        />
      </div>
    </Sider>
  );
};

export default Navbar;
