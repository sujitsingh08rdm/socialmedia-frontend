import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import defaultImage from "../../assets/default-profileImage.png";

import { getUserPostById } from "../../api/post.api";

import Spinner from "../General/Spinner";
import HlsVideoPlayer from "../General/HlsVideoPlayer";
import DetailItem from "./DetailItem";

import type { UserPostByIdType } from "../../types/userPostById";
import { Link } from "react-router-dom";

interface PostIdProp {
  postId: string | undefined;
}

function PostDetailContainer({ postId }: PostIdProp) {
  const [loading, setLoading] = useState(true);
  const [mediaLoading, setMediaLoading] = useState(true);

  const [post, setPost] = useState<UserPostByIdType | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        if (!postId) {
          toast.error("Post not found");
          return;
        }

        setLoading(true);

        const data = await getUserPostById(postId);

        setPost(data);
      } catch (error: any) {
        toast.error(error.message || "Failed to fetch post");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  if (loading || !post) {
    return (
      <div className="min-w-[63vw] flex justify-center pt-10">
        <Spinner size={60} />
      </div>
    );
  }

  return (
    <div className="min-w-[63vw] p-2 flex flex-col gap-3 overflow-y-auto user-profile-scroll">
      {/* Header */}
      <div className="neo-container bg-secondary">
        <div className="neo-card bg-accent-1 flex items-center gap-3">
          <img
            src={post.owner.profileImage || defaultImage}
            alt={post.owner.username}
            className="w-12 h-12 rounded-full object-cover border-2 border-black"
          />

          <div>
            <Link
              to={`/profile/${post.owner?.username}`}
              className="font-black text-lg"
            >
              @{post.owner.username}
            </Link>
            <p className="text-sm opacity-70">Post Owner</p>
          </div>
        </div>
      </div>

      {/* Media */}
      <div className="neo-container bg-secondary">
        <div className="neo-card bg-accent-2 flex items-center justify-center flex-col">
          {(post.image || post.video) && (
            <div className="">
              {post.image && (
                <>
                  {mediaLoading && <Spinner />}

                  <img
                    src={post.image}
                    alt="post"
                    onLoad={() => setMediaLoading(false)}
                    onError={() => setMediaLoading(false)}
                    className={`rounded-lg w-full max-h-[600px] object-contain ${
                      mediaLoading ? "opacity-0" : "opacity-100"
                    }`}
                  />
                </>
              )}

              {post.video && (
                <HlsVideoPlayer
                  src={post.video}
                  className="rounded-lg w-full max-h-[600px]"
                />
              )}
            </div>
          )}
          {/* Content */}

          <h2 className="font-black text-xl uppercase mb-4">Content</h2>

          <div
            className="prose prose-invert max-w-none"
            dangerouslySetInnerHTML={{
              __html: post.content,
            }}
          />
        </div>
      </div>

      {/* Details */}
      <div className="neo-container bg-secondary">
        <div className="neo-card bg-accent-1">
          <h2 className="font-black text-xl uppercase mb-4">Post Details</h2>

          <div className="grid grid-cols-2 gap-3">
            <DetailItem label="Author" value={`@${post.owner.username}`} />

            <DetailItem label="Likes" value={post.likes.length} />

            <DetailItem label="Comments" value={post.comments.length} />

            <DetailItem
              label="Media Type"
              value={post.video ? "Video" : post.image ? "Image" : "Text"}
            />

            <DetailItem
              label="Created"
              value={new Date(post.createdAt).toLocaleString()}
            />

            <DetailItem
              label="Updated"
              value={new Date(post.updatedAt).toLocaleString()}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default PostDetailContainer;
