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
  }
};