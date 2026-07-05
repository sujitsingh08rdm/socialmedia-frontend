import React from "react";

import defaultImage from "../../assets/default-profileImage.png";
import { formatMessageTime } from "../../utils/formatMessageTime";
import { useNavigate } from "react-router-dom";
import type { Notification } from "../../types/notification";

interface NotificationCardProps {
  notification: Notification;
}

function NotificationCard({ notification }: NotificationCardProps) {
  const navigate = useNavigate();

  return (
    <div
      className={`
  neo-card
  p-3
  m-2
  cursor-pointer
  transition-all
  hover:translate-x-1
  ${
    notification.isRead
      ? "bg-accent-1 opacity-90"
      : "bg-accent-2 border-2 border-black shadow-[6px_6px_0px_#000]"
  }
`}
      onClick={() => {
        navigate(`/post/${notification.post._id}`);
      }}
    >
      <div className="flex gap-4 items-center">
        <div className="relative">
          <img
            className="w-10 h-10 rounded-full object-cover border-2 border-black"
            src={
              notification.sender.profileImage
                ? notification.sender.profileImage
                : defaultImage
            }
          />
        </div>
        <div className="flex-1">
          <p
            className={`${notification.isRead ? "text-gray-700" : "font-bold"}`}
          >
            <span className="font-black">{notification.sender.username}</span>{" "}
            liked your post ❤️
          </p>
        </div>
        <p
          className={`text-xs ${
            notification.isRead ? "text-gray-600" : "font-bold"
          }`}
        >
          {formatMessageTime(notification.createdAt)}
        </p>
      </div>
    </div>
  );
}

export default NotificationCard;
