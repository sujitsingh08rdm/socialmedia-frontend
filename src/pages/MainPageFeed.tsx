import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { getMainPageCommentsByPostId } from "../api/comment.api";
import { useEffect, useRef, useState } from "react";
import Spinner from "../components/General/Spinner";
import HlsVideoPlayer from "../components/General/HlsVideoPlayer";
import { Heart, MessageCircle } from "lucide-react";

import type { CommentType } from "../types/comment";

import type { FeedPostType } from "../types/feed";
import defaultImage from "../../src/assets/default-profileImage.png";
import MainPageComment from "./MainPageComment";

interface FeedPostProps {
  post: FeedPostType;
}

function MainPageFeed({ post }: FeedPostProps) {
  //   const user = useSelector((state: RootState) => state.auth.user);
  const [profileLoading, setProfileLoading] = useState(true);
  const [postImageLoading, setPostImageLoading] = useState(!!post.image);
  const [postVideoLoading, setPostVideoLoading] = useState(!!post.video);
  const [likes, setLikes] = useState<string[]>(post.likes);
  const [likeCount, setLikeCount] = useState<number>(post.likeCount);
  const [loading, setLoading] = useState(false);

  const [playVideo, setPlayVideo] = useState(false);
  const [showComments, setShowComments] = useState<boolean>(false);
  const [comments, setComments] = useState<CommentType[]>([]);
  const [loadingComments, setLoadingComments] = useState<boolean>(false);
  const [commentCount, setCommentCount] = useState(post.commentCount);

  const [expanded, setExpanded] = useState<boolean>(false);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [isOverflowing, setIsOverflowing] = useState<boolean>(false);

  //   const isLikedByMe = user ? likes.includes(user._id) : false;

  //   const handleToggleLike = async () => {
  //     if (!user) {
  //       toast.error("Please login to like");
  //       return;
  //     }

  //     try {
  //       setLoading(true);
  //       if (isLikedByMe) {
  //         setLikes((prev) => prev.filter((id) => id !== user._id));
  //         setLikeCount((prev) => prev - 1);
  //       } else {
  //         setLikes((prev) => [...prev, user._id]);
  //         setLikeCount((prev) => prev + 1);
  //       }

  //       await toggleLikePost(post._id);
  //     } catch (error: any) {
  //       toast.error(error.message || "Failed to toggle like");
  //       if (isLikedByMe) {
  //         setLikes((prev) => [...prev, user._id]);
  //         setLikeCount((prev) => prev + 1);
  //       } else {
  //         setLikes((prev) => prev.filter((id) => id !== user._id));
  //         setLikeCount((prev) => prev - 1);
  //       }
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  const fetchComments = async () => {
    try {
      setLoadingComments(true);
      const data = await getMainPageCommentsByPostId(post._id);

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
    <div className="w-full flex justify-center">
      {/* Mainpage */}
      <section className="w-full sm:max-w-xl md:max-w-2xl lg:max-w-3xl mx-auto px-4 sm:px-6 md:px-8 py-4 md:py-6 border-b-2 mb-6 md:mb-8 neo-container bg-secondary feed-section border-indigo-800 shadow-indigo-900 shadow-xs">
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
            <Link to={`${post._id}`}>
              {post.image && (
                <>
                  {postImageLoading && <Spinner />}
                  <img
                    src={post.image}
                    alt="post"
                    onLoad={() => setPostImageLoading(false)}
                    onError={() => setPostImageLoading(false)}
                    className={`mt-1 w-full rounded-lg max-h-100 object-cover transition-opacity duration-300 ${
                      postImageLoading ? "opacity-0" : "opacity-100"
                    }`}
                  />
                </>
              )}
              {post.video && (
                <div className="relative mt-2">
                  {!playVideo ? (
                    <div
                      className="relative aspect-video overflow-hidden rounded-lg cursor-pointer group border-2 border-black"
                      onClick={() => setPlayVideo(true)}
                    >
                      {/* Spinner */}
                      {postVideoLoading && (
                        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/10">
                          <Spinner />
                        </div>
                      )}

                      <img
                        src={post.videoThumbnail}
                        alt="Video thumbnail"
                        onLoad={() => setPostVideoLoading(false)}
                        onError={() => setPostVideoLoading(false)}
                        className={`h-full w-full object-contain transition-opacity duration-300 ${
                          postVideoLoading ? "opacity-0" : "opacity-100"
                        }`}
                      />

                      {!postVideoLoading && (
                        <>
                          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/35 transition-colors" />

                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="neo-button bg-button-2 rounded-full p-2">
                              ▶
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  ) : (
                    <div className="relative">
                      {postVideoLoading && (
                        <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/20 z-10">
                          <Spinner />
                        </div>
                      )}

                      <HlsVideoPlayer
                        src={post.video}
                        onReady={() => setPostVideoLoading(false)}
                        onError={() => setPostVideoLoading(false)}
                        className={`rounded-lg w-full max-h-[600px] ${
                          postVideoLoading
                            ? "opacity-0 absolute"
                            : "opacity-100"
                        }`}
                      />
                    </div>
                  )}
                </div>
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
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setExpanded((prev) => !prev);
                    }}
                    className="mt-1 neo-button  text-sm cursor-pointer hover:underline"
                  >
                    {expanded ? "Show less" : "Show More"}
                  </button>
                )}
              </div>
            </Link>
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
                    // onClick={handleToggleLike}
                    className="flex items-center gap-2 text-white transition disabled:opacity-50"
                  >
                    <Heart
                      size={20}
                      className={`cursor-pointer transition text-pink-500 hover:text-pink-700"}`}
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
        {showComments && <MainPageComment key={post._id} post={post} />}
      </section>
    </div>
  );
}

export default MainPageFeed;
