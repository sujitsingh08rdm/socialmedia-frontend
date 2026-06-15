import api from "../lib/axios";

export const toggleLikePost = async (postId: string) => {
  const response = await api.post(`/likes/post/${postId}/toggle-like`);
  console.log("toggle like triggered");

  return response.data;
};
