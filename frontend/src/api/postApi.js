import API from "./axios";

export const getPosts = () => API.get("/posts");
export const createPost = (name) => API.post("/posts", { name });
export const deletePost = (id) => API.delete(`/posts/${id}`);

