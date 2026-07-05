import { Routes, Route } from "react-router-dom";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getCurrentUser } from "./api/auth.api";
import { setUser, setAuthLoad } from "./store/slices/auth.slice";
import ProctectedRoute from "./routes/ProctectedRoute";
import PublicRoute from "./routes/PublicRoute";
import FeedPage from "./pages/FeedPage";
import ProfilePage from "./pages/ProfilePage";
import UploadPostPage from "./pages/UploadPostPage";
import EditPostPage from "./pages/EditPostPage";
import ChatPage from "./pages/ChatPage";
import { socket } from "./socket/socket";
import type { RootState } from "./store/store";
import { Socket } from "socket.io-client";
import type { Conversation } from "./types/chat";
import type { Message } from "react-hook-form";
import { updateConversation } from "./store/slices/chat.slice";

function App() {
  const user = useSelector((state: RootState) => state.auth.user);

  const dispatch = useDispatch();

  useEffect(() => {
    const handleConversationUpdated = (data: {
      conversation: Conversation;
      message: Message;
    }) => {
      console.log("APP received conversationUpdated", data);
      dispatch(updateConversation(data.conversation));
    };

    socket.on("conversationUpdated", handleConversationUpdated);

    return () => {
      socket.off("conversationUpdated", handleConversationUpdated);
    };
  }, [dispatch]);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const response = await getCurrentUser();

        dispatch(setUser(response.data));
      } catch (error) {
      } finally {
        dispatch(setAuthLoad());
      }
    };
    loadUser();
  }, [dispatch]);

  useEffect(() => {
    if (!user) return;

    if (!socket.connected) {
      socket.connect();
    }

    const handleConnect = () => {
      console.log("Connected:", socket.id);
      socket.emit("join", user._id);
    };

    socket.on("connect", handleConnect);

    // If already connected (page refreshed after auth)
    if (socket.connected) {
      handleConnect();
    }

    return () => {
      socket.off("connect", handleConnect);
    };
  }, [user]);

  useEffect(() => {
    (window as any).socket = Socket;
  }, []);

  return (
    <div className="bg-primary min-h-screen">
      <Routes>
        <Route
          index
          element={
            <ProctectedRoute>
              <FeedPage />
            </ProctectedRoute>
          }
        />
        <Route
          path="/profile/:username"
          element={
            <ProctectedRoute>
              <ProfilePage />
            </ProctectedRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <RegisterPage />
            </PublicRoute>
          }
        />

        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />
        <Route
          path="/upload-post"
          element={
            <ProctectedRoute>
              <UploadPostPage />
            </ProctectedRoute>
          }
        />
        <Route
          path="/post/edit/:postId"
          element={
            <ProctectedRoute>
              <EditPostPage />
            </ProctectedRoute>
          }
        />
        <Route
          path="/chat/:username/rcid/:receiverId"
          element={
            <ProctectedRoute>
              <ChatPage />
            </ProctectedRoute>
          }
        />
      </Routes>
      <ToastContainer />
    </div>
  );
}

export default App;
