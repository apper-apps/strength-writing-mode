import { toast } from 'react-toastify';

export const communityService = {
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
          { field: { Name: "content" } },
          { field: { Name: "authorName" } },
          { field: { Name: "authorRole" } },
          { field: { Name: "timestamp" } },
          { field: { Name: "category" } },
          { field: { Name: "likes" } },
          { field: { Name: "views" } },
          { field: { Name: "replies" } },
          { field: { Name: "authorId" } }
        ]
      };

      const response = await apperClient.fetchRecords('community_post', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      if (!response.data || response.data.length === 0) {
        return [];
      }

      // Parse replies field from JSON
      const posts = response.data.map(post => ({
        ...post,
        replies: post.replies ? (typeof post.replies === 'object' ? post.replies : JSON.parse(post.replies)) : []
      }));

      return [...posts];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching community posts:", error?.response?.data?.message);
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
          { field: { Name: "content" } },
          { field: { Name: "authorName" } },
          { field: { Name: "authorRole" } },
          { field: { Name: "timestamp" } },
          { field: { Name: "category" } },
          { field: { Name: "likes" } },
          { field: { Name: "views" } },
          { field: { Name: "replies" } },
          { field: { Name: "authorId" } }
        ]
      };

      const response = await apperClient.getRecordById('community_post', parseInt(id), params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error("Post not found");
      }

      if (!response.data) {
        throw new Error("Post not found");
      }

      // Parse replies field from JSON
      const post = {
        ...response.data,
        replies: response.data.replies ? (typeof response.data.replies === 'object' ? response.data.replies : JSON.parse(response.data.replies)) : []
      };

      return { ...post };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching post with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw new Error("Post not found");
    }
  },

  create: async (postData) => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [{
          Name: postData.Name || postData.title,
          title: postData.title,
          content: postData.content,
          authorName: postData.authorName,
          authorRole: postData.authorRole,
          timestamp: new Date().toISOString(),
          category: postData.category,
          likes: parseInt(postData.likes) || 0,
          views: parseInt(postData.views) || 0,
          replies: JSON.stringify(postData.replies || []),
          authorId: postData.authorId ? parseInt(postData.authorId?.Id || postData.authorId) : null
        }]
      };

      const response = await apperClient.createRecord('community_post', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create community posts ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulRecords.length > 0) {
          const newPost = successfulRecords[0].data;
          return {
            ...newPost,
            replies: newPost.replies ? JSON.parse(newPost.replies) : []
          };
        }
      }

      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating community post:", error?.response?.data?.message);
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
          content: updateData.content,
          authorName: updateData.authorName,
          authorRole: updateData.authorRole,
          timestamp: updateData.timestamp,
          category: updateData.category,
          likes: updateData.likes !== undefined ? parseInt(updateData.likes) : undefined,
          views: updateData.views !== undefined ? parseInt(updateData.views) : undefined,
          replies: updateData.replies ? JSON.stringify(updateData.replies) : undefined,
          authorId: updateData.authorId ? parseInt(updateData.authorId?.Id || updateData.authorId) : undefined
        }]
      };

      // Remove undefined fields
      Object.keys(params.records[0]).forEach(key => {
        if (params.records[0][key] === undefined) {
          delete params.records[0][key];
        }
      });

      const response = await apperClient.updateRecord('community_post', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error("Post not found");
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update community posts ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulUpdates.length > 0) {
          const updatedPost = successfulUpdates[0].data;
          return {
            ...updatedPost,
            replies: updatedPost.replies ? JSON.parse(updatedPost.replies) : []
          };
        }
      }

      throw new Error("Post not found");
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating community post:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw new Error("Post not found");
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

      const response = await apperClient.deleteRecord('community_post', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error("Post not found");
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete community posts ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulDeletions.length > 0) {
          const deletedPost = successfulDeletions[0].data;
          return {
            ...deletedPost,
            replies: deletedPost.replies ? JSON.parse(deletedPost.replies) : []
          };
        }
      }

      throw new Error("Post not found");
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting community post:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw new Error("Post not found");
    }
  },

  addComment: async (postId, commentData) => {
    try {
      // First get the current post
      const currentPost = await communityService.getById(postId);
      
      if (!currentPost) {
        throw new Error("Post not found");
      }

      // Add new comment to replies array
      const updatedReplies = [...(currentPost.replies || []), commentData];
      
      // Update the post with new replies
      const updatedPost = await communityService.update(postId, {
        replies: updatedReplies
      });

      return updatedPost;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error adding comment:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw new Error("Post not found");
    }
  }
};