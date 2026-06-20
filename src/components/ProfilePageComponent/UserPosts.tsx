import type { UserPostType } from "../../types/userpost";
import UserPost from "./UserPost";

interface Props {
  userPosts: UserPostType[];
}

function UserPosts({ userPosts }: Props) {
  if (!userPosts || userPosts.length === 0) {
    return (
      <div className="mt-3 neo-container bg-secondary font-medium flex items-center justify-center">
        no posts yet.
      </div>
    );
  }

  return (
    <div className="space-y-6 ">
      {userPosts.map((post) => (
        <UserPost key={post._id} post={post} />
      ))}
    </div>
  );
}

export default UserPosts;
