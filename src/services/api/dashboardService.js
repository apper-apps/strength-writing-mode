import dashboardData from "@/services/mockData/dashboard.json";
import userProfileData from "@/services/mockData/userProfile.json";

export const dashboardService = {
  getDashboardData: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return { ...dashboardData };
  }
};

export const userService = {
  getUserProfile: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return { ...userProfileData };
  },
  
  updateProfile: async (profileData) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return { ...userProfileData, ...profileData };
  },
  
  getAchievements: async () => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return userProfileData.achievements || [];
  },
  
  getBadges: async () => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return userProfileData.badges || [];
  }
};