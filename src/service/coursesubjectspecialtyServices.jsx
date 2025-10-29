// src/service/coursesubjectspecialtyServices.jsx
import axiosInstance from '../../utils/axiosInstance';
import { COURSE_SUBJECT_SPECIALTY_URLS } from '../../api/apiUrl';

export const courseSubjectSpecialtyService = {
  // Get all course-subject-specialty relationships
  getAllRelationships: async () => {
    try {
      const response = await axiosInstance.get(COURSE_SUBJECT_SPECIALTY_URLS.GET_ALL);
      return response.data;
    } catch (error) {
      console.error('Error fetching all relationships:', error);
      throw error;
    }
  },

  // Get relationship by composite key
  getRelationshipByKey: async (specialtyId, subjectId, courseId) => {
    try {
      const response = await axiosInstance.get(
        `${COURSE_SUBJECT_SPECIALTY_URLS.GET_BY_COMPOSITE_KEY}/${specialtyId}/${subjectId}/${courseId}`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching relationship by key:', error);
      throw error;
    }
  },

  // Get all relationships for a specific course
  getRelationshipsByCourse: async (courseId) => {
    try {
      const response = await axiosInstance.get(
        `${COURSE_SUBJECT_SPECIALTY_URLS.GET_BY_COURSE}/${courseId}`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching relationships by course:', error);
      throw error;
    }
  },

  // Get all relationships for a specific specialty
  getRelationshipsBySpecialty: async (specialtyId) => {
    try {
      const response = await axiosInstance.get(
        `${COURSE_SUBJECT_SPECIALTY_URLS.GET_BY_SPECIALTY}/${specialtyId}`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching relationships by specialty:', error);
      throw error;
    }
  },

  // Get all relationships for a specific subject
  getRelationshipsBySubject: async (subjectId) => {
    try {
      const response = await axiosInstance.get(
        `${COURSE_SUBJECT_SPECIALTY_URLS.GET_BY_SUBJECT}/${subjectId}`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching relationships by subject:', error);
      throw error;
    }
  },

  // Create a new course-subject-specialty relationship (Education Officer only)
  createRelationship: async (relationshipData) => {
    try {
      const response = await axiosInstance.post(
        COURSE_SUBJECT_SPECIALTY_URLS.CREATE,
        relationshipData
      );
      return response.data;
    } catch (error) {
      console.error('Error creating relationship:', error);
      throw error;
    }
  },

  // Delete all relationships for a specific course (Education Officer only)
  deleteRelationshipsByCourse: async (courseId) => {
    try {
      const response = await axiosInstance.delete(
        `${COURSE_SUBJECT_SPECIALTY_URLS.DELETE_BY_COURSE}/${courseId}`
      );
      return response.data;
    } catch (error) {
      console.error('Error deleting relationships by course:', error);
      throw error;
    }
  },

  // Delete all relationships for a specific specialty (Education Officer only)
  deleteRelationshipsBySpecialty: async (specialtyId) => {
    try {
      const response = await axiosInstance.delete(
        `${COURSE_SUBJECT_SPECIALTY_URLS.DELETE_BY_SPECIALTY}/${specialtyId}`
      );
      return response.data;
    } catch (error) {
      console.error('Error deleting relationships by specialty:', error);
      throw error;
    }
  },

  // Send request for new course-subject-specialty relationship
  requestNew: async (specialtyId, subjectId, courseId, requestData) => {
    try {
      const response = await axiosInstance.post(
        `${COURSE_SUBJECT_SPECIALTY_URLS.REQUEST_NEW}/${specialtyId}/${subjectId}/${courseId}/request/new`,
        requestData
      );
      return response.data;
    } catch (error) {
      console.error('Error requesting new relationship:', error);
      throw error;
    }
  },

  // Send request to modify course-subject-specialty relationship
  requestModify: async (specialtyId, subjectId, courseId, requestData) => {
    try {
      const response = await axiosInstance.post(
        `${COURSE_SUBJECT_SPECIALTY_URLS.REQUEST_MODIFY}/${specialtyId}/${subjectId}/${courseId}/request/modify`,
        requestData
      );
      return response.data;
    } catch (error) {
      console.error('Error requesting modify relationship:', error);
      throw error;
    }
  },
};

export default courseSubjectSpecialtyService;

