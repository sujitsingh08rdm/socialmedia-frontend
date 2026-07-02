import api from "../lib/axios";

export const getMyFollowers = async () => {
  const res = await api.get("/users/get-followers", { withCredentials: true });

  return res.data.data;
};
