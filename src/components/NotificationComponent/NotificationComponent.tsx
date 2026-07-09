import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { AppDispatch, RootState } from "../../store/store";
import {
  getNotification,
  markNotificationsReadApi,
} from "../../api/notification.api";
import {
  markNotificationsRead,
  setNotifications,
} from "../../store/slices/notification.slice";
import NotificationCard from "./NotificationCard";
import Spinner from "../General/Spinner";
import { toast } from "react-toastify";

function NotificationComponent() {
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState(false);
  const unreadCount = useSelector(
    (state: RootState) => state.notification.unreadCount,
  );

  const navigate = useNavigate();

  const notifications = useSelector(
    (state: RootState) => state.notification.notifications,
  );

  const handleMarkAllRead = async () => {
    try {
      setLoading(true);
      const unreadIds = notifications
        .filter((notification) => !notification.isRead)
        .map((notification) => notification._id);

      if (unreadIds.length === 0) return;

      await markNotificationsReadApi(unreadIds);

      dispatch(markNotificationsRead(unreadIds));
      toast.success("Marked All as read");
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadNotifications = async () => {
      setLoading(true);
      const response = await getNotification();

      setLoading(false);
      dispatch(setNotifications(response));
    };

    loadNotifications();
  }, []);

  if (notifications.length === 0) {
    return (
      <div className="min-w-[63vw] p-2 flex-1 flex flex-col user-profile-scroll overflow-y-auto neo-container bg-secondary m-1">
        <h2 className="text-3xl text-center font-black  ml-10">
          🔔 Notifications
        </h2>
        <div className="flex-1 flex justify-center items-center">
          <p className="text-xl font-bold">No notifications yet 🎉</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-w-[63vw] p-2 flex-1 flex flex-col items-center justify-center user-profile-scroll overflow-y-auto neo-container bg-secondary m-1">
        <Spinner size={48} />
      </div>
    );
  }

  return (
    <div className="min-w-[63vw] p-2 flex-1 flex flex-col user-profile-scroll overflow-y-auto neo-container bg-secondary m-1">
      <div className="border-b-2 border-black pb-3">
        <div className="flex justify-between items-center border-black pb-3">
          <h1 className="text-3xl font-black ml-10">Notifications</h1>
          {unreadCount > 0 && (
            <div className="flex items-center gap-3">
              {unreadCount > 0 && (
                <span className="neo-card bg-accent-2 px-3 py-1 font-bold">
                  {unreadCount} Unread
                </span>
              )}

              <button
                onClick={handleMarkAllRead}
                className="neo-button bg-button-1 cursor-pointer"
              >
                Mark all as read
              </button>
            </div>
          )}
        </div>
      </div>
      {notifications.map((notification) => (
        <NotificationCard key={notification._id} notification={notification} />
      ))}
    </div>
  );
}

export default NotificationComponent;
