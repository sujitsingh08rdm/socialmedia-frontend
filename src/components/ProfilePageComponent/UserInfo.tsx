import type { userProfileInfoType } from "../../types/userprofile";
import defaultImage from "../../assets/default-profileImage.png";
import {
  MessageCircle,
  Pencil,
  Plus,
  PlusSquare,
  Trash,
  UserPlus,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import {
  addBio,
  deleteBio,
  followUser,
  getUserProfileInfo,
  unFollowUser,
  updateBio,
  updateProfileImage,
} from "../../api/userProfile.api";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import Spinner from "../General/Spinner";
import { setUser } from "../../store/slices/auth.slice";
import { useNavigate } from "react-router-dom";
import { getOrCreateConversation } from "../../api/chat.api";

interface UserInfoProps {
  user: userProfileInfoType;
  refetchProfile?: () => void; //optional if you want to refetch after upload.
}

function UserInfo({ user, refetchProfile }: UserInfoProps) {
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();
  console.log(currentUser, "<- currentUser");

  const isOwnProfile = currentUser?.username === user.username;

  const [isFollowing, setIsFollowing] = useState(user.isFollowing);
  const [followersCount, setFollowersCount] = useState(user.followersCount);
  const [loading, setLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isEditingBio, setIsEditingBio] = useState<boolean>(false);
  const [bioInput, setBioInput] = useState(user.bio || "");
  const [bioLoading, setBioLoading] = useState(false);

  const navigate = useNavigate();

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

  const handleImagePick = () => {
    fileInputRef.current?.click();
  };

  const handleProfileImageChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an valid image file");
      return;
    }

    const formData = new FormData();
    formData.append("profileImage", file);

    try {
      setImageUploading(true);
      await updateProfileImage(formData);

      const profile = await getUserProfileInfo(currentUser!.username);

      toast.success("Profile image updated");

      dispatch(
        setUser({
          ...currentUser!,
          profileImage: profile.profileImage,
        }),
      );

      //reftech profile image
      refetchProfile?.();
    } catch (error: any) {
      toast.error(error?.message || "Failed to update profile image");
    } finally {
      setImageUploading(false);
    }
  };

  const handleBioSave = async () => {
    if (!bioInput.trim()) {
      toast.error("Bio Cannot be empty");
      return;
    }

    try {
      setBioLoading(true);
      if (!user.bio) {
        await addBio(bioInput.trim());
        toast.success("Bio Added");
      } else {
        await updateBio(bioInput.trim());
        toast.success("Bio Updated");
      }
      setIsEditingBio(false);
      refetchProfile?.();
    } catch (error: any) {
      toast.error(error.message || "Something went wrong with adding bio");
    } finally {
      setBioLoading(false);
    }
  };
  const handleBioDelete = async () => {
    try {
      setBioLoading(true);

      await deleteBio();

      toast.success("Bio removed");

      setBioInput("");
      setIsEditingBio(false);

      refetchProfile?.();
    } catch (error: any) {
      toast.error(error.message || "Failed to remove bio");
    } finally {
      setBioLoading(false);
    }
  };

  const handleMessage = async () => {
    try {
      await getOrCreateConversation(user._id);
      navigate(`/chat/${user.username}/rcid/${user._id}`);
    } catch (error) {
      toast.error("Failed to start conversation");
    }
  };

  useEffect(() => {
    setBioInput(user.bio || "");
  }, [user.bio]);

  return (
    <div className="neo-container bg-accent-1 p-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          {/* {isOwnProfile ? "Can Edit" : "No edit"} */}
          <div className="relative">
            <img
              src={user.profileImage || defaultImage}
              alt={user.username}
              className="w-18 h-18 md:w-20 md:h-20 rounded-full border-4 border-black object-cover bg-white"
            />
            {isOwnProfile && (
              <button
                className="absolute
        -bottom-1
        -right-1
        bg-accent-2
        border-2
        w-8
        h-8
        flex 
        items-center justify-center
        border-black
        p-2
        rounded-full
        shadow-[1px_1px_0px_0px_#000]
        hover:translate-x-[2px]
        hover:translate-y-[2px]
        hover:shadow-none
        transition-all
        disabled:opacity-50 "
                disabled={imageUploading}
                onClick={handleImagePick}
                title="Change Profile Image"
              >
                {imageUploading ? (
                  <Spinner size={14} />
                ) : (
                  <Pencil size={14} className="text-black" />
                )}
              </button>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              hidden
              onChange={handleProfileImageChange}
            />
          </div>

          <div>
            <p className="font-semibold text-gray-700">@{user.username}</p>

            <p className="text-sm text-gray-600 break-all">{user.email}</p>
            <div className="neo-container flex flex-col p-1 bg-accent-2">
              <p className="font-medium">Bio</p>
              {user.bio ? (
                isEditingBio ? (
                  <div className="neo-container bg-accent-1 flex flex-row">
                    <input
                      value={bioInput}
                      className="neo-input neo-input:focus bg-accent-2"
                      type="text"
                      placeholder="Enter Bio"
                      onChange={(e) => setBioInput(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={handleBioSave}
                      disabled={bioLoading}
                      className="neo-button p-0.5 md:p-1 bg-button-1 hover-bg-button-1 ease-in-out text-sm font-bold cursor-pointer"
                    >
                      {bioLoading ? "Saving.." : user.bio ? "Update" : "Add"}
                    </button>
                    <button
                      type="button"
                      onClick={handleBioDelete}
                      disabled={bioLoading}
                      className="neo-button p-0.5 md:p-1 bg-red-400 hover-bg-button-1 ease-in-out text-sm font-bold cursor-pointer"
                    >
                      <Trash size={24} />
                    </button>
                  </div>
                ) : (
                  <div className="neo-container bg-accent-1">
                    <div className="flex neo-card py-2.5 bg-accent-2 w-full justify-between items-center">
                      <p className="text-sm">{user.bio}</p>
                      {isOwnProfile && (
                        <Pencil
                          onClick={() => setIsEditingBio((prev) => !prev)}
                          size={16}
                          className="cursor-pointer"
                        />
                      )}
                    </div>
                  </div>
                )
              ) : isOwnProfile ? (
                isEditingBio ? (
                  <div className="neo-container bg-accent-1  flex flex-row">
                    <input
                      value={bioInput}
                      className="neo-input neo-input:focus bg-accent-2"
                      type="text"
                      placeholder="Enter Bio"
                      onChange={(e) => setBioInput(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={handleBioSave}
                      disabled={bioLoading}
                      className="neo-button p-0.5 md:p-1 bg-button-1 hover-bg-button-1 ease-in-out text-sm font-bold cursor-pointer"
                    >
                      {bioLoading ? "Saving.." : user.bio ? "Update" : "Add"}
                    </button>
                  </div>
                ) : (
                  <div className="neo-container bg-accent-1">
                    <div className="flex neo-card py-2.5 bg-accent-2 w-full justify-between items-center">
                      <p className="text-sm">No Bio Added</p>
                      {isOwnProfile && (
                        <PlusSquare
                          onClick={() => setIsEditingBio((prev) => !prev)}
                          size={24}
                          className="cursor-pointer"
                        />
                      )}
                    </div>
                  </div>
                )
              ) : (
                <div className="neo-container bg-accent-1">No Bio Added</div>
              )}
            </div>
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
          {!isOwnProfile && (
            <button
              onClick={handleMessage}
              className="neo-button bg-button-2 px-2 py-1 flex items-center gap-2 hover:-translate-y-1 transition-transform"
            >
              <MessageCircle size={16} />
              Message
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserInfo;
