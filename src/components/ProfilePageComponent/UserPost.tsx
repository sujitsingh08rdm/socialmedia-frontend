import type { UserPostType } from "../../types/userpost";
import defaultImage from "../../assets/default-profileImage.png";
import { Heart, MessageCircle } from "lucide-react";
import { useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import { toast } from "react-toastify";
import { toggleLikePost } from "../../api/like.api";
import Spinner from "../General/Spinner";

interface Props {
  post: UserPostType;
}

export default function UserPost({ post }: Props) {
  const user = useSelector((state: RootState) => state.auth.user);

  const [likes, setLikes] = useState<string[]>(post.likes);
  const [profileLoading, setProfileLoading] = useState(true);
  const [postImageLoading, setPostImageLoading] = useState(!!post.image);

  const [likeCount, setLikeCount] = useState<number>(post.likeCount);
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
        setLikeCount((prev) => prev - 1);
      } else {
        setLikes((prev) => [...prev, user._id]);
        setLikeCount((prev) => prev + 1);
      }
      await toggleLikePost(post._id);
    } catch (error: any) {
      toast.error(error.message || "Failed to toggle like");
      if (isLikedByMe) {
        setLikes((prev) => [...prev, user._id]);
        setLikeCount((prev) => prev + 1);
      } else {
        setLikes((prev) => prev.filter((id) => id !== user._id));
        setLikeCount((prev) => prev - 1);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mt-3 neo-container bg-secondary">
      <div className="neo-card items-center bg-accent-1 flex gap-3">
        {profileLoading && <Spinner />}
        <img
          src={post.owner.profileImage || defaultImage}
          alt={post.owner.username}
          onLoad={() => setProfileLoading(false)}
          onError={() => setProfileLoading(false)}
          className={`w-8 h-8 md:w-10 md:h-10 rounded-full border-4 border-black object-cover bg-white ${
            profileLoading ? "opacity-0" : "opacity-100"
          }`}
        />
        <p className="text-sm font-semibold">@{post.owner.username}</p>
      </div>

      <div className="neo-card bg-accent-2 flex flex-col gap-3 mt-1">
        <p className="font-semibold whitespace-pre-wrap">{post.content}</p>

        {post.image && (
          <>
            {postImageLoading && <Spinner />}
            <img
              src={post.image}
              alt="post"
              onLoad={() => setPostImageLoading(false)}
              onError={() => setPostImageLoading(false)}
              className={`mt-1 rounded-lg max-h-100 object-cover transition-opacity duration-300 ${
                postImageLoading ? "opacity-0" : "opacity-100"
              }`}
            />
          </>
        )}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 text-pink-500 hover:text-pink-700">
            <button
              disabled={loading}
              onClick={handleToggleLike}
              className="flex items-center gap-2 transition disabled:opacity-50"
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
    </section>
  );
}
