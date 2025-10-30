// src/service/requestServices.jsx
import axiosInstance from '../../utils/axiosInstance';
import { REQUEST_URLS } from '../../api/apiUrl';

export const requestService = {
  // Get all requests (Admin & Education Officer only)
  getAllRequests: async () => {
    try {
      console.log('🔍 Fetching all requests from:', REQUEST_URLS.GET_ALL);
      const response = await axiosInstance.get(REQUEST_URLS.GET_ALL, {
        skipAuthRedirect: true
      });
      console.log('✅ Requests fetched:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching requests:', error.response?.status);
      
      if (error.response?.status === 401 || error.response?.status === 403) {
        return {
          success: false,
          message: 'You do not have permission to view requests.',
          data: [],
          statusCode: error.response?.status
        };
      }
      
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch requests',
        data: [],
        statusCode: error.response?.status
      };
    }
  },

  // Create a new request
  createRequest: async (entityId, requestType, requestData) => {
    try {
      console.log('📤 Creating request:', { entityId, requestType, requestData });
      const response = await axiosInstance.post(
        `${REQUEST_URLS.CREATE}/${entityId}/${requestType}`,
        requestData
      );
      console.log('✅ Request created:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error creating request:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to create request'
      };
    }
  },

  // Approve a request (Admin & Education Officer only)
  approveRequest: async (requestId) => {
    try {
      console.log('✅ Approving request:', requestId);
      const response = await axiosInstance.post(
        `${REQUEST_URLS.APPROVE}/${requestId}/approve`
      );
      console.log('✅ Request approved:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error approving request:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to approve request'
      };
    }
  },

  // Reject a request (Admin & Education Officer only)
  rejectRequest: async (requestId) => {
    try {
      console.log('❌ Rejecting request:', requestId);
      const response = await axiosInstance.post(
        `${REQUEST_URLS.REJECT}/${requestId}/reject`
      );
      console.log('✅ Request rejected:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error rejecting request:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to reject request'
      };
    }
  },
};

export default requestService;