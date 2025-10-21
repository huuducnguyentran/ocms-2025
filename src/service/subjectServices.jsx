// src/service/subjectServices.jsx
import axiosInstance from '../../utils/axiosInstance';
import { SUBJECT_URLS } from '../../api/apiUrl';

export const subjectService = {
  // Get all subjects (lightweight list)
  getAllSubjects: async () => {
    try {
      const response = await axiosInstance.get(SUBJECT_URLS.GET_ALL);
      return response.data;
    } catch (error) {
      console.error('Error fetching all subjects:', error);
      throw error;
    }
  },

  // Get subject by ID (full details)
  getSubjectById: async (subjectId) => {
    try {
      const response = await axiosInstance.get(`${SUBJECT_URLS.GET_BY_ID}/${subjectId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching subject by ID:', error);
      throw error;
    }
  },

  // Get subjects by status
  getSubjectsByStatus: async (status) => {
    try {
      const response = await axiosInstance.get(`${SUBJECT_URLS.GET_BY_STATUS}/${status}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching subjects by status:', error);
      throw error;
    }
  },

  // Create a new subject
  createSubject: async (subjectData) => {
    try {
      const response = await axiosInstance.post(SUBJECT_URLS.CREATE, subjectData);
      return response.data;
    } catch (error) {
      console.error('Error creating subject:', error);
      throw error;
    }
  },

  // Update an existing subject
  updateSubject: async (subjectId, subjectData) => {
    try {
      const response = await axiosInstance.put(`${SUBJECT_URLS.UPDATE}/${subjectId}`, subjectData);
      return response.data;
    } catch (error) {
      console.error('Error updating subject:', error);
      throw error;
    }
  },

  // Delete a subject
  deleteSubject: async (subjectId) => {
    try {
      const response = await axiosInstance.delete(`${SUBJECT_URLS.DELETE}/${subjectId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting subject:', error);
      throw error;
    }
  },

  // Import multiple subjects from JSON array
  importSubjects: async (subjectsArray) => {
    try {
      const response = await axiosInstance.post(SUBJECT_URLS.IMPORT, subjectsArray);
      return response.data;
    } catch (error) {
      console.error('Error importing subjects:', error);
      throw error;
    }
  },

  // Approve a pending subject
  approveSubject: async (subjectId) => {
    try {
      const response = await axiosInstance.put(`${SUBJECT_URLS.APPROVE}/${subjectId}/approve`);
      return response.data;
    } catch (error) {
      console.error('Error approving subject:', error);
      throw error;
    }
  },

  // Reject a pending subject
  rejectSubject: async (subjectId) => {
    try {
      const response = await axiosInstance.put(`${SUBJECT_URLS.REJECT}/${subjectId}/reject`);
      return response.data;
    } catch (error) {
      console.error('Error rejecting subject:', error);
      throw error;
    }
  },

  // Send request for new subject
  requestNewSubject: async (subjectId) => {
    try {
      const response = await axiosInstance.post(`${SUBJECT_URLS.REQUEST_NEW}/${subjectId}/request/new`);
      return response.data;
    } catch (error) {
      console.error('Error requesting new subject:', error);
      throw error;
    }
  },

  // Send request to modify subject
  requestModifySubject: async (subjectId) => {
    try {
      const response = await axiosInstance.post(`${SUBJECT_URLS.REQUEST_MODIFY}/${subjectId}/request/modify`);
      return response.data;
    } catch (error) {
      console.error('Error requesting modify subject:', error);
      throw error;
    }
  },
};

export default subjectService;