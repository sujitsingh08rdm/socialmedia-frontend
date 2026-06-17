import type { userProfileInfoType } from "../../types/userprofile";
import defaultImage from "../../assets/default-profileImage.png";
import { MessageCircle, UserPlus } from "lucide-react";

interface UserInfoProps {
  user: userProfileInfoType;
}

function UserInfo({ user }: UserInfoProps) {
  console.log(user);

  return (
    <div className="neo-container bg-accent-1 p-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          <img
            src={user.profileImage || defaultImage}
            alt={user.username}
            className="w-18 h-18 md:w-20 md:h-20 rounded-full border-4 border-black object-cover bg-white"
          />

          <div>
            <p className="font-semibold text-gray-700">@{user.username}</p>

            <p className="text-sm text-gray-600 break-all">{user.email}</p>
            <p>{user.bio}</p>

            {/* Stats */}
            <div className="flex flex-wrap gap-4 mt-2 text-sm">
              <span>
                <strong>{user.postCount ?? 0}</strong> Posts
              </span>

              <span>
                <strong>{user.followersCount ?? 0}</strong> Followers
              </span>

              <span>
                <strong>{user.followingCount ?? 0}</strong> Following
              </span>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex  flex-col gap-3">
          <button className="neo-button bg-button-1 px-2 py-1 flex items-center gap-2 hover:-translate-y-1 transition-transform">
            <UserPlus size={16} />
            Follow
          </button>

          <button className="neo-button bg-button-2 px-2 py-1 flex items-center gap-2 hover:-translate-y-1 transition-transform">
            <MessageCircle size={16} />
            Message
          </button>
        </div>
      </div>
    </div>
  );
}

export default UserInfo;
