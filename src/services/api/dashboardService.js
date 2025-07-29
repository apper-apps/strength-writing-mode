import dashboardData from "@/services/mockData/dashboard.json";

export const dashboardService = {
  getDashboardData: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return { ...dashboardData };
  }
};