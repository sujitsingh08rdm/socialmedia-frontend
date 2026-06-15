import type { FeedPostType } from "../../types/feed";

interface FeedPostProps {
  post: FeedPostType;
}

function FeedPost({ post }: FeedPostProps) {
  return (
    <section className="p-2 neo-container bg-secondary feed-section min-w-[60vw] border-r-2 border-violet-800 shadow-indigo-900 shadow-xs">
      <div className="flex neo-card bg-accent-2 items-center gap-3">
        <img
          src={post.owner.profileImage}
          alt={post.owner.username}
          className="w-10 h-10 rounded-full object-cover"
        />
        <p className="font-semibold">{post.owner.username}</p>
      </div>
      <div className="neo-card bg-accent-1 mt-2">
        <div className="neo-card bg-accent-2">
          {" "}
          <p className="mt-3">{post.content}</p>
          {post.image && (
            <img
              src={post.image}
              alt="post"
              className="mt-3 rounded-lg max-h-[400px] object-cover"
            />
          )}
        </div>
        <div className=" neo-card bg-accent-2 mt-3 text-sm text-gray-400 flex gap-4">
          <span>💖{post.likesCount}</span>
          <span>💬{post.commentsCount}</span>
        </div>
      </div>{" "}
    </section>
  );
}

export default FeedPost;
