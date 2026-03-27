import API from "./axios";

export const getMyProfile = () => API.get("/profile/me");

export const updateMyProfile = (formData) =>
  API.put("/profile/me", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

