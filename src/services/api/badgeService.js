import { toast } from 'react-toastify';

export const badgeService = {
  getAllBadges: async () => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "icon" } },
          { field: { Name: "criteria" } },
          { field: { Name: "resetCycle" } }
        ],
        orderBy: [
          {
            fieldName: "Name",
            sorttype: "ASC"
          }
        ]
      };

      const response = await apperClient.fetchRecords('badges', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching badges:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  },

  getBadgeById: async (badgeId) => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "icon" } },
          { field: { Name: "criteria" } },
          { field: { Name: "resetCycle" } }
        ]
      };

      const response = await apperClient.getRecordById('badges', badgeId, params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching badge with ID ${badgeId}:`, error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  },

  createBadge: async (badgeData) => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [{
          Name: badgeData.name,
          icon: badgeData.icon,
          criteria: badgeData.criteria,
          resetCycle: badgeData.resetCycle || 'none'
        }]
      };

      const response = await apperClient.createRecord('badges', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);

        if (failedRecords.length > 0) {
          console.error(`Failed to create badge ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }

        if (successfulRecords.length > 0) {
          toast.success('배지가 성공적으로 생성되었습니다');
          return successfulRecords[0].data;
        }
      }

      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating badge:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  },

  updateBadge: async (badgeId, badgeData) => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [{
          Id: badgeId,
          Name: badgeData.name,
          icon: badgeData.icon,
          criteria: badgeData.criteria,
          resetCycle: badgeData.resetCycle
        }]
      };

      const response = await apperClient.updateRecord('badges', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);

        if (failedUpdates.length > 0) {
          console.error(`Failed to update badge ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }

        if (successfulUpdates.length > 0) {
          toast.success('배지가 성공적으로 업데이트되었습니다');
          return successfulUpdates[0].data;
        }
      }

      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating badge:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  },

  deleteBadge: async (badgeId) => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        RecordIds: [badgeId]
      };

      const response = await apperClient.deleteRecord('badges', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);

        if (failedDeletions.length > 0) {
          console.error(`Failed to delete badge ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }

        if (successfulDeletions.length > 0) {
          toast.success('배지가 성공적으로 삭제되었습니다');
          return true;
        }
      }

      return false;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting badge:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return false;
    }
  },

  resetMonthlyBadges: async () => {
    try {
      // Get all badges with monthly reset cycle
      const badges = await badgeService.getAllBadges();
      const monthlyBadges = badges.filter(badge => badge.resetCycle === 'monthly');
      
      if (monthlyBadges.length === 0) {
        return true;
      }

      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Get all user badges for monthly reset badges
      const params = {
        fields: [
          { field: { Name: "userId" } },
          { field: { Name: "badgeId" } },
          { field: { Name: "earnedAt" } }
        ],
        where: [
          {
            FieldName: "badgeId",
            Operator: "ExactMatch",
            Values: monthlyBadges.map(badge => badge.Id)
          }
        ]
      };

      const userBadgesResponse = await apperClient.fetchRecords('user_badges', params);
      
      if (userBadgesResponse.success && userBadgesResponse.data) {
        const badgeIdsToDelete = userBadgesResponse.data.map(userBadge => userBadge.Id);
        
        if (badgeIdsToDelete.length > 0) {
          const deleteParams = {
            RecordIds: badgeIdsToDelete
          };
          
          const deleteResponse = await apperClient.deleteRecord('user_badges', deleteParams);
          
          if (deleteResponse.success) {
            console.log(`Successfully reset ${badgeIdsToDelete.length} monthly badges`);
            return true;
          }
        }
      }

      return true;
    } catch (error) {
      console.error("Error resetting monthly badges:", error.message);
      return false;
    }
  }
};