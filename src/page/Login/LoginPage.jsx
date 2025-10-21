// src/page/Login/LoginPage.jsx
import { useState } from "react";
import { Form, Input, Button, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router";
import { loginService } from "../../service/loginServices";
import airplaneImg from "../../assets/may-bay-2.jpeg"

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const location = useLocation();
  
  const handleLogin = async (values) => {
    setLoading(true);
    try {
      const response = await loginService.login(
        values.username,
        values.password
      );

      if (response.token) {
        sessionStorage.setItem("token", response.token);
        sessionStorage.setItem("username", values.username);
        sessionStorage.setItem("userId", response.userId);

        if (response.roles && response.roles.length > 0) {
          sessionStorage.setItem("role", response.roles[0]);
        }

        if (response.hubUrl) {
          sessionStorage.setItem("hubUrl", response.hubUrl);
        }

        messageApi.success("Login successful!");

        const from = location.state?.from?.pathname || "/";
        setTimeout(() => {
          navigate(from, { replace: true });
        }, 500);
      } else {
        messageApi.error("Invalid login response from server.");
      }
    } catch (error) {
      console.error("Login error:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.title ||
        "Login failed. Please check your credentials.";
      messageApi.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    navigate('/forgot-password');
  };

  return (
    <div style={{
      position: 'fixed',
      minHeight: '100vh',
      background: `url(${airplaneImg})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      padding: '40px',
      overflow: 'hidden',
      width: '100vw',
      height: '100vh',
    }}>
      {contextHolder}
      
      {/* Very light overlay - chỉ làm tối nhẹ */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(to right, rgba(0, 40, 80, 0.15) 0%, rgba(0, 80, 120, 0.05) 100%)',
        zIndex: 1,
      }} />

      {/* Login Form Card with Glass Effect - TRONG SUỐT HƠN */}
      <div style={{
        position: 'relative',
        zIndex: 2,
        width: '100%',
        maxWidth: '480px',
        marginRight: '80px',
        background: 'rgba(255, 255, 255, 0.1)',  // 
        backdropFilter: 'blur(25px)',  // ✅ Tăng blur để text rõ hơn
        WebkitBackdropFilter: 'blur(25px)',
        borderRadius: '24px',
        padding: '50px 40px',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3), 0 0 1px rgba(255, 255, 255, 0.5), inset 0 0 60px rgba(255, 255, 255, 0.1)',
        border: '1px solid rgba(255, 255, 255, 0.4)',
      }}>
        {/* Logo */}
        <div style={{
          textAlign: 'center',
          marginBottom: '40px',
        }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '20px',
          }}>
            {/* Wings Icon */}
            <svg width="180" height="70" viewBox="0 0 200 80" style={{ opacity: 0.9 }}>
              {/* Left wing */}
              <path 
                d="M 10 40 Q 40 20, 80 35 L 85 45 Q 45 35, 15 50 Z" 
                fill="#333"
                opacity="0.8"
              />
              {/* Right wing */}
              <path 
                d="M 190 40 Q 160 20, 120 35 L 115 45 Q 155 35, 185 50 Z" 
                fill="#333"
                opacity="0.8"
              />
              {/* Center circle */}
              <circle cx="100" cy="40" r="15" fill="#222" />
              <text 
                x="100" 
                y="46" 
                textAnchor="middle" 
                fill="white" 
                fontSize="16" 
                fontWeight="bold"
              >
                VJ
              </text>
            </svg>
          </div>
          
          <h2 style={{
            fontSize: '20px',
            fontWeight: '700',
            color: '#1a1a1a',
            margin: '0 0 8px 0',
            letterSpacing: '3px',
            textShadow: '0 2px 4px rgba(255, 255, 255, 0.8)',
          }}>
            VJ ACADEMY
          </h2>
          <p style={{
            fontSize: '11px',
            color: '#333',
            margin: 0,
            letterSpacing: '1.5px',
            textTransform: 'uppercase',
            textShadow: '0 1px 2px rgba(255, 255, 255, 0.8)',
          }}>
            ONLINE CERTIFICATE MANAGEMENT SYSTEM
          </p>
        </div>

        {/* Member Login Title */}
        <h3 style={{
          fontSize: '24px',
          fontWeight: '400',
          color: '#222',
          textAlign: 'center',
          marginBottom: '35px',
          textShadow: '0 2px 4px rgba(255, 255, 255, 0.8)',
        }}>
          Member Login
        </h3>

        {/* Login Form */}
        <Form
          form={form}
          name="login"
          onFinish={handleLogin}
          layout="vertical"
          requiredMark={false}
        >
          <Form.Item
            name="username"
            rules={[
              {
                required: true,
                message: 'Please enter your username',
              },
            ]}
          >
            <Input
              prefix={<UserOutlined style={{ color: '#555', fontSize: '16px' }} />}
              placeholder="user"
              size="large"
              style={{
                borderRadius: '10px',
                border: '2px solid rgba(0, 188, 212, 0.3)',
                padding: '14px 16px',
                fontSize: '15px',
                background: 'rgba(255, 255, 255, 0.7)',  // ✅ Input cũng trong suốt hơn
                backdropFilter: 'blur(10px)',
                transition: 'all 0.3s ease',
              }}
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: "Please enter your password",
              },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: '#555', fontSize: '16px' }} />}
              placeholder="password"
              size="large"
              style={{
                borderRadius: '10px',
                border: '2px solid rgba(0, 188, 212, 0.3)',
                padding: '14px 16px',
                fontSize: '15px',
                background: 'rgba(255, 255, 255, 0.7)',
                backdropFilter: 'blur(10px)',
                transition: 'all 0.3s ease',
              }}
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: '25px', marginTop: '30px' }}>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              size="large"
              style={{
                width: '100%',
                height: '52px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #00bcd4 0%, #0097a7 100%)',
                border: 'none',
                fontSize: '17px',
                fontWeight: '600',
                boxShadow: '0 6px 20px rgba(0, 188, 212, 0.5)',
                transition: 'all 0.3s ease',
                letterSpacing: '0.5px',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 188, 212, 0.6)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 188, 212, 0.5)';
              }}
            >
              Login
            </Button>
          </Form.Item>

          {/* Bottom Links */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: '10px',
          }}>
            <Button
              type="link"
              onClick={handleForgotPassword}
              style={{
                color: '#00bcd4',
                padding: 0,
                fontSize: '14px',
                fontStyle: 'italic',
                fontWeight: '600',
                textShadow: '0 1px 2px rgba(255, 255, 255, 0.8)',
              }}
            >
              Forgot your password?
            </Button>
            <Button
              type="link"
              style={{
                color: '#00bcd4',
                padding: 0,
                fontSize: '14px',
                fontStyle: 'italic',
                fontWeight: '600',
                textShadow: '0 1px 2px rgba(255, 255, 255, 0.8)',
              }}
            >
            </Button>
          </div>
        </Form>
      </div>

      {/* Custom Styles */}
      <style>{`
        .ant-input:focus,
        .ant-input-password:focus,
        .ant-input-affix-wrapper:focus,
        .ant-input-affix-wrapper-focused {
          border-color: #00bcd4 !important;
          box-shadow: 0 0 0 3px rgba(0, 188, 212, 0.2) !important;
          background: rgba(255, 255, 255, 0.85) !important;
        }

        .ant-input-affix-wrapper:hover {
          border-color: #00bcd4 !important;
          background: rgba(255, 255, 255, 0.8) !important;
        }

        .ant-input::placeholder,
        .ant-input-password::placeholder {
          color: #777 !important;
          font-style: italic;
        }

        @media (max-width: 768px) {
          div[style*="maxWidth: '480px'"] {
            margin-right: 0 !important;
            max-width: 90% !important;
          }
        }
      `}</style>
    </div>
  );
};

export default LoginPage;