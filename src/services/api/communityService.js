import communityData from "@/services/mockData/community.json";

export const communityService = {
  getAll: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...communityData];
  },

  getById: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const post = communityData.find(item => item.Id === id);
    if (!post) {
      throw new Error("Post not found");
    }
    return { ...post };
  },

  create: async (postData) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    const newId = Math.max(...communityData.map(p => p.Id)) + 1;
    const newPost = { 
      Id: newId, 
      ...postData,
      timestamp: new Date().toISOString(),
      likes: 0,
      replies: []
    };
    communityData.push(newPost);
    return { ...newPost };
  },

  update: async (id, updateData) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = communityData.findIndex(item => item.Id === id);
    if (index === -1) {
      throw new Error("Post not found");
    }
    communityData[index] = { ...communityData[index], ...updateData };
    return { ...communityData[index] };
  },

delete: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = communityData.findIndex(item => item.Id === id);
    if (index === -1) {
      throw new Error("Post not found");
    }
    const deleted = communityData.splice(index, 1)[0];
    return { ...deleted };
  },

  addComment: async (postId, commentData) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    const postIndex = communityData.findIndex(item => item.Id === postId);
    if (postIndex === -1) {
      throw new Error("Post not found");
    }

    if (!communityData[postIndex].replies) {
      communityData[postIndex].replies = [];
    }

    communityData[postIndex].replies.push(commentData);
    return { ...communityData[postIndex] };
  }
};