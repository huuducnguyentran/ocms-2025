// src/service/courseServices.jsx
import axiosInstance from '../../utils/axiosInstance';
import { COURSE_URLS } from '../../api/apiUrl';

export const courseService = {
  // Get all courses
  getAllCourses: async () => {
    try {
      const response = await axiosInstance.get(COURSE_URLS.GET_ALL);
      return response.data;
    } catch (error) {
      console.error('Error fetching all courses:', error);
      throw error;
    }
  },

  // Get course by ID (full details)
  getCourseById: async (courseId) => {
    try {
      const response = await axiosInstance.get(`${COURSE_URLS.GET_BY_ID}/${courseId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching course by ID:', error);
      throw error;
    }
  },

  // Get courses by status
  getCoursesByStatus: async (status) => {
    try {
      const response = await axiosInstance.get(`${COURSE_URLS.GET_BY_STATUS}/${status}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching courses by status:', error);
      throw error;
    }
  },

  // Get all subjects for a specific course
  getCourseSubjects: async (courseId) => {
    try {
      const response = await axiosInstance.get(`${COURSE_URLS.GET_SUBJECTS}/${courseId}/subjects`);
      return response.data;
    } catch (error) {
      console.error('Error fetching course subjects:', error);
      throw error;
    }
  },

  // Create a new course (Education Officer only)
  createCourse: async (courseData) => {
    try {
      const response = await axiosInstance.post(COURSE_URLS.CREATE, courseData);
      return response.data;
    } catch (error) {
      console.error('Error creating course:', error);
      throw error;
    }
  },

  // Update an existing course (Education Officer only)
  updateCourse: async (courseId, courseData) => {
    try {
      const response = await axiosInstance.put(`${COURSE_URLS.UPDATE}/${courseId}`, courseData);
      return response.data;
    } catch (error) {
      console.error('Error updating course:', error);
      throw error;
    }
  },

  // Delete a course (Education Officer only)
  deleteCourse: async (courseId) => {
    try {
      const response = await axiosInstance.delete(`${COURSE_URLS.DELETE}/${courseId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting course:', error);
      throw error;
    }
  },

  // Approve a course (Administrator only)
  approveCourse: async (courseId) => {
    try {
      const response = await axiosInstance.put(`${COURSE_URLS.APPROVE}/${courseId}/approve`);
      return response.data;
    } catch (error) {
      console.error('Error approving course:', error);
      throw error;
    }
  },

  // Reject a course (Administrator only)
  rejectCourse: async (courseId) => {
    try {
      const response = await axiosInstance.put(`${COURSE_URLS.REJECT}/${courseId}/reject`);
      return response.data;
    } catch (error) {
      console.error('Error rejecting course:', error);
      throw error;
    }
  },

  // Send request for new course
  requestNewCourse: async (courseId) => {
    try {
      const response = await axiosInstance.post(`${COURSE_URLS.REQUEST_NEW}/${courseId}/request/new`);
      return response.data;
    } catch (error) {
      console.error('Error requesting new course:', error);
      throw error;
    }
  },

  // Send request to modify course
  requestModifyCourse: async (courseId) => {
    try {
      const response = await axiosInstance.post(`${COURSE_URLS.REQUEST_MODIFY}/${courseId}/request/modify`);
      return response.data;
    } catch (error) {
      console.error('Error requesting modify course:', error);
      throw error;
    }
  },
};

export default courseService;