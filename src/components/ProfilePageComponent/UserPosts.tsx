import React from "react";
import type { UserPostType } from "../../types/userpost";
import UserPost from "./UserPost";

interface Props {
  userPosts: UserPostType[];
}

function UserPosts({ userPosts }: Props) {
  if (!userPosts.length) {
    return <div className="text-zinc-400 text-center">no posts yet.</div>;
  }

  return (
    <div className="space-y-6 ">
      {userPosts.map((post) => (
        <UserPost post={post} />
      ))}
    </div>
  );
}

export default UserPosts;
