import React, { useEffect, useState } from "react";
import type { FeedPostType } from "../../types/feed";
import type { CommentType } from "../../types/comment";
import {
  createComment,
  deleteComment,
  getCommentsByPostId,
} from "../../api/comment.api";
import type { RootState } from "../../store/store";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Spinner from "./Spinner";
import defaultImage from "../../assets/default-profileImage.png";
import { Reply, Trash2 } from "lucide-react";
import type { UserPostType } from "../../types/userpost";

interface CommentSectionProps {
  post: FeedPostType | UserPostType;
  setCommentCount: React.Dispatch<React.SetStateAction<number>>;
}

function CommentSection({ post, setCommentCount }: CommentSectionProps) {
  const [comments, setComments] = useState<CommentType[]>([]);
  const [commentText, setCommentText] = useState("");
  const [loadingComments, setLoadingComments] = useState<boolean>(false);
  const user = useSelector((state: RootState) => state.auth.user);

  const [replyingTo, setReplyingTo] = useState<{
    parentCommentId: string;
    taggedUserId?: string;
    taggedUsername?: string;
  } | null>(null);

  const [replyText, setReplyText] = useState("");
  const [expandedReplies, setExpandedReplies] = useState<
    Record<string, number>
  >({});

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

  const handleReplyClick = (
    parentCommentId: string,
    userId: string,
    username: string,
  ) => {
    setReplyingTo({
      parentCommentId,
      taggedUserId: userId,
      taggedUsername: username,
    });

    setReplyText("");
  };

  const handleReplySubmit = async () => {
    if (!replyingTo) return;

    try {
      const reply = await createComment(
        post._id,
        replyText,
        replyingTo.parentCommentId,
        replyingTo.taggedUserId,
      );

      setComments((prev) =>
        prev.map((comment) =>
          comment._id === replyingTo.parentCommentId
            ? {
                ...comment,
                replies: [...(comment.replies || []), reply],
              }
            : comment,
        ),
      );

      setReplyText("");
      setReplyingTo(null);
      setCommentCount((prev) => prev + 1);

      toast.success("Reply posted");
    } catch (error: any) {
      toast.error(error.message || "Failed to post reply");
    }
  };

  const handleDeleteReply = async (
    parentCommentId: string,
    replyId: string,
  ) => {
    try {
      await deleteComment(post._id, replyId);

      setComments((prev) =>
        prev.map((comment) =>
          comment._id === parentCommentId
            ? {
                ...comment,
                replies:
                  comment.replies?.filter((reply) => reply._id !== replyId) ||
                  [],
              }
            : comment,
        ),
      );

      toast.success("Reply deleted");
      setCommentCount((prev) => prev - 1);
    } catch (error: any) {
      toast.error(error.message || "Failed to delete reply");
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  return (
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

            const visibleReplies = expandedReplies[comment._id] ?? 3;

            const displayedReplies =
              comment.replies?.slice(0, visibleReplies) || [];

            return (
              <div key={comment._id} className="neo-card bg-accent-2 p-2">
                <div className="flex justify-between items-center">
                  {/* Left continer */}
                  <div className="flex justify-between items-center">
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
                        onClick={() =>
                          handleReplyClick(
                            comment._id,
                            comment.commentedBy._id,
                            comment.commentedBy.username,
                          )
                        }
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
                {/* Comment contianer */}
                <div>
                  <div>
                    {replyingTo?.parentCommentId === comment._id && (
                      <div className="ml-12 mt-2 neo-card bg-accent-1 p-2">
                        <textarea
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          rows={2}
                          placeholder={`Reply to ${replyingTo.taggedUsername}`}
                          className="w-full border-2 border-black bg-white p-2"
                        />

                        <div className="mt-2 flex justify-end gap-2">
                          <button
                            onClick={() => {
                              setReplyingTo(null);
                              setReplyText("");
                            }}
                            className="neo-button px-3 py-1"
                          >
                            Cancel
                          </button>

                          <button
                            onClick={handleReplySubmit}
                            className="neo-button bg-button-2 px-3 py-1 cursor-pointer"
                          >
                            Reply
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                  <div>
                    {displayedReplies.map((reply) => {
                      const canDeleteReply =
                        user?._id === reply.commentedBy._id ||
                        user?._id === post.owner._id;

                      return (
                        <div
                          key={reply._id}
                          className="ml-12 mt-2 neo-card bg-accent-1 p-2"
                        >
                          <div className="flex items-start gap-2">
                            <img
                              src={
                                reply.commentedBy.profileImage || defaultImage
                              }
                              alt={reply.commentedBy.username}
                              className="w-8 h-8 rounded-full border-2 border-black"
                            />

                            <div className="flex-1">
                              <p className="font-bold text-sm">
                                {reply.commentedBy.username}
                              </p>

                              <p className="text-sm">
                                {reply.taggedUser && (
                                  <span className="font-bold text-blue-500">
                                    @{reply.taggedUser.username}
                                  </span>
                                )}{" "}
                                {reply.comment}
                              </p>
                              <div className="flex flex-row items-center gap-2">
                                <button
                                  onClick={() =>
                                    handleReplyClick(
                                      comment._id,
                                      reply.commentedBy._id,
                                      reply.commentedBy.username,
                                    )
                                  }
                                  className="mt-2 cursor-pointer flex items-center gap-1 text-xs font-bold"
                                >
                                  <Reply size={12} />
                                  Reply
                                </button>
                                {canDeleteReply && (
                                  <button
                                    onClick={() =>
                                      handleDeleteReply(comment._id, reply._id)
                                    }
                                    className="mt-2 cursor-pointer text-red-600 flex items-center gap-1 text-xs font-bold"
                                  >
                                    <Trash2 size={12} />
                                    Delete
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    {comment.replies &&
                      comment.replies.length > visibleReplies && (
                        <button
                          onClick={() =>
                            setExpandedReplies((prev) => ({
                              ...prev,
                              [comment._id]: (prev[comment._id] ?? 3) + 3,
                            }))
                          }
                          className="neo-btn cursor-pointer ml-12 mt-2 text-sm font-bold text-blue-600 hover:underline"
                        >
                          View{" "}
                          {Math.min(3, comment.replies.length - visibleReplies)}{" "}
                          more replies
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
  );
}

export default CommentSection;
