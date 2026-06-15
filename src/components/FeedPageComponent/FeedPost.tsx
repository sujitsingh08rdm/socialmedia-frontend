import type { FeedPostType } from "../../types/feed";
import defaultImage from "../../assets/default-profileImage.png";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import { useState } from "react";
import { toast } from "react-toastify";
import { toggleLikePost } from "../../api/like.api";
import { Heart, MessageCircle } from "lucide-react";

interface FeedPostProps {
  post: FeedPostType;
}

function FeedPost({ post }: FeedPostProps) {
  const user = useSelector((state: RootState) => state.auth.user);
  const [likes, setLikes] = useState<string[]>(post.likes);
  const [likeCount, setLikesCount] = useState<number>(post.likeCount);
  const [loading, setLoading] = useState(false);

  const isLikedByMe = user ? likes.includes(user._id) : false;

  const handleToggleLike = async () => {
    if (!user) {
      toast.error("Please login to like");
      return;
    }

    try {
      setLoading(true);
      if (isLikedByMe) {
        setLikes((prev) => prev.filter((id) => id !== user._id));
        setLikesCount((prev) => prev - 1);
      } else {
        setLikes((prev) => [...prev, user._id]);
        setLikesCount((prev) => prev + 1);
      }

      await toggleLikePost(post._id);
      console.log("API success");
    } catch (error: any) {
      toast.error(error.message || "Failed to toggle like");
      if (isLikedByMe) {
        setLikes((prev) => [...prev, user._id]);
        setLikesCount((prev) => prev + 1);
      } else {
        setLikes((prev) => prev.filter((id) => id !== user._id));
        setLikesCount((prev) => prev - 1);
      }
    } finally {
      setLoading(false);
    }
  };

  console.log(post);

  return (
    <section className="px-8 py-6 border-b-2 mb-8 neo-container bg-secondary feed-section min-w-[60vw] border-r-2 border-violet-800 shadow-indigo-900 shadow-xs">
      <div className="flex neo-card bg-accent-2 items-center gap-3">
        <img
          src={post.owner.profileImage || defaultImage}
          alt={post.owner.username}
          className="aspect-square w-10 h-10 rounded-full object-cover"
        />
        <p className="font-semibold">{post.owner.username}</p>
      </div>
      <div className="neo-card bg-accent-1 mt-2">
        <div className="neo-card bg-accent-2">
          <p className="mt-3">{post.content}</p>
          {post.image && (
            <img
              src={post.image}
              alt="post"
              className="mt-3 rounded-lg max-h-[400px] object-cover"
            />
          )}
        </div>

        <div className="neo-card mt-3 bg-accent-2 px-4 py-3">
          <div className="flex items-center justify-between text-sm">
            <span className="">
              Posted on - {new Date(post.createdAt).toLocaleDateString()}
            </span>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 text-pink-500 hover:text-pink-700">
                <button
                  disabled={loading}
                  onClick={handleToggleLike}
                  className="flex items-center gap-2 text-white transition disabled:opacity-50"
                >
                  <Heart
                    size={20}
                    className={`cursor-pointer transition ${isLikedByMe ? "fill-pink-500 text-pink-500" : "text-pink-500 hover:text-pink-700"}`}
                  />
                  <span className="font-medium text-sm text-gray-700">
                    {likeCount}
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
        </div>
      </div>
    </section>
  );
}

export default FeedPost;
