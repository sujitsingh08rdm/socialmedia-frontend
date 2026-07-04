import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Conversation, Message } from "../../types/chat";

interface ChatState {
  conversations: Conversation[];
  messages: Message[];
}

const initialState: ChatState = {
  conversations: [],
  messages: [],
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setConversations(state, action: PayloadAction<Conversation[]>) {
      state.conversations = action.payload;
    },
    setMessages(state, action: PayloadAction<Message[]>) {
      state.messages = action.payload;
    },
    addMessage(state, action: PayloadAction<Message>) {
      const exists = state.messages.find((m) => m._id === action.payload._id);

      if (!exists) {
        state.messages.push(action.payload);
      }
    },
    updateConversation(state, action: PayloadAction<Conversation>) {
      const updatedConversation = action.payload;

      const index = state.conversations.findIndex(
        (c) => c._id === updatedConversation._id,
      );

      if (index !== -1) {
        state.conversations[index] = updatedConversation;
      } else {
        state.conversations.unshift(updatedConversation);
      }
    },
  },
});

export const { setConversations, setMessages, addMessage, updateConversation } =
  chatSlice.actions;

export default chatSlice.reducer;
