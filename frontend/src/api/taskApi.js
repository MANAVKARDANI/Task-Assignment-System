import API from "./axios";

export const getMyTasks = () => API.get("/tasks/my");
export const getAllTasks = () => API.get("/tasks");
export const createTask = (data) => API.post("/tasks", data);
export const updateTask = (id, data) => API.put(`/tasks/${id}`, data);