import coursesData from "@/services/mockData/courses.json";

export const coursesService = {
  getAll: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...coursesData];
  },

  getById: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const course = coursesData.find(item => item.Id === id);
    if (!course) {
      throw new Error("Course not found");
    }
    return { ...course };
  },

  create: async (courseData) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    const newId = Math.max(...coursesData.map(c => c.Id)) + 1;
    const newCourse = { Id: newId, ...courseData };
    coursesData.push(newCourse);
    return { ...newCourse };
  },

  update: async (id, updateData) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = coursesData.findIndex(item => item.Id === id);
    if (index === -1) {
      throw new Error("Course not found");
    }
    coursesData[index] = { ...coursesData[index], ...updateData };
    return { ...coursesData[index] };
  },

  delete: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = coursesData.findIndex(item => item.Id === id);
    if (index === -1) {
      throw new Error("Course not found");
    }
    const deleted = coursesData.splice(index, 1)[0];
    return { ...deleted };
  },

  // Bookmark functionality
  getBookmarks: async () => {
    await new Promise(resolve => setTimeout(resolve, 100));
    const bookmarks = JSON.parse(localStorage.getItem('courseBookmarks') || '[]');
    return bookmarks.map(id => coursesData.find(course => course.Id === id)).filter(Boolean);
  },

  addBookmark: async (courseId) => {
    await new Promise(resolve => setTimeout(resolve, 150));
    const bookmarks = JSON.parse(localStorage.getItem('courseBookmarks') || '[]');
    if (!bookmarks.includes(courseId)) {
      bookmarks.push(courseId);
      localStorage.setItem('courseBookmarks', JSON.stringify(bookmarks));
    }
    return { success: true };
  },

  removeBookmark: async (courseId) => {
    await new Promise(resolve => setTimeout(resolve, 150));
    const bookmarks = JSON.parse(localStorage.getItem('courseBookmarks') || '[]');
    const updatedBookmarks = bookmarks.filter(id => id !== courseId);
    localStorage.setItem('courseBookmarks', JSON.stringify(updatedBookmarks));
    return { success: true };
  },

  isBookmarked: (courseId) => {
    const bookmarks = JSON.parse(localStorage.getItem('courseBookmarks') || '[]');
    return bookmarks.includes(courseId);
  }
};