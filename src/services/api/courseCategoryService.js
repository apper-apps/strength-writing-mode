import { toast } from 'react-toastify';

export const courseCategoryService = {
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
          { field: { Name: "label" } }
        ]
      };

      const response = await apperClient.fetchRecords('course_category', params);

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
        console.error("Error fetching course categories:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  },

  getById: async (id) => {
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
          { field: { Name: "label" } }
        ]
      };

      const response = await apperClient.getRecordById('course_category', parseInt(id), params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error("Course category not found");
      }

      if (!response.data) {
        throw new Error("Course category not found");
      }

      return { ...response.data };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching course category with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw new Error("Course category not found");
    }
  },

  create: async (categoryData) => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [{
          Name: categoryData.Name || categoryData.slug,
          slug: categoryData.slug,
          label: categoryData.label
        }]
      };

      const response = await apperClient.createRecord('course_category', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create course categories ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulRecords.length > 0) {
          return successfulRecords[0].data;
        }
      }

      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating course category:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  },

  update: async (id, updateData) => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [{
          Id: parseInt(id),
          Name: updateData.Name || updateData.slug,
          slug: updateData.slug,
          label: updateData.label
        }]
      };

      // Remove undefined fields
      Object.keys(params.records[0]).forEach(key => {
        if (params.records[0][key] === undefined) {
          delete params.records[0][key];
        }
      });

      const response = await apperClient.updateRecord('course_category', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error("Course category not found");
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update course categories ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
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

      throw new Error("Course category not found");
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating course category:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw new Error("Course category not found");
    }
  },

  delete: async (id) => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await apperClient.deleteRecord('course_category', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error("Course category not found");
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete course categories ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulDeletions.length > 0) {
          return successfulDeletions[0].data;
        }
      }

      throw new Error("Course category not found");
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting course category:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw new Error("Course category not found");
    }
  }
};