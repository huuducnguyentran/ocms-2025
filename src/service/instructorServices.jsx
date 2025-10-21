// src/service/instructorServices.jsx
import axiosInstance from '../../utils/axiosInstance';
import { INSTRUCTOR_ASSIGNATION_URLS } from '../../api/apiUrl';

export const instructorAssignationService = {
  // Get all instructor assignations
  getAllAssignations: async () => {
    try {
      const response = await axiosInstance.get(INSTRUCTOR_ASSIGNATION_URLS.GET_ALL);
      return response.data;
    } catch (error) {
      console.error('Error fetching all instructor assignations:', error);
      throw error;
    }
  },

  // Get instructor assignation by composite key (subjectId and instructorId)
  getAssignationByKey: async (subjectId, instructorId) => {
    try {
      const response = await axiosInstance.get(
        `${INSTRUCTOR_ASSIGNATION_URLS.GET_BY_COMPOSITE_KEY}/${subjectId}/${instructorId}`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching instructor assignation by key:', error);
      throw error;
    }
  },

  // Get all assignations for a specific subject
  getAssignationsBySubject: async (subjectId) => {
    try {
      const response = await axiosInstance.get(
        `${INSTRUCTOR_ASSIGNATION_URLS.GET_BY_SUBJECT}/${subjectId}`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching assignations by subject:', error);
      throw error;
    }
  },

  // Get all assignations for a specific instructor
  getAssignationsByInstructor: async (instructorId) => {
    try {
      const response = await axiosInstance.get(
        `${INSTRUCTOR_ASSIGNATION_URLS.GET_BY_INSTRUCTOR}/${instructorId}`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching assignations by instructor:', error);
      throw error;
    }
  },

  // Create a new instructor assignation (Education Officer only)
  createAssignation: async (assignationData) => {
    try {
      const response = await axiosInstance.post(
        INSTRUCTOR_ASSIGNATION_URLS.CREATE,
        assignationData
      );
      return response.data;
    } catch (error) {
      console.error('Error creating instructor assignation:', error);
      throw error;
    }
  },

  // Delete an instructor assignation (Education Officer only)
  deleteAssignation: async (subjectId, instructorId) => {
    try {
      const response = await axiosInstance.delete(
        `${INSTRUCTOR_ASSIGNATION_URLS.DELETE}/${subjectId}/${instructorId}`
      );
      return response.data;
    } catch (error) {
      console.error('Error deleting instructor assignation:', error);
      throw error;
    }
  },
};

export default instructorAssignationService;