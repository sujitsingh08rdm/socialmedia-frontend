import api from "../lib/axios";

export const createPost = async (formData: FormData) => {
  const response = await api.post("/posts/create-post", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  console.log(response, "<- from create post");

  return response;
};
