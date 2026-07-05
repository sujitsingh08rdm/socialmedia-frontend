import api from "../lib/axios";

// export const getMyFollowers = async () => {
//   const res = await api.get("/users/get-followers", { withCredentials: true });

//   return res.data.data;
// };

export const getUserConversations = async () => {
  const res = await api.get("/chats/conversations");

  return res.data.data;
};

export const getOrCreateConversation = async (receiverId: string) => {
  const res = await api.post("/chats/conversation", { receiverId });

  return res.data.data;
};

export const getMessage = async (conversationId: string) => {
  const res = await api.get(`/chats/messages/${conversationId}`);

  return res.data.data;
};

export const sendMessage = async (data: FormData) => {
  const res = await api.post(`/chats/message`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data.data;
};

export const markSeen = async (conversationId: string) => {
  const res = await api.patch(`/chats/seen/${conversationId}`);

  return res.data.data;
};
