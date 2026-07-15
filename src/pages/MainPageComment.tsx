import { useEffect, useState } from "react";

import { formatDistanceToNow } from "date-fns";
import type { FeedPostType } from "../types/feed";
import type { CommentType } from "../types/comment";
import { getMainPageCommentsByPostId } from "../api/comment.api";
import Spinner from "../components/General/Spinner";
import { Link } from "react-router-dom";
import defaultImage from "../../src/assets/default-profileImage.png";

interface CommentSectionPreviewProps {
  post: FeedPostType;
}

function MainPageComment({ post }: CommentSectionPreviewProps) {
  const [comments, setComments] = useState<CommentType[]>([]);
  const [loading, setLoading] = useState(false);

  console.log(post);

  const getTimeAgo = (date: string) =>
    formatDistanceToNow(new Date(date), {
      addSuffix: true,
    });

  useEffect(() => {
    async function fetchComments() {
      try {
        setLoading(true);
        const data = await getMainPageCommentsByPostId(post._id);
        setComments(data);
      } finally {
        setLoading(false);
      }
    }

    fetchComments();
  }, [post._id]);

  return (
    <div className="neo-card mt-4 bg-accent-1">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-black">Comments ({comments.length})</h3>
      </div>

      {loading ? (
        <Spinner />
      ) : comments.length === 0 ? (
        <div className="neo-card bg-accent-2 text-center">No comments yet</div>
      ) : (
        <div className="space-y-3">
          {comments.map((comment) => (
            <div key={comment._id} className="neo-card bg-accent-2 p-3">
              <div className="flex items-start gap-3">
                <img
                  src={comment.commentedBy.profileImage || defaultImage}
                  alt={comment.commentedBy.username}
                  className="w-10 h-10 rounded-full border-2 border-black object-cover shrink-0"
                />

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-black text-sm">
                      {comment.commentedBy.username}
                    </h4>

                    <span className="text-xs opacity-70">
                      {getTimeAgo(comment.createdAt)}
                    </span>
                  </div>

                  <p className="mt-1 break-words">{comment.comment}</p>

                  {/* Optional Replies Preview */}
                  {comment.replies && comment.replies?.length > 0 && (
                    <div className="mt-3 ml-3 border-l-2 border-black pl-3 space-y-2">
                      {comment.replies.slice(0, 2).map((reply) => (
                        <div key={reply._id}>
                          <div className="flex items-center gap-2">
                            <img
                              src={
                                reply.commentedBy.profileImage || defaultImage
                              }
                              alt={reply.commentedBy.username}
                              className="w-7 h-7 rounded-full border border-black object-cover"
                            />

                            <span className="font-bold text-xs">
                              {reply.commentedBy.username}
                            </span>

                            <span className="text-[10px] opacity-70">
                              {getTimeAgo(reply.createdAt)}
                            </span>
                          </div>

                          <p className="ml-9 text-sm">{reply.comment}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 text-center">
        <p className="text-sm font-bold">Want to join the discussion?</p>

        <Link
          to="/login"
          className="neo-button inline-block mt-2 bg-button-2 px-4 py-2"
        >
          Login to Comment
        </Link>
      </div>
    </div>
  );
}

export default MainPageComment;
