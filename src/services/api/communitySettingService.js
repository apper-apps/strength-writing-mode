import { toast } from 'react-toastify';

export const communitySettingService = {
  getAll: async () => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "allow_anonymous_name" } },
          { field: { Name: "allow_reactions" } },
          { field: { Name: "allow_report" } },
          { field: { Name: "owner_can_delete" } }
        ]
      };

      const response = await apperClient.fetchRecords('community_setting', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (!response.data || response.data.length === 0) {
        // Return default settings if none found
        return {
          allow_anonymous_name: true,
          allow_reactions: true,
          allow_report: true,
          owner_can_delete: true
        };
      }

      // Return first settings record
      return { ...response.data[0] };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching community settings:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return {
        allow_anonymous_name: true,
        allow_reactions: true,
        allow_report: true,
        owner_can_delete: true
      };
    }
  },

  update: async (id, settingData) => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [{
          Id: parseInt(id),
          Name: settingData.Name,
          allow_anonymous_name: settingData.allow_anonymous_name,
          allow_reactions: settingData.allow_reactions,
          allow_report: settingData.allow_report,
          owner_can_delete: settingData.owner_can_delete
        }]
      };

      const response = await apperClient.updateRecord('community_setting', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      return response.results[0]?.data || null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating community settings:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  }
};