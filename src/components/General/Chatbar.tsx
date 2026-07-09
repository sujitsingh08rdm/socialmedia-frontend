import { useEffect, useRef, useState } from "react";
import Spinner from "./Spinner";
import defaultImage from "../../assets/default-profileImage.png";
import { NavLink } from "react-router-dom";

import { getUserConversations } from "../../api/chat.api";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import { setConversations } from "../../store/slices/chat.slice";
import { MessageCircleMore, X } from "lucide-react";

function Chatbar() {
  const user = useSelector((state: RootState) => state.auth);
  const [isChatOpen, setIsChatOpen] = useState(false);
  // const [conversations, setConversations] = useState<Conversation[]>([]);
  const dispatch = useDispatch();

  const conversations = useSelector(
    (state: RootState) => state.chat.conversations,
  );

  const hasUnreadChats = conversations.some(
    (conversation) => conversation.unreadCount > 0,
  );

  const [loading, setLoading] = useState<boolean>(false);

  function ChatbarContent() {
    return (
      <div>
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
                      <div className="flex items-center justify-between">
                        <p
                          className={`text-sm truncate ${
                            conversation.unreadCount > 0
                              ? "font-semibold text-black"
                              : "text-muted-foreground"
                          }`}
                        >
                          {conversation.lastMessage.text}
                        </p>

                        {conversation.unreadCount > 0 && (
                          <span className="ml-2 min-w-6 h-6 px-2 flex items-center justify-center rounded-full bg-red-500 text-white text-xs font-bold">
                            {conversation.unreadCount}
                          </span>
                        )}
                      </div>
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
      </div>
    );
  }

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
    <>
      {/* ================= MOBILE ================= */}
      {/* Floating Chat Button */}
      <button
        onClick={() => setIsChatOpen(true)}
        className="fixed z-50 bottom-4 right-4 2xl:hidden neo-button p-3 rounded-full bg-accent-1"
      >
        <div className="relative">
          <MessageCircleMore size={24} />

          {hasUnreadChats && (
            <span
              className="
        absolute
        -top-1
        -right-1
        h-4
        w-4
        rounded-full
        bg-red-500
        border-2
        border-white
      "
            />
          )}
        </div>
      </button>

      {/* Backdrop */}
      {isChatOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 2xl:hidden"
          onClick={() => setIsChatOpen(false)}
        />
      )}

      {/* Drawer */}
      <div
        className={`
        fixed
        top-0
        right-0
        h-screen
        w-[72vw]
        md:w-[88vw]
        max-w-sm
        bg-accent-2
        z-50
        transition-transform
        duration-300
        2xl:hidden
        ${isChatOpen ? "translate-x-0" : "translate-x-full"}
      `}
      >
        {/* Drawer Header */}
        <div className="flex items-center bg-accent-1 justify-between p-4 border-b-2">
          <h2 className="text-2xl font-black">Chats</h2>

          <button
            onClick={() => setIsChatOpen(false)}
            className="neo-button p-1"
          >
            <X />
          </button>
        </div>

        <ChatbarContent />
      </div>

      {/* ================= DESKTOP ================= */}

      <aside className="hidden 2xl:flex neo-container w-75 h-full border-l-2 rounded-none flex-col">
        <div className="border-b-2 p-5">
          <h2 className="text-2xl font-black">Chats</h2>
        </div>

        <ChatbarContent />
      </aside>
    </>
  );
}

export default Chatbar;
