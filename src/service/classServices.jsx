// src/service/classServices.jsx
import axiosInstance from '../../utils/axiosInstance';
import { CLASS_URLS, CLASSGROUP_URLS } from '../../api/apiUrl';

// Class Services
export const classService = {
  // Get all classes
  getAllClasses: async () => {
    try {
      const response = await axiosInstance.get(CLASS_URLS.GET_ALL);
      return response.data;
    } catch (error) {
      console.error('Error fetching all classes:', error);
      throw error;
    }
  },

  // Get class by ID
  getClassById: async (classId) => {
    try {
      const response = await axiosInstance.get(`${CLASS_URLS.GET_BY_ID}/${classId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching class by ID:', error);
      throw error;
    }
  },

  // Create a new class (Education Officer only)
  createClass: async (classData) => {
    try {
      const response = await axiosInstance.post(CLASS_URLS.CREATE, classData);
      return response.data;
    } catch (error) {
      console.error('Error creating class:', error);
      throw error;
    }
  },

  // Update an existing class (Education Officer only)
  updateClass: async (classId, classData) => {
    try {
      const response = await axiosInstance.put(`${CLASS_URLS.UPDATE}/${classId}`, classData);
      return response.data;
    } catch (error) {
      console.error('Error updating class:', error);
      throw error;
    }
  },

  // Delete a class (Education Officer only)
  deleteClass: async (classId) => {
    try {
      const response = await axiosInstance.delete(`${CLASS_URLS.DELETE}/${classId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting class:', error);
      throw error;
    }
  },
};

// ClassGroup Services
export const classGroupService = {
  // Get all class groups
  getAllClassGroups: async () => {
    try {
      const response = await axiosInstance.get(CLASSGROUP_URLS.GET_ALL);
      return response.data;
    } catch (error) {
      console.error('Error fetching all class groups:', error);
      throw error;
    }
  },

  // Get class group by ID
  getClassGroupById: async (classGroupId) => {
    try {
      const response = await axiosInstance.get(`${CLASSGROUP_URLS.GET_BY_ID}/${classGroupId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching class group by ID:', error);
      throw error;
    }
  },

  // Get all classes in a class group
  getClassGroupClasses: async (classGroupId) => {
    try {
      const response = await axiosInstance.get(`${CLASSGROUP_URLS.GET_CLASSES}/${classGroupId}/classes`);
      return response.data;
    } catch (error) {
      console.error('Error fetching class group classes:', error);
      throw error;
    }
  },

  // Create a new class group (Education Officer only)
  createClassGroup: async (classGroupData) => {
    try {
      const response = await axiosInstance.post(CLASSGROUP_URLS.CREATE, classGroupData);
      return response.data;
    } catch (error) {
      console.error('Error creating class group:', error);
      throw error;
    }
  },

  // Update an existing class group (Education Officer only)
  updateClassGroup: async (classGroupId, classGroupData) => {
    try {
      const response = await axiosInstance.put(`${CLASSGROUP_URLS.UPDATE}/${classGroupId}`, classGroupData);
      return response.data;
    } catch (error) {
      console.error('Error updating class group:', error);
      throw error;
    }
  },

  // Delete a class group (Education Officer only)
  deleteClassGroup: async (classGroupId) => {
    try {
      const response = await axiosInstance.delete(`${CLASSGROUP_URLS.DELETE}/${classGroupId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting class group:', error);
      throw error;
    }
  },
};

export default { classService, classGroupService };

