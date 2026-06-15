import { useDispatch, useSelector } from "react-redux";
import { type RootState } from "../store/store";
import Spinner from "../components/General/Spinner";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/General/Navbar";
import Sidebar from "../components/General/Sidebar";
import Chatbar from "../components/General/Chatbar";
import { getFeedPost } from "../api/feed.api";
import type { FeedPostType } from "../types/feed";
import FeedPost from "../components/FeedPageComponent/FeedPost";

function FeedPage() {
  const { loading } = useSelector((state: RootState) => state.auth);
  const [serverError, setServerError] = useState<string | null>(null);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [feedPosts, setFeedPosts] = useState<FeedPost[]>([]);

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
  }, []);

  console.log(feedPosts);

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-primary z-50">
        <Spinner size={78} />
      </div>
    );
  }

  return (
    <div className="bg-primary min-h-screen">
      <Navbar />
      <div className="p-1 flex w-full overflow-x-hidden">
        <Sidebar />

        {loadingPosts ? (
          <div className="flex-1 flex justify-center items-center min-h-[60vh]">
            <Spinner size={48} />
          </div>
        ) : feedPosts.length === 0 ? (
          <p>No posts found..</p>
        ) : (
          feedPosts.map((feedPost) => (
            <FeedPost key={feedPost._id} post={feedPost} />
          ))
        )}
        <Chatbar />
      </div>
    </div>
  );
}

export default FeedPage;
