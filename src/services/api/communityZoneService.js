import { toast } from 'react-toastify';

export const communityZoneService = {
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
          { field: { Name: "slug" } },
          { field: { Name: "label" } },
          { field: { Name: "roles" } },
          { field: { Name: "can_post" } }
        ]
      };

      const response = await apperClient.fetchRecords('community_zone', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      if (!response.data || response.data.length === 0) {
        return [];
      }

      return [...response.data];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching community zones:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  },

  getByRole: async (userRole) => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "slug" } },
          { field: { Name: "label" } },
          { field: { Name: "roles" } },
          { field: { Name: "can_post" } }
        ],
        where: [
          {
            FieldName: "roles",
            Operator: "Contains",
            Values: [userRole]
          }
        ]
      };

      const response = await apperClient.fetchRecords('community_zone', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      if (!response.data || response.data.length === 0) {
        return [];
      }

      return [...response.data];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching zones by role:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  }
};