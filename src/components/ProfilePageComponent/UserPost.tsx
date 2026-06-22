import type { UserPostType } from "../../types/userpost";
import defaultImage from "../../assets/default-profileImage.png";
import { Heart, MessageCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import { toast } from "react-toastify";
import { toggleLikePost } from "../../api/like.api";
import Spinner from "../General/Spinner";
import CommentSection from "../General/CommentSection";
import type { CommentType } from "../../types/comment";
import { getCommentsByPostId } from "../../api/comment.api";

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

  const [showComments, setShowComments] = useState<boolean>(false);
  const [comments, setComments] = useState<CommentType[]>([]);
  const [loadingComments, setLoadingComments] = useState<boolean>(false);
  const [commentCount, setCommentCount] = useState(post.commentCount);

  const [expanded, setExpanded] = useState<boolean>(false);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [isOverflowing, setIsOverflowing] = useState<boolean>(false);

  // console.log(user, "<- user");
  // console.log(post, "<- post");

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

  const fetchComments = async () => {
    try {
      setLoadingComments(true);
      const data = await getCommentsByPostId(post._id);

      setComments(data);
    } catch (error: any) {
      toast.error("failed to load comments");
    } finally {
      setLoadingComments(false);
    }
  };

  const handleToggleComments = () => {
    setShowComments((prev) => !prev);

    if (!showComments) {
      fetchComments();
    }
  };

  useEffect(() => {
    if (contentRef.current) {
      const el = contentRef.current;
      setIsOverflowing(el.scrollHeight > el.clientHeight);
    }
  }, [post.content]);

  return (
    <section className="mt-3 neo-container bg-secondary">
      <div className="neo-card items-center bg-accent-1 flex gap-3">
        {profileLoading && <Spinner />}
        <img
          src={
            post.owner._id === user?._id
              ? user?.profileImage || defaultImage
              : post.owner.profileImage || defaultImage
          }
          alt={post.owner.username}
          onLoad={() => setProfileLoading(false)}
          onError={() => setProfileLoading(false)}
          className={`w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-black object-cover bg-white ${
            profileLoading ? "opacity-0" : "opacity-100"
          }`}
        />
        <p className="text-sm font-semibold">@{post.owner.username}</p>
      </div>

      <div className="neo-card bg-accent-2 flex flex-col gap-3 mt-1">
        {/* <div
          className="prose prose-invert font-semibold whitespace-pre-wrap"
          dangerouslySetInnerHTML={{ __html: post.content }}
        /> */}

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

        <div className="relative mt-2">
          <div
            ref={contentRef}
            className={`prose prose-invert font-semibold whitespace-pre-wrap max-w-none  transition-all duration-300 ${expanded ? "" : "line-clamp-3 overflow-hidden"}`}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
          {isOverflowing && (
            <button
              onClick={() => setExpanded((prev) => !prev)}
              className="mt-1 neo-button  text-sm cursor-pointer hover:underline"
            >
              {expanded ? "Show less" : "Show More"}
            </button>
          )}
        </div>

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

          <div className="flex items-center gap-1 text-blue-500 ">
            <button onClick={handleToggleComments}>
              <MessageCircle
                size={20}
                className={`cursor-pointer transition hover:text-blue-900 ${showComments ? "fill-blue-500 text-blue-500" : "text-blue-500"}`}
              />
            </button>
            <span className="font-medium text-gray-700">{commentCount}</span>
          </div>
        </div>
        {showComments && (
          <CommentSection
            key={post._id}
            post={post}
            setCommentCount={setCommentCount}
          />
        )}
      </div>
    </section>
  );
}
