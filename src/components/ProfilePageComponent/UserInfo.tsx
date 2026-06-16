import type { userProfileInfoType } from "../../types/userprofile";

interface UserInfoProps {
  user: userProfileInfoType;
}

function UserInfo({ user }: UserInfoProps) {
  console.log("userinfo ->", user);

  return <div className="min-w-[64vw] bg-red-400 flex">Userinfo</div>;
}

export default UserInfo;
