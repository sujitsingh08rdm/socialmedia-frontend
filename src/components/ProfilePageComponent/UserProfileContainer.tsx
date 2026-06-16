import React, { useEffect, useState } from "react";
import UserInfo from "./UserInfo";
import type { userProfileInfoType } from "../../types/userprofile";
import { getUserProfileInfo } from "../../api/userProfile.api";
import { useParams } from "react-router-dom";
import Spinner from "../General/Spinner";

function UserProfileContainer() {
  const [userProfileInfo, setUserProfileInfo] =
    useState<userProfileInfoType | null>(null);
  const { username } = useParams<{ username: string }>();
  const [loading, setLoading] = useState<boolean>(true);

  console.log({ paramsUsername: username });

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
    <div className="min-w-[63vw]">
      <UserInfo user={userProfileInfo} />
    </div>
  );
}

export default UserProfileContainer;
