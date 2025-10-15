// src/components/ProtectedRoute.jsx - Updated version
import { Navigate, useLocation } from 'react-router';
import { message } from 'antd';
import { useEffect, useState } from 'react';

const ProtectedRoute = ({ children }) => {
  const [messageApi, contextHolder] = message.useMessage();
  const [isChecking, setIsChecking] = useState(true);
  const location = useLocation();
  const token = sessionStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      messageApi.error('Please login to continue');
    }
    setIsChecking(false);
  }, [token, messageApi]);

  if (isChecking) {
    return null;
  }

  if (!token) {
    return (
      <>
        {contextHolder}
        <Navigate to="/login" state={{ from: location }} replace />
      </>
    );
  }

  return (
    <>
      {contextHolder}
      {children}
    </>
  );
};

export default ProtectedRoute;