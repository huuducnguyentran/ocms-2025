// src/service/accountServices.jsx
import axiosInstance from '../../utils/axiosInstance';
import { USER_URLS, AUTH_URLS } from '../../api/apiUrl';

export const accountService = {
  getAllUsers: async () => {
    try {
      const response = await axiosInstance.get(USER_URLS.GET_ALL_USERS);
      return response.data;
    } catch (error) {
      console.error('Error fetching all users:', error);
      throw error;
    }
  },
};

export const getAllInstructors = async () => {
  try {
    const token = sessionStorage.getItem("token");
    const response = await axiosInstance.get(`${AUTH_URLS.GET_USER_BY_ROLE}`, {
      params: { roleid: 2 },
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "*/*",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching instructors:", error);
    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Failed to fetch instructors. Please try again later.",
      data: [],
    };
  }
};

export default accountService;