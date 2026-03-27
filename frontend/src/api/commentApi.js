import API from "./axios";

export const addComment = (task_id, comment) =>
  API.post("/comments", { task_id, comment });

