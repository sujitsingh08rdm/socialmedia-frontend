import { useSelector } from "react-redux";
import { type RootState } from "../store/store";
import Spinner from "../components/General/Spinner";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import Navbar from "../components/General/Navbar";
import Sidebar from "../components/General/Sidebar";
import Chatbar from "../components/General/Chatbar";
import { getFeedPost } from "../api/feed.api";
import type { FeedPostType } from "../types/feed";
import FeedPost from "../components/FeedPageComponent/FeedPost";
import { socket } from "../socket/socket";

function FeedPage() {
  const { loading } = useSelector((state: RootState) => state.auth);
  const [serverError, setServerError] = useState<string | null>(null);
  const [loadingPosts, setLoadingPosts] = useState(false);

  const [feedPosts, setFeedPosts] = useState<FeedPostType[]>([]);

  useEffect(() => {
    const getPosts = async () => {
      try {
        setLoadingPosts(true);
        const posts = await getFeedPost();

        setFeedPosts(posts);
      } catch (error: any) {
        setServerError(error.message);
        toast.error(error.message || "Failed to load feed", {
          toastId: "feed-error",
        });
      } finally {
        setLoadingPosts(false);
      }
    };

    getPosts();

    const handleNewPost = (newPost: FeedPostType) => {
      setFeedPosts((prev) => [newPost, ...prev]);
    };

    socket.on("new_post", handleNewPost);

    return () => {
      socket.off("new_post", handleNewPost);
    };
  }, []);

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-primary z-50">
        <Spinner size={78} />
      </div>
    );
  }

  return (
    <div className="bg-primary overflow-hidden flex flex-col h-screen">
      <Navbar />
      <div className="flex flex-1 p-1 w-full overflow-hidden">
        <Sidebar />

        <div className="flex-1 feed-scroll overflow-y-auto px-4">
          {loadingPosts ? (
            <div className="flex-1 flex justify-center items-center min-h-[60vh]">
              <Spinner size={48} />
            </div>
          ) : feedPosts.length === 0 ? (
            <div className="flex-1 overflow-y-auto flex justify-center items-start mt-8 min-h-[60vh]">
              <p className="text-2xl font-medium neo-card bg-secondary">
                No posts found..
              </p>
            </div>
          ) : (
            <div className="">
              {feedPosts.map((feedPost) => (
                <FeedPost key={feedPost._id} post={feedPost} />
              ))}
            </div>
          )}
        </div>
        <Chatbar />
      </div>
    </div>
  );
}

export default FeedPage;
