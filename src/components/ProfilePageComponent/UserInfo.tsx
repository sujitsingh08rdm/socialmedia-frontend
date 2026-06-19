import type { userProfileInfoType } from "../../types/userprofile";
import defaultImage from "../../assets/default-profileImage.png";
import { MessageCircle, UserPlus } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";
import { followUser, unFollowUser } from "../../api/userProfile.api";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";

interface UserInfoProps {
  user: userProfileInfoType;
}

function UserInfo({ user }: UserInfoProps) {
  const currentUser = useSelector((state: RootState) => state.auth.user);

  const isOwnProfile = currentUser?.username === user.username;
  const [isFollowing, setIsFollowing] = useState(user.isFollowing);
  const [followersCount, setFollowersCount] = useState(user.followersCount);
  const [loading, setLoading] = useState(false);

  const handleFollowToggle = async () => {
    try {
      setLoading(true);
      if (isFollowing) {
        await unFollowUser(user.username);
        setIsFollowing(false);
        setFollowersCount((prev) => prev - 1);
        toast.success(`You un-followed ${user.username}`);
      } else {
        await followUser(user.username);
        setIsFollowing(true);
        setFollowersCount((prev) => prev + 1);
        toast.success(`You started following ${user.username}`);
      }
    } catch (error: any) {
      toast.error(`${error.message}`);
    } finally {
      setLoading(false);
    }
  };

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
                <strong>{followersCount ?? 0}</strong> Followers
              </span>

              <span>
                <strong>{user.followingCount ?? 0}</strong> Following
              </span>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex  flex-col gap-3">
          {!isOwnProfile && (
            <button
              disabled={loading}
              onClick={handleFollowToggle}
              className={`neo-button  px-2 py-1 flex items-center gap-2 hover:opacity-90 hover:-translate-y-1 transition-transform ${isFollowing ? "bg-red-400" : "bg-button-1"}`}
            >
              <UserPlus size={16} />
              {isFollowing ? "Unfollow" : "Follow"}
            </button>
          )}
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
