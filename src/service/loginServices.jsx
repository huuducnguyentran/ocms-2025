// src/service/loginServices.jsx
import axiosInstance from '../../utils/axiosInstance';
import { AUTH_URLS } from '../../api/apiUrl';

export const loginService = {
  // Login with username and password
  login: async (username, password) => {
    try {
      const response = await axiosInstance.post(AUTH_URLS.LOGIN, {
        username,
        password,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Forgot password
  forgotPassword: async (email) => {
    try {
      const response = await axiosInstance.post(AUTH_URLS.FORGOT_PASSWORD, {
        email,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Reset password
  resetPassword: async (token, newPassword) => {
    try {
      const response = await axiosInstance.post(AUTH_URLS.RESET_PASSWORD, {
        token,
        newPassword,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};