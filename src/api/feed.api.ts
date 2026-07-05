import api from "../lib/axios";

export const getFeedPost = async () => {
  const response = await api.get("/posts/all-posts");
  return response.data.data;
};

export const searchUser = async (query: string) => {
  const response = await api.get(`/users/search?query=${query}`, {
    withCredentials: true,
  });

  return response.data.data;
};
