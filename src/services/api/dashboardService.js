import { toast } from 'react-toastify';

export const dashboardService = {
  getDashboardData: async () => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "user" } },
          { field: { Name: "stats" } },
          { field: { Name: "recentCourses" } },
          { field: { Name: "communityHighlights" } }
        ]
      };

      const response = await apperClient.fetchRecords('dashboard', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return { user: {}, stats: {}, recentCourses: [], communityHighlights: [] };
      }

      if (!response.data || response.data.length === 0) {
        return { user: {}, stats: {}, recentCourses: [], communityHighlights: [] };
      }

      const dashboard = response.data[0];
      
      // Parse JSON fields
      const stats = dashboard.stats ? JSON.parse(dashboard.stats) : {};
      const recentCourses = dashboard.recentCourses ? JSON.parse(dashboard.recentCourses) : [];
      const communityHighlights = dashboard.communityHighlights ? JSON.parse(dashboard.communityHighlights) : [];
      const user = dashboard.user ? (typeof dashboard.user === 'object' ? dashboard.user : JSON.parse(dashboard.user)) : {};

      return {
        user,
        stats,
        recentCourses,
        communityHighlights
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching dashboard data:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return { user: {}, stats: {}, recentCourses: [], communityHighlights: [] };
    }
  }
};

export const userService = {
  getUserProfile: async () => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "user" } },
          { field: { Name: "stats" } },
          { field: { Name: "completedCourses" } },
          { field: { Name: "inProgressCourses" } },
          { field: { Name: "badges" } },
          { field: { Name: "achievements" } }
        ]
      };

      const response = await apperClient.fetchRecords('user_profile', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return { user: {}, stats: {}, completedCourses: [], inProgressCourses: [], badges: [], achievements: [] };
      }

      if (!response.data || response.data.length === 0) {
        return { user: {}, stats: {}, completedCourses: [], inProgressCourses: [], badges: [], achievements: [] };
      }

      const profile = response.data[0];
      
      // Parse JSON fields
      const user = profile.user ? (typeof profile.user === 'object' ? profile.user : JSON.parse(profile.user)) : {};
      const stats = profile.stats ? JSON.parse(profile.stats) : {};
      const completedCourses = profile.completedCourses ? JSON.parse(profile.completedCourses) : [];
      const inProgressCourses = profile.inProgressCourses ? JSON.parse(profile.inProgressCourses) : [];
      const badges = profile.badges ? JSON.parse(profile.badges) : [];
      const achievements = profile.achievements ? JSON.parse(profile.achievements) : [];

      return {
        user,
        stats,
        completedCourses,
        inProgressCourses,
        badges,
        achievements
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching user profile:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return { user: {}, stats: {}, completedCourses: [], inProgressCourses: [], badges: [], achievements: [] };
    }
  },

  updateProfile: async (profileData) => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [{
          Name: profileData.Name || profileData.name,
          user: typeof profileData === 'object' ? JSON.stringify(profileData) : profileData
        }]
      };

      const response = await apperClient.updateRecord('user_profile', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return profileData;
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update profile ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulUpdates.length > 0) {
          return successfulUpdates[0].data;
        }
      }

      return profileData;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating profile:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return profileData;
    }
  },

  getAchievements: async () => {
    try {
      const profile = await userService.getUserProfile();
      return profile.achievements || [];
    } catch (error) {
      console.error("Error fetching achievements:", error.message);
      return [];
    }
  },

getBadges: async () => {
    try {
      const profile = await userService.getUserProfile();
      return profile.badges || [];
    } catch (error) {
      console.error("Error fetching badges:", error.message);
      return [];
    }
  }
};