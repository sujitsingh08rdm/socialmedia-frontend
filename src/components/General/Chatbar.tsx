import { useEffect, useState } from "react";
import type { Follower } from "../../types/followers";
import { getMyFollowers } from "../../api/chat.api";
import Spinner from "./Spinner";
import defaultImage from "../../assets/default-profileImage.png";
import { Link } from "react-router-dom";

function Chatbar() {
  const [followers, setFollowers] = useState<Follower[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchFollowers = async () => {
      try {
        setLoading(true);
        const response = await getMyFollowers();
        console.log(response);

        setFollowers(response.followers);
      } catch (error) {
        console.log(error, "failed to fetch followers");
      } finally {
        setLoading(false);
      }
    };

    fetchFollowers();
  }, []);

  // return (
  //   <div className="h-full w-75 shrink-0 border-l-2 border-indigo-900 flex flex-col items-center">
  return (
    <aside className="neo-container w-75 h-full border-l-2 rounded-none flex flex-col">
      {/* Header */}
      <div className="border-b-2 p-5">
        <h2 className="text-2xl font-black">Chats</h2>

        <input
          type="text"
          placeholder="Search followers..."
          className="neo-input mt-4 bg-accent-1"
        />
      </div>
      {loading ? (
        <div className="h-full w-full flex items-center justify-center">
          <Spinner size={48} />
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto p-2 space-y-4">
          {followers.map((follower) => (
            <Link
              to={`/chat/${follower.username}/rcid/${follower._id}`}
              key={follower._id}
              className="neo-card bg-accent-2 w-full flex items-center justify-center gap-3 cursor-pointer"
            >
              <img
                src={
                  follower.profileImage ? follower.profileImage : defaultImage
                }
                className="h-12 w-12 rounded-full border-2"
              />

              <div className="flex-1 text-left">
                <h3 className="font-bold">{follower.username}</h3>
                <p className="text-sm text-muted-foreground">
                  Start chatting...
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </aside>
  );
  //   </div>
  // );
}

export default Chatbar;
