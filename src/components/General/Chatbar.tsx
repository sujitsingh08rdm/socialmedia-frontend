import { useEffect, useState } from "react";
import Spinner from "./Spinner";
import defaultImage from "../../assets/default-profileImage.png";
import { NavLink } from "react-router-dom";
import type { Conversation } from "../../types/chat";
import { getUserConversations } from "../../api/chat.api";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import { setConversations } from "../../store/slices/chat.slice";

function Chatbar() {
  const user = useSelector((state: RootState) => state.auth);
  // const [conversations, setConversations] = useState<Conversation[]>([]);
  const dispatch = useDispatch();

  const conversations = useSelector(
    (state: RootState) => state.chat.conversations,
  );

  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const loadConversation = async () => {
      try {
        setLoading(true);
        const response = await getUserConversations();

        dispatch(setConversations(response));
      } catch (error) {
        console.log(error, "failed to fetch followers");
      } finally {
        setLoading(false);
      }
    };

    loadConversation();
  }, []);

  return (
    <aside className="neo-container w-75 h-full border-l-2 rounded-none flex flex-col">
      {/* Header */}
      <div className="border-b-2 p-5">
        <h2 className="text-2xl font-black">Chats</h2>
      </div>
      {loading ? (
        <div className="h-full w-full flex items-center justify-center">
          <Spinner size={48} />
        </div>
      ) : conversations.length === 0 ? (
        <div className="flex text-xl font-medium flex-1 overflow-y-auto p-2 space-y-4">
          No conversation yet..
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto p-2 space-y-4">
          {conversations.map((conversation) => {
            const otherUser = conversation.participants.find(
              (participant) => participant._id !== user.user?._id,
            );

            if (!otherUser) return null;
            return (
              <NavLink
                key={conversation._id}
                to={`/chat/${otherUser.username}/rcid/${otherUser._id}`}
                className={({ isActive }) =>
                  `neo-card w-full flex items-center gap-3 p-3 border-2 transition-all ${
                    isActive ? "bg-violet-300" : "bg-accent-2"
                  }`
                }
              >
                <img
                  src={
                    otherUser.profileImage
                      ? otherUser.profileImage
                      : defaultImage
                  }
                  className="h-12 w-12 rounded-full border-2"
                />

                <div className="flex-1 text-left">
                  <h3 className="font-bold">{otherUser.username}</h3>
                  {conversation.lastMessage ? (
                    <p className="text-sm text-muted-foreground">
                      {conversation.lastMessage.text}
                    </p>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Start chatting...
                    </p>
                  )}
                </div>
              </NavLink>
            );
          })}
        </div>
      )}
    </aside>
  );
  //   </div>
  // );
}

export default Chatbar;
