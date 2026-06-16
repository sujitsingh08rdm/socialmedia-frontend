import api from "../lib/axios";

export const getUserProfileInfo = async (username: string) => {
  const response = await api.get(`/users/get-user-profile-data/${username}`);
  console.log(response.data.data);
  return response.data.data;
};
