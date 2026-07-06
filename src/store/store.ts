import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/auth.slice";
import chatReducer from "./slices/chat.slice";
import notificationReducer from "./slices/notification.slice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    chat: chatReducer,
    notification: notificationReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
