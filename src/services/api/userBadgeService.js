import { toast } from 'react-toastify';
import { badgeService } from './badgeService';

export const userBadgeService = {
  getUserBadges: async (userId) => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "userId" } },
          { field: { Name: "badgeId" } },
          { field: { Name: "earnedAt" } }
        ],
        where: userId ? [
          {
            FieldName: "userId",
            Operator: "EqualTo",
            Values: [parseInt(userId)]
          }
        ] : [],
        orderBy: [
          {
            fieldName: "earnedAt",
            sorttype: "DESC"
          }
        ]
      };

      const response = await apperClient.fetchRecords('user_badges', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      // Enhance with badge details
      const userBadges = response.data || [];
      const badgeDetails = await badgeService.getAllBadges();
      
      return userBadges.map(userBadge => {
        const badge = badgeDetails.find(b => b.Id === (userBadge.badgeId?.Id || userBadge.badgeId));
        return {
          ...userBadge,
          badgeDetails: badge || {},
          name: badge?.Name || 'Unknown Badge',
          icon: badge?.icon || 'Award',
          description: badge?.criteria || '',
          earnedDate: userBadge.earnedAt
        };
      });
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching user badges:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  },

  checkBadgeEligibility: async (userId, badgeId) => {
    try {
      // Get badge criteria
      const badge = await badgeService.getBadgeById(badgeId);
      if (!badge) return false;

      // Check if user already has this badge
      const userBadges = await userBadgeService.getUserBadges(userId);
      const alreadyEarned = userBadges.some(ub => 
        (ub.badgeId?.Id || ub.badgeId) === badgeId
      );
      
      if (alreadyEarned) return false;

      // Parse and evaluate criteria
      const criteria = badge.criteria;
      
      if (criteria.includes('videos>=4')) {
        // Check if user has completed 4 or more videos this month
        const { ApperClient } = window.ApperSDK;
        const apperClient = new ApperClient({
          apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
          apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
        });

        const now = new Date();
        const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        
        const params = {
          fields: [
            { field: { Name: "Name" } }
          ],
          where: [
            {
              FieldName: "Owner",
              Operator: "EqualTo",
              Values: [parseInt(userId)]
            },
            {
              FieldName: "CreatedOn",
              Operator: "GreaterThanOrEqualTo",
              Values: [firstDayOfMonth.toISOString()]
            }
          ]
        };

        const coursesResponse = await apperClient.fetchRecords('course', params);
        const completedVideos = coursesResponse.data?.length || 0;
        
        return completedVideos >= 4;
      }
      
      if (criteria.includes('category=strength && complete')) {
        // Check if user has completed a strength category course
        const { ApperClient } = window.ApperSDK;
        const apperClient = new ApperClient({
          apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
          apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
        });

        const params = {
          fields: [
            { field: { Name: "Name" } }
          ],
          where: [
            {
              FieldName: "Owner",
              Operator: "EqualTo",
              Values: [parseInt(userId)]
            },
            {
              FieldName: "category",
              Operator: "EqualTo",
              Values: ["strength"]
            },
            {
              FieldName: "progress",
              Operator: "EqualTo",
              Values: [100]
            }
          ]
        };

        const coursesResponse = await apperClient.fetchRecords('course', params);
        return (coursesResponse.data?.length || 0) > 0;
      }

      return false;
    } catch (error) {
      console.error("Error checking badge eligibility:", error.message);
      return false;
    }
  },

  awardBadge: async (userId, badgeId) => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [{
          Name: `Badge Award ${Date.now()}`,
          userId: parseInt(userId),
          badgeId: parseInt(badgeId),
          earnedAt: new Date().toISOString()
        }]
      };

      const response = await apperClient.createRecord('user_badges', params);

      if (!response.success) {
        console.error(response.message);
        return false;
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);

        if (failedRecords.length > 0) {
          console.error(`Failed to award badge ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          return false;
        }

        if (successfulRecords.length > 0) {
          // Get badge details for notification
          const badge = await badgeService.getBadgeById(badgeId);
          toast.success(`🎉 새로운 배지를 획득했습니다: ${badge?.Name || '배지'}!`);
          return true;
        }
      }

      return false;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error awarding badge:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return false;
    }
  },

  checkAndAwardBadges: async (userId) => {
    try {
      const badges = await badgeService.getAllBadges();
      const awardedBadges = [];

      for (const badge of badges) {
        const isEligible = await userBadgeService.checkBadgeEligibility(userId, badge.Id);
        if (isEligible) {
          const awarded = await userBadgeService.awardBadge(userId, badge.Id);
          if (awarded) {
            awardedBadges.push(badge);
          }
        }
      }

      return awardedBadges;
    } catch (error) {
      console.error("Error checking and awarding badges:", error.message);
      return [];
    }
  },

  removeBadge: async (userId, badgeId) => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Find the user badge record
      const params = {
        fields: [
          { field: { Name: "Name" } }
        ],
        where: [
          {
            FieldName: "userId",
            Operator: "EqualTo",
            Values: [parseInt(userId)]
          },
          {
            FieldName: "badgeId",
            Operator: "EqualTo",
            Values: [parseInt(badgeId)]
          }
        ]
      };

      const response = await apperClient.fetchRecords('user_badges', params);
      
      if (response.success && response.data && response.data.length > 0) {
        const userBadgeId = response.data[0].Id;
        
        const deleteParams = {
          RecordIds: [userBadgeId]
        };

        const deleteResponse = await apperClient.deleteRecord('user_badges', deleteParams);
        
        if (deleteResponse.success) {
          toast.success('배지가 제거되었습니다');
          return true;
        }
      }

      return false;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error removing badge:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return false;
    }
  }
};