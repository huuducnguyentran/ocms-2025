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

export const getExternalCertificateByUserId = async (userId) => {
  try {
    const token = sessionStorage.getItem("token");
    const response = await axiosInstance.get(
      `${AUTH_URLS.GET_EXTERNAL_CERTIFICATE_BY_USER_ID}/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "*/*",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching external certificates for ${userId}:`, error);
    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Failed to fetch external certificates.",
      data: [],
    };
  }
};

export const getExternalCertificateDetailById = async (id) => {
  try {
    const token = localStorage.getItem("token");
    const res = await axiosInstance.get(
      `${AUTH_URLS.GET_EXTERNAL_CERTIFICATE_BY_ID}/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          accept: "*/*",
        },
      }
    );
    return res.data;
  } catch (error) {
    console.error("Error fetching external certificate by ID:", error);
    return { success: false, message: "Failed to fetch certificate detail." };
  }
};

export const uploadExternalCertificateFile = async (id, file) => {
  try {
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("file", file);

    const res = await axiosInstance.put(
      `${AUTH_URLS.UPDATE_EXTERNAL_CERTIFICATE_FILE}/${id}/file`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return res.data;
  } catch (error) {
    console.error("Error uploading external certificate file:", error);
    return {
      success: false,
      message: "Failed to upload certificate file.",
    };
  }
};

// Update external certificate info
export const updateExternalCertificate = async (id, payload) => {
  try {
    const token = sessionStorage.getItem("token");
    const res = await axiosInstance.put(
      `${AUTH_URLS.UPDATE_EXTERNAL_CERTIFICATE}/${id}`,
      payload, // this should be a plain JSON object
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json", // ✅ fix here
          Accept: "application/json",
        },
      }
    );
    return res.data;
  } catch (err) {
    console.error("Error updating external certificate:", err);
    return {
      success: false,
      message: err.response?.data?.message || "Failed to update certificate.",
    };
  }
};

// Create new external certificate
export const createExternalCertificate = async (userId, payload) => {
  try {
    const token = sessionStorage.getItem("token");
    const formData = new FormData();

    // ✅ Append required fields
    formData.append("CertificateCode", payload.certificateCode);
    formData.append("CertificateName", payload.certificateName);
    formData.append("IssuingOrganization", payload.issuingOrganization);
    formData.append("IssueDate", payload.issueDate);
    formData.append("Exp_date", payload.exp_date);
    formData.append("CertificateFile", payload.file); // file: File object

    const res = await axiosInstance.post(
      `${AUTH_URLS.CREATE_EXTERNAL_CERTIFICATE}?userId=${userId}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
          Accept: "*/*",
        },
      }
    );

    return res.data;
  } catch (error) {
    console.error("Error creating external certificate:", error);
    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Failed to create external certificate.",
    };
  }
};
