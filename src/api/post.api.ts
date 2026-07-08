import api from "../lib/axios";

export const createPost = async (formData: FormData) => {
  const response = await api.post("/posts/create-post", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response;
};

export const deletePost = async (postId: string) => {
  const response = await api.delete(`/posts/delete-post/${postId}`);
  return response.data;
};

export const editPost = async (formData: FormData, postId: string) => {
  const response = await api.patch(
    `/posts/update-post-content/${postId}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return response;
};

export const getUserPostById = async (postId: string) => {
  const response = await api.get(`/posts/${postId}`);

  return response.data.data;
};
