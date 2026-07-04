import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";

import {
  getMessage,
  getOrCreateConversation,
  sendMessage,
} from "../../api/chat.api";
import Spinner from "../General/Spinner";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import type { Conversation, Message } from "../../types/chat";

import defaultImage from "../../assets/default-profileImage.png";
import { Image, Send } from "lucide-react";

import { ChatImage } from "./ChatImage";
import { socket } from "../../socket/socket";
import { formatMessageTime } from "../../utils/formatMessageTime";
import {
  addMessage,
  setMessages,
  updateConversation,
} from "../../store/slices/chat.slice";

function ChatContainer() {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

  const messages = useSelector((state: RootState) => state.chat.messages);
  const { receiverId } = useParams<{
    receiverId: string;
  }>();
  const [conversationId, setConversationId] = useState<string | null>(null);

  const [image, setImage] = useState<File | null>(null);

  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    if (sending) return;
    if (!conversationId || !text.trim()) {
      return;
    }
    try {
      setSending(true);
      const formData = new FormData();
      formData.append("conversationId", conversationId);

      if (text.trim()) {
        formData.append("text", text);
      }

      if (image) {
        formData.append("image", image);
      }

      const response = await sendMessage(formData);

      const { conversation, message } = response;

      // setMessages((prev) => {
      //   const exists = prev.find((m) => m._id === msg._id);

      //   if (exists) {
      //     console.log("Duplicate ignored");
      //     return prev;
      //   }

      //   return [...prev, msg];
      // });
      dispatch(addMessage(message));

      dispatch(updateConversation(conversation));

      setText("");
      setImage(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error(error);
    } finally {
      setSending(false);
    }
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  useEffect(() => {
    const initChat = async () => {
      try {
        setLoading(true);
        if (!receiverId) return;
        const conversation = await getOrCreateConversation(receiverId);
        setConversationId(conversation._id);

        console.log("Joining room:", conversation._id);
        socket.emit("join_conversation", conversation._id);

        const msgs = await getMessage(conversation._id);
        // setMessages(msgs.reverse());
        dispatch(setMessages(msgs.reverse()));
        setLoading(false);
      } catch (error) {
        console.log(error, "Error initiating chat");
      } finally {
        setLoading(false);
      }
    };
    initChat();
  }, [receiverId]);

  useEffect(() => {
    if (!conversationId) return;

    return () => {
      socket.emit("leave_conversation", conversationId);
    };
  }, [conversationId]);

  useEffect(() => {
    const handleConversationUpdated = (data: {
      conversation: Conversation;
      message: Message;
    }) => {
      dispatch(addMessage(data.message));

      dispatch(updateConversation(data.conversation));
    };

    socket.on("conversationUpdated", handleConversationUpdated);

    return () => {
      socket.off("conversationUpdated", handleConversationUpdated);
    };
  }, [dispatch]);

  if (loading)
    return (
      <div className="min-w-[63vw] p-2 flex-1 flex flex-col items-center justify-center user-profile-scroll overflow-y-auto neo-container bg-secondary m-1">
        <Spinner size={48} /> Loading Chat...
      </div>
    );

  return (
    <div className="min-w-[63vw] p-2 flex-1 flex flex-col user-profile-scroll overflow-y-auto neo-container bg-secondary m-1">
      {/* Header */}
      <div className="flex items-center justify-between border-b-2 p-4">
        <div>
          <h2 className="text-xl font-black"> Chat </h2>
          <p className="text-sm opacity-70">
            {messages.length} message{messages.length !== 1 && "s"}
          </p>
        </div>
      </div>
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 user-profile-scroll">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <div className="neo-card bg-accent-2 p-6">
              <h3 className="font-bold text-lg text-center">
                👋Start the conversation
              </h3>
            </div>
          </div>
        ) : (
          messages.map((message, index) => {
            const isMine = message.sender._id === user?._id;

            const nextMessage = messages[index + 1];

            const showAvatar =
              !nextMessage || nextMessage.sender._id !== message.sender._id;

            return (
              <div
                key={message._id}
                className={`flex items-end gap-1 ${isMine ? "justify-end" : "justify-start"}`}
              >
                {!isMine && showAvatar ? (
                  <img
                    src={message.sender.profileImage || defaultImage}
                    alt={message.sender.username}
                    className="h-10 w-10 rounded-full border-2 border-black object-cover shrink-0"
                  />
                ) : (
                  <div className="w-8" />
                )}
                <div
                  className={`neo-container pt-2 w-auto border-1 max-w-[70%] px-2 py-1 ${
                    isMine ? "bg-accent-1" : "bg-accent-2"
                  }`}
                >
                  {message.image && <ChatImage src={message.image} />}

                  {message.text && (
                    <p className="break-words">{message.text}</p>
                  )}

                  <p className="mt-1 text-right text-xs opacity-60">
                    {formatMessageTime(message.createdAt)}
                  </p>
                </div>
                {isMine && showAvatar ? (
                  <img
                    src={user.profileImage || defaultImage}
                    alt={user.username}
                    className="h-10 w-10 rounded-full border-2 border-black object-cover shrink-0"
                  />
                ) : (
                  <div className="w-8" />
                )}
                <div ref={bottomRef} />
              </div>
            );
          })
        )}
      </div>
      {/* Input */}

      <div className="border-t-2 p-4 bg-secondary">
        {/* Image Preview */}
        {image && (
          <div className="mb-3 inline-block relative">
            <img
              src={URL.createObjectURL(image)}
              className={`h-24 w-24 object-cover rounded-xl border-2 border-black ${sending && "opacity-60"}`}
            />

            <button
              disabled={sending}
              onClick={() => {
                setImage(null);
                if (fileInputRef.current) {
                  fileInputRef.current.value = "";
                }
              }}
              className="absolute -top-2 -right-2 h-7 w-7 rounded-full bg-red-500 text-white border-2 border-black flex items-center justify-center cursor-pointer disabled:opacity-65 disabled:cursor-not-allowed"
            >
              ✕
            </button>
          </div>
        )}

        <div className="flex items-center gap-3">
          {/* Hidden Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => {
              if (e.target.files?.length) {
                setImage(e.target.files[0]);
              }
            }}
          />

          {/* Image Button */}
          <button
            disabled={sending}
            onClick={() => fileInputRef.current?.click()}
            className="neo-button bg-accent-1 h-12 w-12 flex items-center justify-center shrink-0 disabled:opacity-50"
          >
            <Image size={22} />
          </button>

          {/* Message Input */}
          <input
            value={text}
            disabled={sending}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type a message..."
            className="neo-input flex-1 h-12 px-4 disabled:opacity-50"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
          />

          {/* Send */}
          <button
            disabled={sending || (!text.trim() && !image)}
            onClick={handleSend}
            className="neo-button bg-accent-2 h-12 w-12 flex items-center justify-center shrink-0 disabled:opacity-50"
          >
            {sending ? <Spinner size={18} /> : <Send size={20} />}
          </button>
        </div>
      </div>
    </div>
  );
}
export default ChatContainer;
