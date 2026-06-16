import React, { useEffect, useState } from "react";
import UserInfo from "./UserInfo";
import type { userProfileInfoType } from "../../types/userprofile";
import {
  getUserProfileInfo,
  getUserProfilePosts,
} from "../../api/userProfile.api";
import { useParams } from "react-router-dom";
import Spinner from "../General/Spinner";
import UserPosts from "../ProfilePageComponent/UserPosts";

function UserProfileContainer() {
  const [userProfileInfo, setUserProfileInfo] =
    useState<userProfileInfoType | null>(null);
  const { username } = useParams<{ username: string }>();
  const [loading, setLoading] = useState<boolean>(true);
  const [postLoading, setPostLoading] = useState<boolean>(true);
  const [userPosts, setUserPosts] = useState(null);

  useEffect(() => {
    if (!username) return;
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
        if (!username) return;
        const response = await getUserProfilePosts(username);
        console.log("from use effect -> ", response);

        setUserPosts(response);
      } catch (error) {
        console.log("Failed to fetch profile", error);
      } finally {
        setPostLoading(false);
      }
    };

    getUserPosts();
  }, []);

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
    <div className="min-w-[63vw] flex flex-col">
      <UserInfo user={userProfileInfo} />
      <UserPosts userPosts={userPosts} />
    </div>
  );
}

export default UserProfileContainer;
