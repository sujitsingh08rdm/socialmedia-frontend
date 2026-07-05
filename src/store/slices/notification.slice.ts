import {
  configureStore,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type { Notification } from "../../types/notification";

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
}

const initialState: NotificationState = {
  notifications: [],
  unreadCount: 0,
};

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<Notification>) => {
      state.notifications.unshift(action.payload);
      state.unreadCount += 1;
    },

    setNotifications: (state, action: PayloadAction<Notification[]>) => {
      state.notifications = action.payload;

      state.unreadCount = action.payload.filter(
        (notification) => !notification.isRead,
      ).length;
    },

    markAllRead: (state) => {
      state.notifications = state.notifications.map((notification) => ({
        ...notification,
        isRead: true,
      }));

      state.unreadCount = 0;
    },

    markNotificationsRead: (state, action: PayloadAction<string[]>) => {
      state.notifications = state.notifications.map((notification) => {
        if (action.payload.includes(notification._id)) {
          return {
            ...notification,
            isRead: true,
          };
        }

        return notification;
      });

      state.unreadCount = state.notifications.filter(
        (notification) => !notification.isRead,
      ).length;
    },
    clearNotifications: (state) => {
      state.notifications = [];
      state.unreadCount = 0;
    },
  },
});

export const {
  addNotification,
  setNotifications,
  markAllRead,
  markNotificationsRead,
  clearNotifications,
} = notificationSlice.actions;

export default notificationSlice.reducer;
