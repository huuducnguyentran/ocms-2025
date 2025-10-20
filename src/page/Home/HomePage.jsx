// src/page/Home/HomePage.jsx
import { Card, Row, Col, Statistic, Button } from 'antd';
import {
  UserOutlined,
  BookOutlined,
  TeamOutlined,
  TrophyOutlined,
  RocketOutlined,
  SafetyOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router';

const HomePage = () => {
  const navigate = useNavigate();

  const stats = [
    {
      title: 'Total Users',
      value: 1234,
      icon: <UserOutlined className="text-blue-500" />,
      color: 'bg-blue-50',
    },
    {
      title: 'Active Courses',
      value: 56,
      icon: <BookOutlined className="text-green-500" />,
      color: 'bg-green-50',
    },
    {
      title: 'Trainees',
      value: 892,
      icon: <TeamOutlined className="text-purple-500" />,
      color: 'bg-purple-50',
    },
    {
      title: 'Certificates Issued',
      value: 432,
      icon: <TrophyOutlined className="text-yellow-500" />,
      color: 'bg-yellow-50',
    },
  ];

  const quickActions = [
    {
      title: 'Import Trainees',
      description: 'Bulk import trainees from Excel',
      icon: <TeamOutlined />,
      color: 'bg-blue-500',
      path: '/trainees-import',
    },
    {
      title: 'Verify Certificate',
      description: 'Verify certificate authenticity',
      icon: <SafetyOutlined />,
      color: 'bg-green-500',
      path: '/verify',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <Card className="bg-gradient-to-r from-indigo-500 via-purple-500 to-purple-600 border-none">
        <div className="flex items-center justify-between text-white">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Welcome to VJ Academy Management System
            </h1>
            <p className="text-lg text-white/90">
              Manage your training programs efficiently
            </p>
          </div>
          <RocketOutlined className="text-6xl text-white/30" />
        </div>
      </Card>

      {/* Statistics */}
      <Row gutter={[16, 16]}>
        {stats.map((stat, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <Card className="hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <Statistic
                  title={stat.title}
                  value={stat.value}
                  valueStyle={{ color: '#1890ff', fontSize: '24px', fontWeight: 'bold' }}
                />
                <div className={`p-4 rounded-full ${stat.color}`}>
                  <span className="text-3xl">{stat.icon}</span>
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Quick Actions</h2>
        <Row gutter={[16, 16]}>
          {quickActions.map((action, index) => (
            <Col xs={24} sm={12} lg={8} key={index}>
              <Card
                hoverable
                className="h-full"
                onClick={() => navigate(action.path)}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg ${action.color} text-white text-2xl`}>
                    {action.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">
                      {action.title}
                    </h3>
                    <p className="text-gray-600 text-sm">{action.description}</p>
                  </div>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* Coming Soon Section */}
      <Card>
        <div className="text-center py-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            More Features Coming Soon
          </h2>
          <p className="text-gray-600">
            We're working on additional features to enhance your experience
          </p>
          <Button type="primary" size="large" className="mt-4" disabled>
            Stay Tuned
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default HomePage;