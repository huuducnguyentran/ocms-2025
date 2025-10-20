// src/service/TrainingPlanService.jsx
import axiosInstance from "../../utils/axiosInstance";
import { PLAN_URLS } from "../../api/apiUrl";

/**
 * Get all plans
 */
export const getAllPlans = async () => {
  try {
    const token = sessionStorage.getItem("token");
    const res = await axiosInstance.get(`${PLAN_URLS.GET_ALL_PLANS}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "*/*",
      },
    });
    return res.data;
  } catch (error) {
    console.error("Error fetching all plans:", error);
    return {
      success: false,
      message: "Failed to fetch plans.",
      data: [],
    };
  }
};

/**
 * Get plan by Id
 */
export const getPlanById = async (planId) => {
  try {
    const token = sessionStorage.getItem("token");
    const res = await axiosInstance.get(
      `${PLAN_URLS.GET_PLAN_BY_ID}/${planId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "*/*",
        },
      }
    );
    return res.data;
  } catch (error) {
    console.error(`Error fetching plan with ID ${planId}:`, error);
    return {
      success: false,
      message: "Failed to fetch plan.",
    };
  }
};
