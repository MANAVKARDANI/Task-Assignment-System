import API from "./axios";

export const getNotifications = () => API.get("/notifications");
export const getNotificationsLimited = (limit) =>
  API.get(`/notifications?limit=${encodeURIComponent(limit)}`);
export const markNotificationAsRead = (id) => API.put(`/notifications/${id}`);
