import type { FeedPostType } from "../../types/feed";
import defaultImage from "../../assets/default-profileImage.png";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { toggleLikePost } from "../../api/like.api";
import { Heart, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import Spinner from "../General/Spinner";
import type { CommentType } from "../../types/comment";
import { getCommentsByPostId } from "../../api/comment.api";
import CommentSection from "../General/CommentSection";

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
  const [loadingComments, setLoadingComments] = useState<boolean>(false);
  const [commentCount, setCommentCount] = useState(post.commentCount);

  const [expanded, setExpanded] = useState<boolean>(false);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [isOverflowing, setIsOverflowing] = useState<boolean>(false);

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

          {/* Post with read-more */}
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

          {/* <div
            className="prose prose-invert font-semibold whitespace-pre-wrap"
            dangerouslySetInnerHTML={{ __html: post.content }}
          /> */}
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
      {
        showComments && (
          <CommentSection
            key={post._id}
            post={post}
            setCommentCount={setCommentCount}
          />
        )
        // <div className="neo-card mt-4 bg-accent-1">
        //   {/* Add Comment */}
        //   <div className="neo-card bg-accent-2">
        //     <textarea
        //       value={commentText}
        //       onChange={(e) => setCommentText(e.target.value)}
        //       placeholder="Write a comment..."
        //       className="w-full resize-none border-2 border-black bg-white p-2"
        //       rows={1}
        //     />
        //     <button
        //       onClick={handleAddComments}
        //       className="mt-2 neo-button bg-button-2 px-2 py-1 hover-bg-button-1 ease-in-out font-bold"
        //     >
        //       Comment
        //     </button>
        //   </div>

        //   {/* Comments List */}
        //   <div className="mt-4 space-y-3">
        //     {loadingComments ? (
        //       <Spinner />
        //     ) : comments.length === 0 ? (
        //       <div className="neo-card bg-accent-2 text-center">
        //         No comments yet
        //       </div>
        //     ) : (
        //       comments.map((comment) => {
        //         const canDelete =
        //           user?._id === comment.commentedBy._id ||
        //           user?._id === post.owner._id;

        //         const visibleReplies = expanded, [comment._id] ?? 3;

        //         const displayedReplies =
        //           comment.replies?.slice(0, visibleReplies) || [];

        //         return (
        //           <div key={comment._id} className="neo-card bg-accent-2 p-2">
        //             <div className="flex justify-between items-center">
        //               {/* Left continer */}
        //               <div className="flex justify-between items-center">
        //                 <div className="flex items-center justify-center gap-1 shrink-0">
        //                   <img
        //                     src={
        //                       comment.commentedBy.profileImage || defaultImage
        //                     }
        //                     alt={comment.commentedBy.username}
        //                     className="w-10 h-10 rounded-full object-cover border-2 border-black"
        //                   />
        //                   <div>
        //                     <p className="font-black text-sm uppercase tracking-normal">
        //                       {comment.commentedBy.username || "Username"}
        //                     </p>
        //                     <p className="text-sm mt-1 break-words">
        //                       {comment.comment}
        //                     </p>
        //                   </div>
        //                 </div>
        //               </div>
        //               {/* right container */}
        //               <div className="flex flex-col items-center gap-1 shrink-0">
        //                 <span className="text-[10px] px-2 py-1 border-2 border-black bg-white font-bold">
        //                   Posted On :{" "}
        //                   {new Date(comment.createdAt).toLocaleDateString()}
        //                 </span>
        //                 <div className="flex items-center gap-3">
        //                   <button
        //                     className="neo-button px-2 py-1 flex items-center gap-1 text-xs font-bold hover:scale-105 transition"
        //                     onClick={() =>
        //                       handleReplyClick(
        //                         comment._id,
        //                         comment.commentedBy._id,
        //                         comment.commentedBy.username,
        //                       )
        //                     }
        //                   >
        //                     <Reply size={14} />
        //                     Reply
        //                   </button>

        //                   {canDelete && (
        //                     <button
        //                       onClick={() => handleDeleteComment(comment._id)}
        //                       className="neo-button bg-red-300 px-2 py-1 flex items-center gap-1 text-xs font-bold text-red-800 hover:text-red-900 hover:scale-105 transition"
        //                     >
        //                       <Trash2 size={14} />
        //                       Delete
        //                     </button>
        //                   )}
        //                 </div>
        //               </div>
        //             </div>
        //             {/* Comment contianer */}
        //             <div>
        //               <div>
        //                 {replyingTo?.parentCommentId === comment._id && (
        //                   <div className="ml-12 mt-2 neo-card bg-accent-1 p-2">
        //                     <textarea
        //                       value={replyText}
        //                       onChange={(e) => setReplyText(e.target.value)}
        //                       rows={2}
        //                       className="w-full border-2 border-black bg-white p-2"
        //                     />

        //                     <div className="mt-2 flex justify-end gap-2">
        //                       <button
        //                         onClick={() => {
        //                           setReplyingTo(null);
        //                           setReplyText("");
        //                         }}
        //                         className="neo-button px-3 py-1"
        //                       >
        //                         Cancel
        //                       </button>

        //                       <button
        //                         onClick={handleReplySubmit}
        //                         className="neo-button bg-button-2 px-3 py-1 cursor-pointer"
        //                       >
        //                         Reply
        //                       </button>
        //                     </div>
        //                   </div>
        //                 )}
        //               </div>
        //               <div>
        //                 {displayedReplies.map((reply) => {
        //                   const canDeleteReply =
        //                     user?._id === reply.commentedBy._id ||
        //                     user?._id === post.owner._id;

        //                   return (
        //                     <div
        //                       key={reply._id}
        //                       className="ml-12 mt-2 neo-card bg-accent-1 p-2"
        //                     >
        //                       <div className="flex items-start gap-2">
        //                         <img
        //                           src={
        //                             reply.commentedBy.profileImage ||
        //                             defaultImage
        //                           }
        //                           alt={reply.commentedBy.username}
        //                           className="w-8 h-8 rounded-full border-2 border-black"
        //                         />

        //                         <div className="flex-1">
        //                           <p className="font-bold text-sm">
        //                             {reply.commentedBy.username}
        //                           </p>

        //                           <p className="text-sm">
        //                             {reply.taggedUser && (
        //                               <span className="font-bold text-blue-500">
        //                                 @{reply.taggedUser.username}
        //                               </span>
        //                             )}{" "}
        //                             {reply.comment}
        //                           </p>
        //                           <div className="flex flex-row items-center gap-2">
        //                             <button
        //                               onClick={() =>
        //                                 handleReplyClick(
        //                                   comment._id,
        //                                   reply.commentedBy._id,
        //                                   reply.commentedBy.username,
        //                                 )
        //                               }
        //                               className="mt-2 cursor-pointer flex items-center gap-1 text-xs font-bold"
        //                             >
        //                               <Reply size={12} />
        //                               Reply
        //                             </button>
        //                             {canDeleteReply && (
        //                               <button
        //                                 onClick={() =>
        //                                   handleDeleteReply(
        //                                     comment._id,
        //                                     reply._id,
        //                                   )
        //                                 }
        //                                 className="mt-2 cursor-pointer text-red-600 flex items-center gap-1 text-xs font-bold"
        //                               >
        //                                 <Trash2 size={12} />
        //                                 Delete
        //                               </button>
        //                             )}
        //                           </div>
        //                         </div>
        //                       </div>
        //                     </div>
        //                   );
        //                 })}
        //                 {comment.replies &&
        //                   comment.replies.length > visibleReplies && (
        //                     <button
        //                       onClick={() =>
        //                         setExpandedReplies((prev) => ({
        //                           ...prev,
        //                           [comment._id]: (prev[comment._id] ?? 3) + 3,
        //                         }))
        //                       }
        //                       className="neo-btn cursor-pointer ml-12 mt-2 text-sm font-bold text-blue-600 hover:underline"
        //                     >
        //                       View{" "}
        //                       {Math.min(
        //                         3,
        //                         comment.replies.length - visibleReplies,
        //                       )}{" "}
        //                       more replies
        //                     </button>
        //                   )}
        //               </div>
        //             </div>
        //           </div>
        //         );
        //       })
        //     )}
        //   </div>
        // </div>
      }
    </section>
  );
}

export default FeedPost;
