import type { FeedPostType } from "../../types/feed";
import defaultImage from "../../assets/default-profileImage.png";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import { useState } from "react";
import { toast } from "react-toastify";
import { toggleLikePost } from "../../api/like.api";
import { Heart, MessageCircle, Reply, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import Spinner from "../General/Spinner";
import type { CommentType } from "../../types/comment";
import {
  createComment,
  deleteComment,
  getCommentsByPostId,
} from "../../api/comment.api";

interface FeedPostProps {
  post: FeedPostType;
}

function FeedPost({ post }: FeedPostProps) {
  const user = useSelector((state: RootState) => state.auth.user);
  const [profileLoading, setProfileLoading] = useState(true);
  const [postImageLoading, setPostImageLoading] = useState(!!post.image);
  const [likes, setLikes] = useState<string[]>(post.likes);
  const [likeCount, setLikeCount] = useState<number>(post.likeCount);
  const [loading, setLoading] = useState(false);

  const [showComments, setShowComments] = useState<boolean>(false);
  const [comments, setComments] = useState<CommentType[]>([]);
  const [commentText, setCommentText] = useState("");
  const [loadingComments, setLoadingComments] = useState<boolean>(false);
  const [commentCount, setCommentCount] = useState(post.commentCount);

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

  const fetchComments = async () => {
    try {
      setLoadingComments(true);
      const data = await getCommentsByPostId(post._id);
      console.log(data);
      setComments(data);
    } catch (error: any) {
      toast.error("failed to load comments");
    } finally {
      setLoadingComments(false);
    }
  };

  const handleToggleComments = () => {
    console.log("toggle comment clicked");

    setShowComments((prev) => !prev);

    if (!showComments) {
      fetchComments();
    }
  };

  const handleAddComments = async () => {
    if (!user) {
      toast.error("Login to comment");
      return;
    }

    if (!commentText.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }

    try {
      setLoadingComments(true);
      const newComment = await createComment(post._id, commentText);
      setComments((prev) => [newComment, ...prev]);
      setCommentText("");
      setCommentCount((prev) => prev + 1);

      toast.success("comment posted");
      // setShowComments(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to add comment..");
    } finally {
      setLoadingComments(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      await deleteComment(post._id, commentId);

      setComments((prev) =>
        prev.filter((comment) => comment._id !== commentId),
      );

      setCommentCount((prev) => prev - 1);

      toast.success("Comment deleted");
    } catch (error: any) {
      toast.error(error.message || "Failed to delete comment");
    }
  };

  console.log(comments);

  return (
    <section className="px-8 py-6 border-b-2 mb-8 neo-container bg-secondary feed-section min-w-[60vw] border-r-2 border-violet-800 shadow-indigo-900 shadow-xs">
      <div className="flex neo-card bg-accent-2 items-center">
        <Link
          to={`/profile/${post.owner?.username}`}
          className="flex bg-accent-2 items-center gap-3"
        >
          {profileLoading && <Spinner />}

          <img
            src={post.owner.profileImage || defaultImage}
            alt={post.owner.username}
            onLoad={() => setProfileLoading(false)}
            onError={() => setProfileLoading(false)}
            className={`aspect-square w-10 h-10 rounded-full object-cover ${
              profileLoading ? "opacity-0" : "opacity-100"
            }`}
          />
          <p className="font-semibold">{post.owner.username}</p>
        </Link>
      </div>
      <div className="neo-card bg-accent-1 mt-2">
        <div className="neo-card bg-accent-2">
          <p className="mt-3">{post.content}</p>
          {post.image && (
            <>
              {postImageLoading && <Spinner />}
              <img
                src={post.image}
                alt="post"
                onLoad={() => setPostImageLoading(false)}
                onError={() => setPostImageLoading(false)}
                className={`mt-3 rounded-lg max-h-100 object-cover transition-opacity duration-300 ${
                  postImageLoading ? "opacity-0" : "opacity-100"
                }`}
              />
            </>
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

              <div
                className={`flex items-center gap-1 text-blue-500 hover:text-blue-700  `}
              >
                <button onClick={handleToggleComments}>
                  <MessageCircle
                    size={20}
                    className={`cursor-pointer transition ${showComments ? "fill-blue-500 text-blue-500" : "text-blue-500"}`}
                  />
                </button>
                <span className="font-medium text-gray-700">
                  {commentCount}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showComments && (
        <div className="neo-card mt-4 bg-accent-1">
          {/* Add Comment */}
          <div className="neo-card bg-accent-2">
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write a comment..."
              className="w-full resize-none border-2 border-black bg-white p-2"
              rows={1}
            />
            <button
              onClick={handleAddComments}
              className="mt-2 neo-button bg-button-2 px-2 py-1 hover-bg-button-1 ease-in-out font-bold"
            >
              Comment
            </button>
          </div>

          {/* Comments List */}
          <div className="mt-4 space-y-3">
            {loadingComments ? (
              <Spinner />
            ) : comments.length === 0 ? (
              <div className="neo-card bg-accent-2 text-center">
                No comments yet
              </div>
            ) : (
              comments.map((comment) => {
                const canDelete =
                  user?._id === comment.commentedBy._id ||
                  user?._id === post.owner._id;

                return (
                  <div
                    key={comment._id}
                    className="neo-card bg-accent-2 p-2 flex justify-between items-center"
                  >
                    {/* Left continer */}
                    <div className="flex items-center justify-center gap-1 shrink-0">
                      <img
                        src={comment.commentedBy.profileImage || defaultImage}
                        alt={comment.commentedBy.username}
                        className="w-10 h-10 rounded-full object-cover border-2 border-black"
                      />
                      <div>
                        <p className="font-black text-sm uppercase tracking-normal">
                          {comment.commentedBy.username || "Username"}
                        </p>
                        <p className="text-sm mt-1 break-words">
                          {comment.comment}
                        </p>
                      </div>
                    </div>
                    {/* right container */}
                    <div className="flex flex-col items-center gap-1 shrink-0">
                      <span className="text-[10px] px-2 py-1 border-2 border-black bg-white font-bold">
                        Posted On :{" "}
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </span>
                      <div className="flex items-center gap-3">
                        <button
                          className="neo-button px-2 py-1 flex items-center gap-1 text-xs font-bold hover:scale-105 transition"
                          // onClick={() => handleReply(comment._id)}
                        >
                          <Reply size={14} />
                          Reply
                        </button>

                        {canDelete && (
                          <button
                            onClick={() => handleDeleteComment(comment._id)}
                            className="neo-button bg-red-300 px-2 py-1 flex items-center gap-1 text-xs font-bold text-red-800 hover:text-red-900 hover:scale-105 transition"
                          >
                            <Trash2 size={14} />
                            Delete
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </section>
  );
}

export default FeedPost;
