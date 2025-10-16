//src/services/TraineeService.jsx
import { AUTH_URLS } from "../../api/apiUrl";
import axiosInstance from "../../utils/axiosInstance";

// Function to import Trainee using Excel file
export const importTrainee = async (file) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const token = sessionStorage.getItem("token");

    // ✅ Ensure token includes "Bearer " prefix
    const authHeader = token ? `Bearer ${token}` : "";

    const response = await axiosInstance.post(
      `${AUTH_URLS.IMPORT_TRAINEE}`, // ✅ fixed extra curly brace
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: authHeader,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error importing Trainee:", error);
    throw error;
  }
};

/**
 * ✅ Get all trainees (roleId = 4)
 * @returns {Promise<{success: boolean, data: any[], message: string}>}
 */
export const getAllTrainees = async () => {
  try {
    const token = sessionStorage.getItem("token");
    const response = await axiosInstance.get(`${AUTH_URLS.GET_USER_BY_ROLE}`, {
      params: { roleid: 4 },
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "*/*",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching trainees:", error);
    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Failed to fetch trainees. Please try again later.",
      data: [],
    };
  }
};
