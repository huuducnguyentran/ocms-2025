// src/service/profileService.jsx
import axiosInstance from '../../utils/axiosInstance';
import { USER_URLS } from '../../api/apiUrl';

export const profileService = {
  // Get user profile
  getProfile: async () => {
    try {
      const response = await axiosInstance.get(USER_URLS.PROFILE);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update user profile - KHÔNG format lại, gửi trực tiếp
  updateProfile: async (profileData) => {
    try {
      const response = await axiosInstance.put(USER_URLS.UPDATE_PROFILE, profileData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Change password
  changePassword: async (currentPassword, newPassword, confirmPassword) => {
    try {
      const response = await axiosInstance.post(USER_URLS.CHANGE_PASSWORD, {
        currentPassword,
        newPassword,
        confirmPassword,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

// Upload avatar - with logging
uploadAvatar: async (file) => {
  try { 
    console.log('📦 profileService.uploadAvatar called');
    console.log('File object:', file);
    
    const formData = new FormData();
    formData.append('file', file); 
    
    console.log('FormData created, appended file with key: "file"');
    console.log('Making PUT request to:', USER_URLS.UPLOAD_AVATAR);

    const response = await axiosInstance.put(USER_URLS.UPLOAD_AVATAR, formData, {
      headers: {
        'Content-Type': undefined,  // Let axios set multipart boundary
      },
    });
    
    console.log('Raw axios response:', response);
    console.log('Response data:', response.data);
    
    return response.data;
  } catch (error) {
    console.error('profileService.uploadAvatar error:', error);
    console.error('Error response:', error.response);
    throw error;
  }
},
};

