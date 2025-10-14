const navItems = [
  { key: "1", label: "Home", icon: "HomeOutlined", path: "/home" },
  { key: "2", label: "Notifications", icon: "BellOutlined", path: "/notifications" },

  // Learning Management
  { key: "3", label: "Specialty", icon: "ImportOutlined", path: "/specialty" },
  {
    key: "4",
    label: "Course",
    icon: "BookOutlined",
    path: "/course",
    children: [
      { key: "4-1", label: "All Courses", path: "/all-courses" },
      { key: "4-2", label: "Trainee Courses", path: "/assigned-trainee-courses" },
    ],
  },
  { key: "6", label: "Subject", icon: "ReadOutlined", path: "/subject" },
  { key: "24", label: "Subject Specialty", icon: "FileProtectOutlined", path: "/subject-specialty" },
  { key: "5", label: "Instructor Assignment", icon: "BookOutlined", path: "/instructor-assignment" },
  { key: "23", label: "Classroom", icon: "FileProtectOutlined", path: "/class" },

  // Scheduling & Attendance
  {
    key: "7",
    label: "Schedule",
    icon: "ScheduleOutlined",
    path: "/schedule",
    children: [{ key: "7-1", label: "All Schedule", path: "/schedule" }],
  },

  // Assessment & Accomplishment
  { key: "9", label: "Accomplishments", icon: "FileDoneOutlined", path: "/accomplishments" },
  {
    key: "10",
    label: "Grade",
    icon: "FileExcelOutlined",
    path: "/grade-view",
    children: [
      { key: "10-1", label: "Import Grade", path: "/grade" },
      { key: "10-2", label: "View Grade", path: "/grade-view" },
      { key: "10-3", label: "My Grades", path: "/trainee-grade" },
    ],
  },

  // Requests
  { key: "11", label: "Request", icon: "SelectOutlined", path: "/request" },
  { key: "12", label: "Send Request", icon: "FileAddOutlined", path: "/send-request" },

  // Certification & Decisions
  {
    key: "13",
    label: "Certificate",
    icon: "FileProtectOutlined",
    path: "/certificate",
    children: [
      { key: "13-1", label: "Certificate Pending", path: "/certificate-pending" },
      { key: "13-2", label: "Certificate Active", path: "/certificate-active" },
      { key: "13-3", label: "Certificate Revoked", path: "/certificate-revoked" },
    ],
  },
  { key: "14", label: "Certificate Template", icon: "FileProtectOutlined", path: "/certificate-template" },
  {
    key: "15",
    label: "Decision",
    icon: "FileProtectOutlined",
    path: "/decision",
    children: [
      { key: "15-1", label: "Decision Pending", path: "/decision-pending" },
      { key: "15-2", label: "Decision Active", path: "/decision-active" },
    ],
  },
  { key: "16", label: "Decision Template", icon: "FileProtectOutlined", path: "/decision-template" },

  // Users & Roles
  {
    key: "17",
    label: "Accounts",
    icon: "TeamOutlined",
    path: "/accounts",
    children: [
      { key: "17-1", label: "View Accounts", path: "/accounts" },
      { key: "17-2", label: "Create Account", path: "/create-account" },
    ],
  },
  {
    key: "18",
    label: "trainees",
    icon: "SolutionOutlined",
    path: "/trainees",
    children: [
      { key: "18-1", label: "View trainees", path: "/trainees-view" },
      { key: "18-2", label: "Import trainees", path: "/trainees-import" },
    ],
  },
  { key: "19", label: "Trainee Assignment", icon: "DeploymentUnitOutlined", path: "/assigned-trainee" },

  // Organization Management
  { key: "20", label: "Department", icon: "FileProtectOutlined", path: "/department" },

  // System & Tools
  { key: "21", label: "Regulations", icon: "FileProtectOutlined", path: "/regulations" },
  { key: "22", label: "Reports", icon: "FileExcelOutlined", path: "/export-certificate" },
];

export default navItems;
