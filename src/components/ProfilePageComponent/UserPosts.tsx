import React, { useEffect } from "react";
import type { UserPostType } from "../../types/userpost";
import defaultImage from "../../assets/default-profileImage.png";
import { Heart, MessageCircle } from "lucide-react";

interface Props {
  userPosts: UserPostType[];
}

function UserPosts({ userPosts }: Props) {
  console.log(userPosts);

  if (!userPosts.length) {
    return <div className="text-zinc-400 text-center">no posts yet.</div>;
  }

  return (
    <div className="space-y-6 ">
      {userPosts.map((post) => (
        <article key={post._id} className="mt-3 neo-container bg-secondary">
          <div className="neo-card items-center bg-accent-1 flex gap-3">
            <img
              src={post.owner.profileImage || defaultImage}
              alt={post.owner.username}
              className="w-8 h-8 md:w-10 md:h-10 rounded-full border-4 border-black object-cover bg-white"
            />
            <p className="text-sm font-semibold">@{post.owner.username}</p>
          </div>

          <div className="neo-card bg-accent-2 flex flex-col gap-3 mt-1">
            <p className="font-semibold whitespace-pre-wrap">{post.content}</p>
            {post.image && (
              <img
                src={post.image}
                alt="post"
                className="w-full max-h-[400px] object-cover rounded-xl mb-3"
              />
            )}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 text-pink-500 hover:text-pink-700">
                <button
                  // disabled={loading}
                  // onClick={handleToggleLike}
                  className="flex items-center gap-2 transition disabled:opacity-50"
                >
                  <Heart size={20} className={`cursor-pointer transition }`} />
                  <span className="font-medium text-sm text-gray-700">
                    {post.likeCount}
                  </span>
                </button>
              </div>

              <div className="flex items-center gap-1 text-blue-500 hover:text-blue-700">
                <button>
                  <MessageCircle size={20} className="cursor-pointer" />
                </button>
                <span className="font-medium text-gray-700">
                  {post.commentCount}
                </span>
              </div>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

export default UserPosts;
