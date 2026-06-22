import { useEffect, useState } from "react";
import UserInfo from "./UserInfo";
import type { userProfileInfoType } from "../../types/userprofile";
import {
  getUserProfileInfo,
  getUserProfilePosts,
} from "../../api/userProfile.api";
import { Link, useParams } from "react-router-dom";
import Spinner from "../General/Spinner";
import UserPosts from "../ProfilePageComponent/UserPosts";
import type { UserPostType } from "../../types/userpost";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import { PlusSquareIcon } from "lucide-react";

function UserProfileContainer() {
  const [userProfileInfo, setUserProfileInfo] =
    useState<userProfileInfoType | null>(null);
  const { username } = useParams<{ username: string }>();
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const [loading, setLoading] = useState<boolean>(true);
  const [postLoading, setPostLoading] = useState<boolean>(true);
  const [userPosts, setUserPosts] = useState<UserPostType[]>([]);

  const refetchProfile = async () => {
    if (!username) return;
    try {
      const userProfileInfo = await getUserProfileInfo(username);
      setUserProfileInfo(userProfileInfo);
    } catch (error) {
      console.log("Failed to fetch Profile", error);
    }
  };

  // useEffect(() => {
  //   const init = async () => {
  //     setLoading(true);
  //     await refetchProfile();
  //     setLoading(false);
  //   };
  //   init();
  // }, [username]);

  useEffect(() => {
    if (!username) {
      setLoading(false);
      return;
    }
    const getUserProfileData = async () => {
      try {
        const userProfileInfo = await getUserProfileInfo(username);
        setUserProfileInfo(userProfileInfo);
      } catch (error) {
        console.log("failed to fetch profile ", error);
      } finally {
        setLoading(false);
      }
    };
    getUserProfileData();
  }, [username]);

  useEffect(() => {
    const getUserPosts = async () => {
      try {
        if (!username) {
          setPostLoading(false);
          return;
        }
        const response = await getUserProfilePosts(username);

        setUserPosts(response);
      } catch (error) {
        console.log("Failed to fetch profile", error);
      } finally {
        setPostLoading(false);
      }
    };

    getUserPosts();
  }, [username]);

  if (loading) {
    return (
      <div className="min-w-[63vw]">
        <Spinner size={58} />
      </div>
    );
  }

  if (!userProfileInfo) {
    return <div className="min-w-[63vw]">user not found</div>;
  }

  return (
    <div className="min-w-[63vw] p-2 flex flex-col user-profile-scroll overflow-y-auto">
      <UserInfo user={userProfileInfo} refetchProfile={refetchProfile} />
      {currentUser?.username === username && (
        <Link
          to="/upload-post"
          className="flex flex-row justify-between items-center gap-2 neo-button bg-accent-2 hover:scale-101 w-[25%]"
        >
          <span> Upload post </span>
          <PlusSquareIcon />
        </Link>
      )}

      {postLoading ? <Spinner /> : <UserPosts userPosts={userPosts} />}
    </div>
  );
}

export default UserProfileContainer;
