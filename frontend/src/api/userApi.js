import API from "./axios";

export const getUsers = () => API.get("/users");
export const getUserDetails = (id) => API.get(`/users/${id}`);