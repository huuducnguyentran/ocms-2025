import { COURSE_URLS } from "../../api/apiUrl";
import axiosInstance from "../../utils/axiosInstance";

export const getAllCourses = async () => {
  try {
    const token = localStorage.getItem("token"); // adjust if you store elsewhere
    const res = await axiosInstance.get(`${COURSE_URLS.GET_ALL_COURSE}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "*/*",
      },
    });
    return res.data; // contains data[], success, message
  } catch (error) {
    console.error("Error fetching courses:", error);
    throw error;
  }
};
