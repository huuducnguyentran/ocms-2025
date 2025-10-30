// src/service/notificationServices.jsx
import axiosInstance from '../../utils/axiosInstance';
import { NOTIFICATION_URLS } from '../../api/apiUrl';

export const notificationService = {
  // Get all notifications for current user
  getAllNotifications: async () => {
    try {
      const response = await axiosInstance.get(NOTIFICATION_URLS.GET_ALL);
      return response.data;
    } catch (error) {
      console.error('Error fetching notifications:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch notifications',
        data: []
      };
    }
  },

  // Mark notification as read
  markAsRead: async (notificationId) => {
    try {
      const response = await axiosInstance.put(
        `${NOTIFICATION_URLS.MARK_READ}/${notificationId}/mark-read`
      );
      return response.data;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to mark as read'
      };
    }
  },

  // Create a new notification (Admin only)
  createNotification: async (notificationData) => {
    try {
      const response = await axiosInstance.post(
        NOTIFICATION_URLS.CREATE,
        notificationData
      );
      return response.data;
    } catch (error) {
      console.error('Error creating notification:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to create notification'
      };
    }
  },

  // Test admin notification (sends to all admins)
  testAdminNotification: async () => {
    try {
      const response = await axiosInstance.post(NOTIFICATION_URLS.TEST_ADMIN);
      return response.data;
    } catch (error) {
      console.error('Error sending test notification:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to send test notification'
      };
    }
  },
};

export default notificationService;