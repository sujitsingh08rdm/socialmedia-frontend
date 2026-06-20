import api from "../lib/axios";

export const getFeedPost = async () => {
  const response = await api.get("/posts/all-posts");
  return response.data.data;
};
