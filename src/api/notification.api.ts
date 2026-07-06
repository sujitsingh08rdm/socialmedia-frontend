import api from "../lib/axios";

export const getNotification = async () => {
  const res = await api.get("/notification/");

  return res.data.data;
};

export const markNotificationsReadApi = async (notificationIds: string[]) => {
  const res = await api.patch("/notification/read", { notificationIds });

  return res.data.data;
};
