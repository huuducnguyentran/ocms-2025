// src/service/specialtyServices.jsx
import axiosInstance from '../../utils/axiosInstance';
import { SPECIALTY_URLS } from '../../api/apiUrl';

export const specialtyService = {
  getAllSpecialties: async () => {
    try {
      const response = await axiosInstance.get(SPECIALTY_URLS.GET_ALL);
      return response.data;
    } catch (error) {
      console.error('Error fetching all specialties:', error);
      throw error;
    }
  },

  getSpecialtyById: async (specialtyId) => {
    try {
      const response = await axiosInstance.get(`${SPECIALTY_URLS.GET_BY_ID}/${specialtyId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching specialty by ID:', error);
      throw error;
    }
  },

  createSpecialty: async (specialtyData) => {
    try {
      const response = await axiosInstance.post(SPECIALTY_URLS.CREATE, specialtyData);
      return response.data;
    } catch (error) {
      console.error('Error creating specialty:', error);
      throw error;
    }
  },

  updateSpecialty: async (specialtyId, specialtyData) => {
    try {
      const response = await axiosInstance.put(`${SPECIALTY_URLS.UPDATE}/${specialtyId}`, specialtyData);
      return response.data;
    } catch (error) {
      console.error('Error updating specialty:', error);
      throw error;
    }
  },

  deleteSpecialty: async (specialtyId) => {
    try {
      const response = await axiosInstance.delete(`${SPECIALTY_URLS.DELETE}/${specialtyId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting specialty:', error);
      throw error;
    }
  },
};

export default specialtyService;