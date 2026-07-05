import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/auth.slice";
import chatReducer from "./slices/chat.slice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    chat: chatReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
