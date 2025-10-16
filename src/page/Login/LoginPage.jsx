// src/page/Login/LoginPage.jsx
import { useState } from "react";
import { Form, Input, Button, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router";
import { loginService } from "../../service/loginServices";
import { useLocation } from "react-router";

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();


const location = useLocation();  // Add this line
  const handleLogin = async (values) => {
    setLoading(true);
    try {
      const response = await loginService.login(
        values.username,
        values.password
      );

      if (response.token) {
        // ✅ Save login data
        sessionStorage.setItem("token", response.token);
        sessionStorage.setItem("username", values.username);
        sessionStorage.setItem("userId", response.userId);

        // ✅ Save the first role from the "roles" array (if exists)
        if (response.roles && response.roles.length > 0) {
          sessionStorage.setItem("role", response.roles[0]);
        }

        // ✅ (Optional) save hub URL if needed later
        if (response.hubUrl) {
          sessionStorage.setItem("hubUrl", response.hubUrl);
        }

        messageApi.success("Login successful!");

        // ✅ Redirect to previous page or home
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
  navigate('/forgot-password');  // Navigate to forgot password page
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-purple-600">
      {contextHolder}
      <div className="flex w-full max-w-6xl mx-4 shadow-2xl rounded-2xl overflow-hidden">
        {/* Left side - Login Form */}
        <div className="w-full md:w-1/2 bg-white p-12">
          <div className="max-w-md mx-auto">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              Welcome Back!
            </h1>
            <p className="text-gray-500 mb-8">
              Login to continue your learning journey
            </p>

            <Form
              form={form}
              name="login"
              onFinish={handleLogin}
              layout="vertical"
              requiredMark={false}
            >
              <Form.Item
                label={<span className="text-gray-700 font-medium">Username</span>}
                name="username"
                rules={[
                  {
                    required: true,
                    message: 'Please enter your Username',
                  },
                ]}
              >
                <Input
                  prefix={<UserOutlined className="text-gray-400" />}
                  placeholder="Enter your username"
                  size="large"
                  className="rounded-lg"
                />
              </Form.Item>

              <Form.Item
                label={
                  <span className="text-gray-700 font-medium">Password</span>
                }
                name="password"
                rules={[
                  {
                    required: true,
                    message: "Please enter your password",
                  },
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined className="text-gray-400" />}
                  placeholder="Enter your password"
                  size="large"
                  className="rounded-lg"
                />
              </Form.Item>

              <div className="text-right mb-6">
                <Button
                  type="link"
                  onClick={handleForgotPassword}
                  className="text-indigo-600 hover:text-indigo-700 p-0"
                >
                  Forgot password?
                </Button>
              </div>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  size="large"
                  className="w-full h-12 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 border-none rounded-lg text-lg font-medium shadow-lg"
                >
                  Login
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>

        {/* Right side - Branding */}
        <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-indigo-600 via-purple-600 to-purple-700 items-center justify-center p-12 relative overflow-hidden">
          {/* Decorative circles */}
          <div className="absolute top-20 right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>

          <div className="relative z-10 text-center text-white">
            <div className="mb-8 inline-flex items-center justify-center w-24 h-24 bg-white rounded-3xl shadow-xl">
              <span className="text-5xl font-bold text-indigo-600">VJ</span>
            </div>

            <h2 className="text-5xl font-bold mb-4">VJ Academy</h2>
            <p className="text-xl text-white/90 italic">
              Dream - Learn - Achieve
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
