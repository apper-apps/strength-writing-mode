import { toast } from 'react-toastify';

export const coursesService = {
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
          { field: { Name: "title" } },
          { field: { Name: "description" } },
          { field: { Name: "videoId" } },
          { field: { Name: "requiredRole" } },
          { field: { Name: "duration" } },
          { field: { Name: "enrolledCount" } },
          { field: { Name: "progress" } },
          { field: { Name: "category" } },
          { field: { Name: "instructor" } },
          { field: { Name: "level" } }
        ]
      };

      const response = await apperClient.fetchRecords('course', params);

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
        console.error("Error fetching courses:", error?.response?.data?.message);
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
          { field: { Name: "title" } },
          { field: { Name: "description" } },
          { field: { Name: "videoId" } },
          { field: { Name: "requiredRole" } },
          { field: { Name: "duration" } },
          { field: { Name: "enrolledCount" } },
          { field: { Name: "progress" } },
          { field: { Name: "category" } },
          { field: { Name: "instructor" } },
          { field: { Name: "level" } }
        ]
      };

      const response = await apperClient.getRecordById('course', parseInt(id), params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error("Course not found");
      }

      if (!response.data) {
        throw new Error("Course not found");
      }

      return { ...response.data };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching course with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw new Error("Course not found");
    }
  },

  create: async (courseData) => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [{
          Name: courseData.Name || courseData.title,
          title: courseData.title,
          description: courseData.description,
          videoId: courseData.videoId,
          requiredRole: courseData.requiredRole,
          duration: parseInt(courseData.duration),
          enrolledCount: parseInt(courseData.enrolledCount) || 0,
          progress: parseInt(courseData.progress) || 0,
          category: courseData.category,
          instructor: courseData.instructor,
          level: courseData.level
        }]
      };

      const response = await apperClient.createRecord('course', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create courses ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
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
        console.error("Error creating course:", error?.response?.data?.message);
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
          Name: updateData.Name || updateData.title,
          title: updateData.title,
          description: updateData.description,
          videoId: updateData.videoId,
          requiredRole: updateData.requiredRole,
          duration: updateData.duration !== undefined ? parseInt(updateData.duration) : undefined,
          enrolledCount: updateData.enrolledCount !== undefined ? parseInt(updateData.enrolledCount) : undefined,
          progress: updateData.progress !== undefined ? parseInt(updateData.progress) : undefined,
          category: updateData.category,
          instructor: updateData.instructor,
          level: updateData.level
        }]
      };

      // Remove undefined fields
      Object.keys(params.records[0]).forEach(key => {
        if (params.records[0][key] === undefined) {
          delete params.records[0][key];
        }
      });

      const response = await apperClient.updateRecord('course', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error("Course not found");
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update courses ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
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

      throw new Error("Course not found");
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating course:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw new Error("Course not found");
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

      const response = await apperClient.deleteRecord('course', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error("Course not found");
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete courses ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulDeletions.length > 0) {
          return successfulDeletions[0].data;
        }
      }

      throw new Error("Course not found");
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting course:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw new Error("Course not found");
    }
  },

  // Bookmark functionality - using localStorage for user-specific bookmarks
  getBookmarks: async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 100));
      const bookmarks = JSON.parse(localStorage.getItem('courseBookmarks') || '[]');
      const courses = await coursesService.getAll();
      return bookmarks.map(id => courses.find(course => course.Id === id)).filter(Boolean);
    } catch (error) {
      console.error("Error fetching bookmarks:", error.message);
      return [];
    }
  },

  addBookmark: async (courseId) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 150));
      const bookmarks = JSON.parse(localStorage.getItem('courseBookmarks') || '[]');
      if (!bookmarks.includes(courseId)) {
        bookmarks.push(courseId);
        localStorage.setItem('courseBookmarks', JSON.stringify(bookmarks));
      }
      return { success: true };
    } catch (error) {
      console.error("Error adding bookmark:", error.message);
      return { success: false };
    }
  },

  removeBookmark: async (courseId) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 150));
      const bookmarks = JSON.parse(localStorage.getItem('courseBookmarks') || '[]');
      const updatedBookmarks = bookmarks.filter(id => id !== courseId);
      localStorage.setItem('courseBookmarks', JSON.stringify(updatedBookmarks));
      return { success: true };
    } catch (error) {
      console.error("Error removing bookmark:", error.message);
      return { success: false };
    }
  },

  isBookmarked: (courseId) => {
    try {
      const bookmarks = JSON.parse(localStorage.getItem('courseBookmarks') || '[]');
      return bookmarks.includes(courseId);
    } catch (error) {
      console.error("Error checking bookmark status:", error.message);
      return false;
    }
  },

  // Progress tracking functionality - using localStorage for user-specific progress
  updateProgress: async (courseId, progress) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // Validate progress value
      const validProgress = Math.max(0, Math.min(100, Math.round(progress)));
      
      // Get current progress data
      const progressData = JSON.parse(localStorage.getItem('courseProgress') || '{}');
      progressData[courseId] = validProgress;
      
      // Save to localStorage
      localStorage.setItem('courseProgress', JSON.stringify(progressData));
      
      // Also try to update in database
      try {
        await coursesService.update(courseId, { progress: validProgress });
      } catch (dbError) {
        console.error("Could not update progress in database:", dbError.message);
      }
      
      return { success: true, progress: validProgress };
    } catch (error) {
      console.error("Error updating progress:", error.message);
      return { success: false, progress: 0 };
    }
  },

  getProgress: (courseId) => {
    try {
      const progressData = JSON.parse(localStorage.getItem('courseProgress') || '{}');
      return progressData[courseId] || 0;
    } catch (error) {
      console.error("Error getting progress:", error.message);
      return 0;
    }
  },

  // Simulate progress update for demonstration
  simulateProgress: async (courseId) => {
    try {
      const currentProgress = coursesService.getProgress(courseId);
      const increment = Math.floor(Math.random() * 15) + 5; // 5-20% increment
      const newProgress = Math.min(100, currentProgress + increment);
      
      return await coursesService.updateProgress(courseId, newProgress);
    } catch (error) {
      console.error("Error simulating progress:", error.message);
      return { success: false, progress: 0 };
    }
  },

  // Initialize progress from localStorage
  initializeProgress: () => {
    try {
      const progressData = JSON.parse(localStorage.getItem('courseProgress') || '{}');
      // This is now handled per-course basis as courses are loaded from database
      return progressData;
    } catch (error) {
      console.error("Error initializing progress:", error.message);
      return {};
    }
  }
};

// Initialize progress on service load
coursesService.initializeProgress();