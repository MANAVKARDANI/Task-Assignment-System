import API from "./axios";

export const getMyTasks = (params) => API.get("/tasks/my", { params });
export const getAllTasks = (params) => API.get("/tasks", { params });
export const getTaskById = (id) => API.get(`/tasks/${id}`);
export const createTask = (data) => API.post("/tasks", data);
export const updateTask = (id, data) => API.put(`/tasks/${id}`, data);
export const deleteTask = (id) => API.delete(`/tasks/${id}`);
export const updateTaskProgress = (id, completedKeywords) =>
  API.put(`/tasks/${id}/progress`, { completedKeywords });