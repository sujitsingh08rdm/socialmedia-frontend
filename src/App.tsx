import { Routes, Route } from "react-router-dom";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getCurrentUser } from "./api/auth.api";
import { setUser, setAuthLoad } from "./store/slices/auth.slice";
import ProtectedRoute from "./routes/ProtectedRoute";
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
import {
  addNotification,
  setNotifications,
} from "./store/slices/notification.slice";
import type { Notification } from "./types/notification";
import { getNotification } from "./api/notification.api";
import NotificationPage from "./pages/NotificationPage";
import PostDetailsPage from "./pages/PostDetailsPage";
import MainPage from "./pages/MainPage";

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
    const handleNotification = (notification: Notification) => {
      dispatch(addNotification(notification));

      toast.success(`${notification.sender.username} liked your post ❤️`);
    };

    socket.on("notification", handleNotification);

    return () => {
      socket.off("notification", handleNotification);
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
    if (!user) return;

    const loadNotifications = async () => {
      const response = await getNotification();

      dispatch(setNotifications(response));
    };

    loadNotifications();
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
            <PublicRoute>
              <MainPage />
            </PublicRoute>
          }
        />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <FeedPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/:postId"
          element={
            <ProtectedRoute>
              <PostDetailsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile/:username"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
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
            <ProtectedRoute>
              <UploadPostPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <NotificationPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/post/edit/:postId"
          element={
            <ProtectedRoute>
              <EditPostPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/chat/:username/rcid/:receiverId"
          element={
            <ProtectedRoute>
              <ChatPage />
            </ProtectedRoute>
          }
        />
      </Routes>
      <ToastContainer />
    </div>
  );
}

export default App;
