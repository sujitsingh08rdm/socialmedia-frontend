import { useSelector } from "react-redux";
import type { RootState } from "../store/store";
import { useEffect, useState } from "react";
import type { FeedPostType } from "../types/feed";
import { getMainPost } from "../api/post.api";
import { toast } from "react-toastify";
import { socket } from "../socket/socket";
import Spinner from "../components/General/Spinner";

import { Link } from "react-router-dom";
import MainPageFeed from "./MainPageFeed";

function MainPage() {
  const { loading } = useSelector((state: RootState) => state.auth);
  const [serverError, setServerError] = useState<string | null>(null);
  const [loadingPosts, setLoadingPosts] = useState(false);

  const [posts, setPosts] = useState<FeedPostType[]>([]);

  useEffect(() => {
    const getPosts = async () => {
      try {
        setLoadingPosts(true);
        const posts = await getMainPost();

        setPosts(posts);
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
      setPosts((prev) => [newPost, ...prev]);
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
    <div className="flex-1 feed-scroll overflow-y-auto px-4">
      {/* navbar */}
      <nav className="my-2 flex px-3 py-1 gap-2  md:gap-4 lg:gap-6 md:px-6 md:py-2 justify-between items-center border-indigo-800 lg:px-12 lg:py-4 sticky shadow-indigo-900 shadow-xs">
        <Link
          to="/home"
          className="text-xl md:text-2xl lg:text-4xl hover:scale-105 font-black text-black neo-card bg-accent-1 inline-block"
        >
          <span>bingeHub</span>
          <p className="text-[0.70rem] md:text-[0.75rem] mt-1 text-gray-700">
            A Place to flex your movie knowledge
          </p>
        </Link>

        <div className="flex gap-2">
          <Link
            to="/login"
            className="p-1 md:p-2 neo-button cursor-pointer bg-lime-400 hover:bg-lime-300"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="p-1 md:p-2 neo-button cursor-pointer bg-orange-400 hover:bg-orange-300"
          >
            Register
          </Link>
        </div>
      </nav>
      <div>
        {loadingPosts ? (
          <div className="flex-1 flex justify-center items-center min-h-[60vh]">
            <Spinner size={48} />
          </div>
        ) : posts.length === 0 ? (
          <div className="flex-1 overflow-y-auto flex justify-center items-start mt-8 min-h-[60vh]">
            <p className="text-2xl font-medium neo-card bg-secondary">
              No posts found..
            </p>
          </div>
        ) : (
          <div className="">
            {posts.map((post) => (
              <MainPageFeed key={post._id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MainPage;
